const api = require('./api/api');
const utils = require('./utils');
const mqtt = require('mqtt');
const conf = require('./conf');
const reviewService = require('./noedit/progress/review-service');

const Logger = require('./noedit/log/logger');

const JoinRequestPacketDecoder = require('./decoder/JoinRequestPacketDecoder');

const gatewayRxTopicRegex = new RegExp("^gateway/([0-9a-fA-F]+)/rx$");

const validAppEUI = utils.hexStringToBytes(conf.user.appEUI);
const validMockAppEUI = utils.hexStringToBytes(conf.user.mockAppEUI);
const deviceEUI = utils.hexStringToBytes(conf.user.deviceEUI);
const deviceNetworkKey = utils.normalizeHexString(conf.user.nwkKey);

const logger = Logger.child({service: 'index'});
let client;

let init = () => {
  reviewService.init();
  client = mqtt.connect(conf.mqtt.host, {
    username: conf.mqtt.username,
    password: conf.mqtt.password,
    clientId: conf.mqtt.clientId
  });
  client.on('connect', () => {
    client.subscribe('#', (err) => {
      if (err) {
        process.exit(1);
      }
    });
  });
  client.on("message", onMessage);
};

/**
 * Step 2
 * @param topic
 * @param message
 */
let onMessage = async (topic, message) => {
  if (!connectedToMqtt){
    connectedToMqtt = true;
    logger.log('info',"Congrats! you are successfully receiving messages from the MQTT Broker")
  }
  if (!gatewayRxTopicRegex.test(topic)) {
    return;
  }

  let msgDecoder = new JoinRequestPacketDecoder(topic, message);
  if (!msgDecoder.isSupported()) {
    logger.log('verbose', 'msg received is not a JoinRequest, according to your JoinRequestPacketDecoder#isSupported method ;)');
    return;
  }

  logger.debug("Join Request identified");
  let decodedJoinRequest = msgDecoder.decode();
  logger.debug("Decoded:" + JSON.stringify(decodedJoinRequest));

  // Congratulations, you are decoding all the join requests of the LoRa network.
  // However, we want to be smart hackers and only activate your friend's device on the specific APP_EUI
  if (isValidAppEUI(decodedJoinRequest.appEUI) && isRightDeviceEUI(decodedJoinRequest.devEUI)) {
    logger.log('verbose',"AppEUI and DevEUI are valid. Will register device");
    if (!await api.deviceExists(decodedJoinRequest.devEUI)) {
      await api.createDevice({
        devEUI: decodedJoinRequest.devEUI,
        applicationID: conf.loRaServer.loRaApplicationId,
        deviceProfileID: conf.loRaServer.rak811DevProfileId,
        name: conf.user.clientId,
        description: '4242'
      });
    }
    if (!await api.deviceNwkKeyExists(decodedJoinRequest.devEUI)) {
      await api.setDeviceNwkKey(decodedJoinRequest.devEUI, deviceNetworkKey);
    }
    logger.log('verbose',"Device registered successfully");
  }
};

/**
 * Check whether the AppEUI of the intercepted message is the one we want to work on
 * @param msgAppEUI string|Uint8Array
 * @returns {boolean}
 */
let isValidAppEUI = (msgAppEUI) => {
  return utils.arraysEqual((typeof msgAppEUI === 'string') ? utils.hexStringToBytes(msgAppEUI) : msgAppEUI, validAppEUI) || utils.arraysEqual((typeof msgAppEUI === 'string') ? utils.hexStringToBytes(msgAppEUI) : msgAppEUI, validMockAppEUI);
};

/**
 * Check whether the DeviceEUI equals the team's device.
 * @param devEUI string|Uint8Array
 * @returns {boolean}
 */
let isRightDeviceEUI = (devEUI) => {
  return utils.arraysEqual((typeof devEUI === 'string') ? utils.hexStringToBytes(devEUI) : devEUI, deviceEUI);
};

init();

let connectedToMqtt = false;
let waiting = 0;
checkMqttConnection = setInterval(() => {
  if (!connectedToMqtt) {
    if (waiting<3){
      waiting++;
      logger.log('info',"waiting for messages from MQTT broker")
    }else{
      logger.log('warn', "you should have received messages from MQTT broker by now, check how you connect to it")
    }
  } else {
    clearInterval(checkMqttConnection)
  }
}, 3000);
