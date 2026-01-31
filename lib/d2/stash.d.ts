import * as types from "./types";
export declare function readStash(buffer: Uint8Array, mod: string, userConfig?: types.IConfig): Promise<types.IStash>;
export declare function writeStash(data: types.IStash, mod: string, version: number, userConfig?: types.IConfig): Promise<Uint8Array>;
