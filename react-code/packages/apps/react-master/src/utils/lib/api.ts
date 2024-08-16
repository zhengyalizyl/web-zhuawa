import { BaseTrack, UserTrackData } from "./track";

const t = new BaseTrack();

export const sendLog = <T>(data: T) => {
    t.track(data as T & UserTrackData)
}