import Logger from '../log/logger';
import * as appServerClient from './lora-appserver-client';
import * as progressService from '../progress/progress-service';
import * as teamDao from "../team/team-dao";
import Team from "../team/models/Team";
import {DeviceDescriptor} from "./models/DeviceDescriptor";
import {config} from "../config";
import {normalizeHexString} from "../utils";
import Timeout = NodeJS.Timeout;

const pg = require('../progress/models/Progress');
const logger = Logger.child({service: 'appserver-service'});


let loopCallback: Timeout;
let initialized: boolean = false;

export const isStarted = (): boolean => {
    return initialized;
};

export const init = () => {
    logger.info("Initializing AppServer checks");
    if (loopCallback) {
        clearInterval(loopCallback);
    }
    loopCallback = setInterval(checkDevices, 10000);
    initialized = true;
    checkDevices();
};

const checkDevices = async () => {
    logger.debug("Checking devices");
    let devices = await appServerClient.getRegisteredDevices();
    if (!devices) {
        return;
    }
    if (parseInt(devices.totalCount!) > 0) {
        for (let d of devices.result!) {
            let team = await teamDao.findByDevEUI(normalizeHexString(d.devEUI!));
            if (!team) {
                logger.warn(`Failed to retrieve team for: ${d.devEUI}`);
                continue;
            }
            await updateDeviceProgress(team, d);
        }
    }
};

const updateDeviceProgress = async (team: Team, d: DeviceDescriptor): Promise<boolean> => {
    let deviceKeys = await appServerClient.getKeys(d.devEUI!);
    if (!deviceKeys || !deviceKeys.nwkKey || normalizeHexString(deviceKeys.nwkKey!) !== normalizeHexString(config.loRaServer.targetNwkKey)) {
        return true;
    }
    // Device keys match the target. We can validate this step
    if (!team.progress.hackerSteps!.find(step => step.tag === pg.HACKER_STEP_REGISTER_DEVICE)!.validated) {
        let success = await progressService.validateDeviceCreated(team);
        if (!success) {
            logger.warn(`Failed to update progress for team: ${team.name}`);
            return false;
        }
    }
    return true;
};

export const resetApplication = async (): Promise<boolean> => {
    let devices = await appServerClient.getRegisteredDevices();
    if (!devices || !devices.result || devices.result.length === 0) {
        return true;
    }
    for (let d of devices.result!) {
        let success = await appServerClient.deleteDevice(d);
        if (!success) {
            return false;
        }
    }
    return true;
};
