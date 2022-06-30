# json2collectdmqtt

> JSON to collectd MQTT message bridge

This project converts JSON messages like this:

**Topic:** `sensors/data`
```json
{
	"id": "autoplant-a",
	"sensor": "temperature",
	"value": 24.48
}
```

...to collectd messages like this:

**Topic:** `collectd/autoplant/sensors-a/temperature`
```
1656608692.633:24.47
```

Originally, I built this for [my autoplant plant monitoring project](https://git.starbeamrainbowlabs.com/sbrl/autoplant), but I'm sharing this tool here just in case it's useful to someone else.


## System Requirements
 - A recent version of Node.js (the default `nodejs` package in Debian distros is waaay too old)


## Getting Started
First, install the command:

```bash
sudo npm install json2collectdmqtt
```

Windows users will need to remove the `sudo` there.

To run it, do this:

```bash
json2collectdmqtt --server mqtts://mqtt.example.com:8883/
```

Full CLI help can be found by executing it with `--help`:

```bash
json2collectdmqtt --help
```

### Registering a systemd service
Normally, you'll want json2collectdmqtt to keep running forever, so the recommended way to do this is by registering a service file with your system's service manager. On most systems, that's unfortunately systemd.

An example systemd service file can be found in [`json2collectdmqtt.service`](./json2collectdmqtt.service). If you are using this exampel systemd service file, remember to edit the server address to match your server, and add any other command-line arguments you may need to it. Futhermore, create the file `/etc/default/json2collectdmqtt`, and put something like this in it:

```ini
MQTT_USERNAME=someusername
MQTT_PASSWORD=somepassword
```

Don't forget to set the permissions properly too:

```bash
sudo chmod 0660 /etc/default/json2collectdmqtt
```


## Security
If you've found a security issue, please don't open an issue. Instead, get in touch privately - e.g. via [Keybase](https://keybase.io/sbrl) or by email (`security [at sign] starbeamrainbowlabs [replace me with a dot] com`), and I'll try to respond ASAP.

If you would like to encrypt any communications with me, you can find my GPG key [here](https://starbeamrainbowlabs.com/sbrl.asc).


## Contributing
Contributions are very welcome - both issues and pull requests! Please mention in your pull request that you release your work under the MPL-2.0 (see below).

If you're feeling that way inclined, the sponsor button at the top of the page (if you're on GitHub) will take you to my [Liberapay profile](https://liberapay.com/sbrl) if you'd like to donate to say an extra thank you :-)


## License
json2collectdmqtt is released under the Mozilla Public License 2.0. The full license text is included in the `LICENSE` file in this repository. Tldr legal have a [great summary](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)) of the license if you're interested.
