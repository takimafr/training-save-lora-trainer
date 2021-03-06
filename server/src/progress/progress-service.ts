import Logger from '../log/logger';
import Team from '../team/models/Team';
import * as teamDao from '../team/team-dao';
import Step from './models/Step';
import {concat, every, find, indexOf, map, take} from 'lodash';
import {
    GEEK_IN_DANGER_STEP_GPS_LOCATION_SENT,
    GEEK_IN_DANGER_STEP_JOIN_REQUEST_SENT,
    HACKER_STEP_BROKER_CONNECT,
    HACKER_STEP_BROKER_SUBSCRIBE,
    HACKER_STEP_REGISTER_DEVICE,
    HACKER_STEP_JOIN_REQUEST_DECODE,
    HACKER_STEP_JOIN_REQUEST_SUPPORTED,
} from "./models/Progress";

const logger = Logger.child({service: 'progress'});

const stepsOrder = [
    HACKER_STEP_BROKER_CONNECT,
    HACKER_STEP_BROKER_SUBSCRIBE,
    HACKER_STEP_JOIN_REQUEST_SUPPORTED,
    HACKER_STEP_JOIN_REQUEST_DECODE,
    HACKER_STEP_REGISTER_DEVICE,
    GEEK_IN_DANGER_STEP_JOIN_REQUEST_SENT,
    GEEK_IN_DANGER_STEP_GPS_LOCATION_SENT
];

const hasCompletedPreviousSteps = (team: Team, tag: string): boolean => {
    const index: number = indexOf(stepsOrder, tag);
    if (index === 0) {
        return true;
    }
    const steps: string[] = take(stepsOrder, index);
    const teamProgress = concat(team.progress.hackerSteps || [], team.progress.geekInDangerSteps || []);
    const filtered = map(steps, step => {
        const team = find(teamProgress, s => s.tag === step);
        return team && team.validated || false;
    });
    return Boolean(filtered.length) && every(filtered, (v) => v === true);
};

const validateStep = async (team: Team, tag: string): Promise<boolean> => {
    if (!hasCompletedPreviousSteps(team, tag)) {
        return Promise.resolve(false);
    }

    let step: Step = team.progress.hackerSteps!.find(s => s.tag === tag)!;

    if (!step) {
        step = team.progress.geekInDangerSteps!.find(s => s.tag === tag)!;
    }

    if (step.validated) {
        return Promise.resolve(true);
    }
    step.validated = true;
    step.timestamp = Date.now();
    return await teamDao.updateProgress(team);
};

export const validateJoinRequestSent = async (team: Team): Promise<boolean> => {
    return await validateStep(team, GEEK_IN_DANGER_STEP_JOIN_REQUEST_SENT);
};

export const validateGpsLocationReceived = async (team: Team): Promise<boolean> => {
    return await validateStep(team, GEEK_IN_DANGER_STEP_GPS_LOCATION_SENT)
};

export const validateDeviceCreated = async (team: Team): Promise<boolean> => {
    return await validateStep(team, HACKER_STEP_REGISTER_DEVICE);
};

export const validateDeviceNwkKeySet = async (team: Team): Promise<boolean> => {
    return Promise.resolve(true);
};

export const validateMQTTConnect = async (team: Team): Promise<boolean> => {
    return await validateStep(team, HACKER_STEP_BROKER_CONNECT);
};

export const validateMQTTSubscription = async (team: Team): Promise<boolean> => {
    return await validateStep(team, HACKER_STEP_BROKER_SUBSCRIBE);
};

export const validateJoinRequestSupported = async (team: Team): Promise<boolean> => {
    return await validateStep(team, HACKER_STEP_JOIN_REQUEST_SUPPORTED);
};

export const validateJoinRequestDecode = async (team: Team): Promise<boolean> => {
    return await validateStep(team, HACKER_STEP_JOIN_REQUEST_DECODE);
};

