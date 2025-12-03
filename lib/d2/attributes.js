"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAttributes = readAttributes;
exports.writeAttributes = writeAttributes;
const bitwriter_1 = require("../binary/bitwriter");
//todo use constants.magical_properties and csvBits
async function readAttributes(char, reader, constants) {
    char.attributes = {};
    const header = reader.ReadString(2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
    if (header != "gf") {
        // header is not present in first save after char is created
        if (char.header.level === 1) {
            const classData = constants.classes.find((c) => c.n === char.header.class).a;
            char.attributes = {
                strength: +classData.str,
                energy: +classData.int,
                dexterity: +classData.dex,
                vitality: +classData.vit,
                unused_stats: 0,
                unused_skill_points: 0,
                current_hp: +classData.vit + +classData.hpadd,
                max_hp: +classData.vit + +classData.hpadd,
                current_mana: +classData.int,
                max_mana: +classData.int,
                current_stamina: +classData.stam,
                max_stamina: +classData.stam,
                level: 1,
                experience: 0,
                gold: 0,
                stashed_gold: 0,
            };
            return;
        }
        throw new Error(`Attribute header 'gf' not found at position ${reader.offset - 2 * 8}`);
    }
    let bitoffset = 0;
    let id = reader.ReadUInt16(9);
    //read till 0x1ff end of attributes is found
    while (id != 0x1ff) {
        bitoffset += 9;
        const field = constants.magical_properties[id];
        if (field === undefined) {
            throw new Error(`Invalid attribute id: ${id}`);
        }
        const size = field.cB;
        const attrKey = field.s;
        char.attributes[Attributes[attrKey]] = reader.ReadUInt32(size);
        //current_hp - max_stamina need to be bit shifted
        if (id >= 6 && id <= 11) {
            char.attributes[Attributes[attrKey]] >>>= 8;
        }
        bitoffset += size;
        id = reader.ReadUInt16(9);
    }
    reader.Align();
}
async function writeAttributes(char, constants) {
    const writer = new bitwriter_1.BitWriter();
    writer.WriteString("gf", 2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
    for (let i = 0; i < 16; i++) {
        const property = constants.magical_properties[i];
        if (property === undefined) {
            throw new Error(`Invalid attribute: ${property}`);
        }
        const attrKey = property.s;
        let value = char.attributes[Attributes[attrKey]];
        if (!value) {
            continue;
        }
        const size = property.cB;
        if (i >= 6 && i <= 11) {
            value <<= 8;
        }
        writer.WriteUInt16(i, 9);
        writer.WriteUInt32(value, size);
    }
    writer.WriteUInt16(0x1ff, 9);
    writer.Align();
    return writer.ToArray();
}
//nokkas names
const Attributes = {
    strength: "strength",
    energy: "energy",
    dexterity: "dexterity",
    vitality: "vitality",
    statpts: "unused_stats",
    newskills: "unused_skill_points",
    hitpoints: "current_hp",
    maxhp: "max_hp",
    mana: "current_mana",
    maxmana: "max_mana",
    stamina: "current_stamina",
    maxstamina: "max_stamina",
    level: "level",
    experience: "experience",
    gold: "gold",
    goldbank: "stashed_gold",
};
