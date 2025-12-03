"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHeader = readHeader;
exports.readHeaderData = readHeaderData;
exports.writeHeader = writeHeader;
exports.writeHeaderData = writeHeaderData;
exports.fixHeader = fixHeader;
const bitwriter_1 = require("../binary/bitwriter");
async function readHeader(char, reader) {
    char.header = {};
    //0x0000
    char.header.identifier = reader.ReadUInt32().toString(16).padStart(8, "0");
    if (char.header.identifier != "aa55aa55") {
        throw new Error(`D2S identifier 'aa55aa55' not found at position ${reader.offset - 4 * 8}`);
    }
    //0x0004
    char.header.version = reader.ReadUInt32();
}
async function readHeaderData(char, reader, constants) {
    const v = await _versionSpecificHeader(char.header.version);
    if (v == null) {
        throw new Error(`Cannot parse version: ${char.header.version}`);
    }
    v.readHeader(char, reader, constants);
}
async function writeHeader(char) {
    const writer = new bitwriter_1.BitWriter();
    writer.WriteUInt32(parseInt(char.header.identifier, 16)).WriteUInt32(char.header.version);
    return writer.ToArray();
}
async function writeHeaderData(char, constants) {
    const writer = new bitwriter_1.BitWriter();
    const v = await _versionSpecificHeader(char.header.version);
    if (v == null) {
        throw new Error(`Cannot parse version: ${char.header.version}`);
    }
    v.writeHeader(char, writer, constants);
    return writer.ToArray();
}
async function fixHeader(writer) {
    let checksum = 0;
    const eof = writer.length / 8;
    writer.SeekByte(0x0008).WriteUInt32(eof);
    writer.SeekByte(0x000c).WriteUInt32(0);
    for (let i = 0; i < eof; i++) {
        let byte = writer.SeekByte(i).PeekBytes(1)[0];
        if (checksum & 0x80000000) {
            byte += 1;
        }
        checksum = byte + checksum * 2;
        //hack make it a uint32
        checksum >>>= 0;
    }
    //checksum pos
    writer.SeekByte(0x000c).WriteUInt32(checksum);
}
/**
 * Save Version
 * 0x47, 0x0, 0x0, 0x0 = <1.06
 * 0x59, 0x0, 0x0, 0x0 = 1.08 = version
 * 0x5c, 0x0, 0x0, 0x0 = 1.09 = version
 * 0x60, 0x0, 0x0, 0x0 = 1.13c = version
 * 0x62, 0x0, 0x0, 0x0 = 1.2 = version
 * */
async function _versionSpecificHeader(version) {
    switch (version) {
        case 0x60: {
            return await Promise.resolve().then(() => __importStar(require(`./versions/default_header`)));
        }
        default: {
            return await Promise.resolve().then(() => __importStar(require(`./versions/default_header`)));
        }
    }
}
