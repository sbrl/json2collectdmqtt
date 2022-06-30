"use strict";

export default function(cli) {
	cli.subcommand("start", "Starts the JSON → collectd mqtt bridge.")
		.argument("server", "Address of the MQTT server to connect to. Credentialsre REQUIRED and should be in the MQTT_USERNAME and MQTT_PASSWORD environment variables respectively. Example: mqtts://example.com:8883", null, "string")
		.argument("topic-source", "Source topic to read JSON messages from. Default: sensors/data", "sensors/data", "string")
		.argument("topic-target", "Target topic to write collectd messages to. Default: collectd", "collectd", "string")
		.argument("topic-will", "Target topic to send will messages to in the event of an unclean disconnect.", null, "string");
}
