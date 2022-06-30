"use strict";


import settings from '../../settings.mjs';
import MqttBridge from '../../lib/MqttBridge.mjs';

export default async function () {
	if(typeof settings.cli.server !== "string")
		throw new Error("Error: No server address specified (see the --server CLI argument");
	
	if(typeof process.env.MQTT_USERNAME !== "string")
		throw new Error(`Error: No mqtt username specified in the MQTT_USERNAME environment variable.`);
	if(typeof process.env.MQTT_PASSWORD  !== "string")
		throw new Error(`Error: No mqtt password  specified in the MQTT_PASSWORD environment variable.`);
	
	const bridge = new MqttBridge(
		settings.cli.server,
		settings.cli.topic_source,
		settings.cli.topic_target,
		settings.cli.topic_will ?? null
	);
	
	await bridge.listen(
		process.env.MQTT_USERNAME,
		process.env.MQTT_PASSWORD,
	);
}
