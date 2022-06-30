"use strict";

import mqtt from 'async-mqtt';
import settings from '../settings.mjs';

import log from './io/NamespacedLog.mjs'; const l = log("mqttbridge");

class MqttBridge {
	#client = null;
	
	constructor(remote_address, topic_source, topic_target, topic_will = `system/errors`) {
		this.remote_address = remote_address;
		this.topic_source = topic_source;
		this.topic_target = topic_target;
		this.topic_will = topic_will;
	}
	
	async listen(mqtt_username, mqtt_password) {
		const mqtt_opts = {
			username: mqtt_username,
			password: mqtt_password,
			clientId: `json2collectd_mqttjs_` + Math.random().toString(16).substring(2)
		};
		if(typeof topic_will === "string") {
			mqtt_opts.will = {
				topic: topic_will,
				payload: `json2collectdmqtt: unclean disconnect`
			};
			l.log(`will set to topic ${this.topic_will}`);
		}
		l.log(`topic target: ${this.topic_target}`)
		
		this.#client = await mqtt.connectAsync(this.remote_address, mqtt_opts);
		l.log(`connected to ${this.remote_address}`);
		this.#client.on("message", this.#handle_message.bind(this));
		this.#client.on("error", this.#handle_error.bind(this));
		await this.#client.subscribe(this.topic_source);
		l.log(`subscribed to ${this.topic_source}`);
	}
	
	#handle_error(error) {
		l.error(`${a.fred}${a.hicol}${settings.cli.verbose ? error.stack : error.message}${a.reset}`);
	}
	
	async #handle_message(topic_in, message_in, _packet) {
		
		let obj;
		try {
			obj = JSON.parse(message_in);
		}
		catch(error) {
			l.warn(`Ignoring message we failed to parse:`, error);
		}
		
		l.info(`message: ${topic_in} →`, obj);
		
		const validation_result = MqttBridge.message_validate(obj);
		if(validation_result !== true) {
			l.warn(`Message failed validation: ${validation_result}`);
			return;
		}
		
		const { topic, payload } = this.message_convert(obj);
		await this.#client.publish(topic, payload);
	}
	
	
	message_convert(obj) {
		/*
		 * Example message:
		 * { id: 'autoplant-a', sensor: 'pressure', value: 1009.17 }
		 */
		
		const [ host, instance ] = obj.id.split(`-`, 2);
		
		let plugin = `sensors`;
		if(instance) plugin += `-${instance}`;
		return {
			topic: `${this.topic_target}/${host}/${plugin}/${obj.sensor}`,
			payload: `${new Date() / 1000}:${obj.value}`
		};
	}
	
	static message_validate(obj) {
		if(obj instanceof Array)
			return `Object is an array.`;
		if(typeof obj.id !== "string")
			return `id property is not a string.`;
		if(typeof obj.sensor !== "string")
			return `sensor property is not a string.`;
		if(typeof obj.value !== "number")
			return `value property is not a number.`;
		if(isNaN(obj.value))
			return `value property is NaN.`;
		
		return true;
	}
}

export default MqttBridge;