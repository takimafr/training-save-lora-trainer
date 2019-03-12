/**
 * Hi, I'm John Doe.
 * I sniffed the App Server interactions last night (the http traffic was not secured... noobs) and managed to find the right Authentication details.
 * I made a small client for you to use with just a few features.
 * Good luck!
 * @type {string}
 */
const Logger = require('../log/logger');
const conf = require('../conf');
const axios = require('axios');

const authHeader = "Authorization";
const logger = Logger.child({service: 'api'});


const client = axios.create({
  baseURL: conf.loRaServer.baseUrl,
  headers: {[authHeader]: "Bearer " + conf.loRaServer.authToken}
});

const deviceExists = async (devEUI) => {
  try {
    const response = await client.get(`/devices/${devEUI}`);
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    if (e.response.status === 404) {
      return false;
    }
    logger.error("Error occured during call to http api", e);
    throw e;
  }
};

/**
 * @param device
 * {
 *     devEUI: {string},
 *     applicationID: {string|number},
 *     deviceProfileID: {string},
 *     name: {string},
 *     description: {string}
 * }
 * @returns {Promise<*>}
 */
const createDevice = async (device) => {
  try {
    const response = await client.post('/devices', {device: device});
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    logger.error("Error occured during call to http api", e);
    throw e;
  }
};


const deviceNwkKeyExists = async (devEUI) => {
  try {
    const response = await client.get(`/devices/${devEUI}/keys`);
    logger.debug("Response received", response.data);
    return !!response;
  } catch (e) {
    if (e.response.status === 404) {
      return false;
    }
    logger.error("Error occured during call to http api", e);
    throw e;
  }
};


/**
 *
 * @param devEUI {string} hex string
 * @param nwkKey {string} hex string
 * @returns {Promise<*>}
 */
const updateDeviceNwkKey = async (devEUI, nwkKey) => {
  try {
    const response = await client.put(`/devices/${devEUI}/keys`, {
      deviceKeys: {
        devEUI: devEUI,
        nwkKey: nwkKey
      }
    });
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    logger.error("Error occured during call to http api", e);
    throw e;
  }
};

/**
 *
 * @param devEUI {string} hex string
 * @param nwkKey {string} hex string
 * @returns {Promise<*>}
 */
const setDeviceNwkKey = async (devEUI, nwkKey) => {
  try {
    const response = await client.post(`/devices/${devEUI}/keys`, {
      deviceKeys: {
        devEUI: devEUI,
        nwkKey: nwkKey
      }
    });
    logger.debug("Response received", response.data);
    return response;
  } catch (e) {
    if (e.response.status === 409) {
      return await updateDeviceNwkKey(devEUI, nwkKey);
    }
    logger.error("Error occured during call to http api", e);
    throw e;
  }
};

module.exports = {
  deviceExists,
  createDevice,
  deviceNwkKeyExists,
  setDeviceNwkKey,
};
