import * as types from "./types";
export declare function enhanceAttributes(char: types.ID2S, mod: string, version: number): Promise<void>;
export declare function enhancePlayerAttributes(char: types.ID2S, mod: string, version: number): Promise<void>;
export declare function enhanceItems(items: types.IItem[], mod: string, version: number): Promise<void>;
export declare function generateFixedMods(mods: any[], constants: types.IConstantData): types.IMagicProperty[];
