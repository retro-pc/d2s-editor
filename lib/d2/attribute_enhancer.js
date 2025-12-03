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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceAttributes = enhanceAttributes;
exports.enhancePlayerAttributes = enhancePlayerAttributes;
exports.enhanceItems = enhanceItems;
exports.generateFixedMods = generateFixedMods;
const constants_1 = require("./constants");
const types = __importStar(require("./types"));
const ItemStatGroups_json_1 = __importDefault(require("./ItemStatGroups.json"));
const SkillTabs_json_1 = __importDefault(require("./SkillTabs.json"));
//do nice stuff
//combine group properties (all resists/all stats) and build friendly strings for a ui
//enhanced def/durability/weapon damage.
//lookup socketed compact items (runes/gems) properties for the slot they are in
//compute attributes like str/resists/etc..
async function enhanceAttributes(char, mod, version) {
    enhanceItems(char.items, mod, version);
    enhanceItems([char.golem_item], mod, version);
    enhanceItems(char.merc_items, mod, version);
    enhanceItems(char.corpse_items, mod, version);
    enhancePlayerAttributes(char, mod, version);
}
async function enhancePlayerAttributes(char, mod, version) {
    const items = char.items.filter((item) => {
        return item.location_id === 1 && item.equipped_id !== 13 && item.equipped_id !== 14;
    });
    const constants = (0, constants_1.getConstantData)(mod, version);
    char.item_bonuses = [].concat
        .apply([], items.map((item) => allAttributes(item)))
        .filter((attribute) => attribute != null);
    //char.item_bonuses = _groupAttributes(char.item_bonuses, constants);
    describeMods(char.item_bonuses, constants);
}
async function enhanceItems(items, mod, version) {
    if (!items) {
        return;
    }
    for (const item of items) {
        if (!item) {
            continue;
        }
        const constants = (0, constants_1.getConstantData)(mod, version);
        postProcessItem(item, constants);
    }
}
function postProcessItem(item, constants) {
    if (item.socketed_items && item.socketed_items.length) {
        for (const socketed of item.socketed_items) {
            const pt = constants.armor_items[item.type] || constants.weapon_items[item.type] || constants.other_items[socketed.type];
            const gem = constants.other_items[socketed.type];
            if (gem.m) {
                socketed.magic_attributes = generateFixedMods(gem.m[pt.gt], constants);
            }
            enhanceItem(socketed, constants);
            //item.socketed_attributes = item.socketed_attributes.concat(JSON.parse(JSON.stringify(socketed.magic_attributes)));
        }
    }
    enhanceItem(item, constants);
    if (item.magic_attributes || item.runeword_attributes || item.socketed_items || item.set_attributes) {
        item.displayed_magic_attributes = describeMods(item.magic_attributes, constants);
        item.displayed_runeword_attributes = describeMods(item.runeword_attributes, constants);
        //item.displayed_socketed_attributes = describeMods(socketedAttributes(item), constants);
        item.combined_magic_attributes = allAttributes(item);
        item.displayed_combined_magic_attributes = describeMods(item.combined_magic_attributes, constants);
        item.displayed_set_attributes = item.set_attributes?.map((set_attributes) => describeMods(set_attributes, constants));
    }
}
function enhanceItem(item, constants) {
    item.level = boundValue(item.level, 1, 99);
    // Ensure coherence of other attributes with quality
    if (item.given_runeword) {
        item.runeword_name = constants.runewords[item.runeword_id] ? constants.runewords[item.runeword_id].n : "";
        if (item.quality > types.Quality.Superior) {
            // Cannot be a runeword
            item.given_runeword = 0;
            item.runeword_id = 0;
            item.runeword_name = "";
            item.runeword_attributes = [];
        }
    }
    if (item.quality !== types.Quality.Magic) {
        item.magic_prefix = 0;
        item.magic_suffix = 0;
    }
    if (item.quality === types.Quality.Rare || item.quality === types.Quality.Crafted) {
        item.rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : "";
        item.rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : "";
    }
    else {
        item.rare_name_id = 0;
        item.rare_name = "";
        item.rare_name_id2 = 0;
        item.rare_name2 = "";
        //item.magical_name_ids = [0, 0, 0, 0, 0, 0];
    }
    if (item.quality === types.Quality.Set) {
        item.set_name = constants.set_items[item.set_id] ? constants.set_items[item.set_id].n : "";
    }
    else {
        item.set_id = 0;
        item.set_name = "";
        //item.set_attributes = [];
    }
    if (item.quality === types.Quality.Unique) {
        item.unique_name = constants.unq_items[item.unique_id] ? constants.unq_items[item.unique_id].n : "";
    }
    else {
        item.unique_id = 0;
        item.unique_name = "";
    }
    if (item.quality !== types.Quality.Magic && item.quality !== types.Quality.Unique) {
        item.personalized = 0;
        item.personalized_name = "";
    }
    let details = null;
    if (constants.armor_items[item.type]) {
        details = constants.armor_items[item.type];
        item.type_id = types.ItemType.Armor;
        if (details.maxac) {
            if (item.ethereal == 0) {
                item.defense_rating = details.maxac;
            }
            else if (item.ethereal == 1) {
                item.defense_rating = Math.floor(details.maxac * 1.5);
            }
        }
    }
    else if (constants.weapon_items[item.type]) {
        details = constants.weapon_items[item.type];
        item.type_id = types.ItemType.Weapon;
        const base_damage = {};
        if (item.ethereal == 0) {
            if (details.mind)
                base_damage.mindam = details.mind;
            if (details.maxd)
                base_damage.maxdam = details.maxd;
            if (details.min2d)
                base_damage.twohandmindam = details.min2d;
            if (details.max2d)
                base_damage.twohandmaxdam = details.max2d;
        }
        else if (item.ethereal == 1) {
            if (details.mind)
                base_damage.mindam = Math.floor(details.mind * 1.5);
            if (details.maxd)
                base_damage.maxdam = Math.floor(details.maxd * 1.5);
            if (details.min2d)
                base_damage.twohandmindam = Math.floor(details.min2d * 1.5);
            if (details.max2d)
                base_damage.twohandmaxdam = Math.floor(details.max2d * 1.5);
        }
        item.base_damage = base_damage;
    }
    else if (constants.other_items[item.type]) {
        item.type_id = types.ItemType.Other;
        details = constants.other_items[item.type];
    }
    if (details) {
        if (details.n)
            item.type_name = details.n;
        if (details.rs)
            item.reqstr = details.rs;
        if (details.rd)
            item.reqdex = details.rd;
        if (details.i)
            item.inv_file = details.i;
        if (details.hdi)
            item.hd_inv_file = details.hdi;
        if (details.ih)
            item.inv_height = details.ih;
        if (details.iw)
            item.inv_width = details.iw;
        if (details.it)
            item.inv_transform = details.it;
        if (details.iq)
            item.item_quality = details.iq;
        if (details.c)
            item.categories = details.c;
        if (details.durability) {
            if (item.ethereal == 0) {
                item.current_durability = details.durability;
                item.max_durability = details.durability;
            }
            else if (item.ethereal == 1) {
                item.current_durability = details.durability - Math.ceil(details.durability / 2) + 1;
                item.max_durability = details.durability - Math.ceil(details.durability / 2) + 1;
            }
        }
        // Enforce coherence between total_nr_of_sockets & socketed
        if (item.total_nr_of_sockets > 0) {
            item.socketed = 1;
        }
        else {
            item.socketed = 0;
        }
        // Multiple_pictures: ensure coherence with base item type
        if (details.ig && details.ig.length && !item.multiple_pictures) {
            // Activate multiple pictures
            item.multiple_pictures = true;
            item.picture_id = 0;
        }
        else if (!details.ig && item.multiple_pictures) {
            item.multiple_pictures = false; // Type changed to a not-multiple pictures one
            item.picture_id = 0;
        }
        // Set inv_file, hd_inv_file & transform_color
        if (item.multiple_pictures && details.ig && details.ig.length && details.ig[item.picture_id]) {
            item.inv_file = details.ig[item.picture_id];
        }
        if (item.multiple_pictures && details.hdig && details.hdig.length && details.hdig[item.picture_id]) {
            item.hd_inv_file = details.hdig[item.picture_id];
        }
        if (item.magic_prefix || item.magic_suffix) {
            if (item.magic_prefix && constants.magic_prefixes[item.magic_prefix]?.tc) {
                item.transform_color = constants.magic_prefixes[item.magic_prefix].tc;
            }
            if (item.magic_suffix && constants.magic_suffixes[item.magic_suffix]?.tc) {
                item.transform_color = constants.magic_suffixes[item.magic_suffix].tc;
            }
        }
        else if (item.magical_name_ids && item.magical_name_ids.length === 6) {
            for (let i = 0; i < 6; i++) {
                const id = item.magical_name_ids[i];
                if (id) {
                    if (i % 2 == 0 && constants.magic_prefixes[id] && constants.magic_prefixes[id]?.tc) {
                        // even is prefixes
                        item.transform_color = constants.magic_prefixes[id].tc;
                    }
                    else if (constants.magic_suffixes[id] && constants.magic_suffixes[id]?.tc) {
                        // odd is suffixes
                        item.transform_color = constants.magic_suffixes[id].tc;
                    }
                }
            }
        }
        else if (item.unique_id) {
            const unq = constants.unq_items[item.unique_id];
            if (details.ui)
                item.inv_file = details.ui;
            if (unq) {
                if (unq.i)
                    item.inv_file = unq.i;
                if (unq.hdi)
                    item.hd_inv_file = unq.hdi;
                //TODO fix for hellfire torch and annihilus
                if (item.type_id == types.ItemType.Other && (item.unique_name == "Hellfire Torch" || item.unique_name == "Annihilus")) {
                    details = Object.entries(constants.other_items).filter((e) => e[1].n != null && e[1].i == item.inv_file);
                }
                if (item.multiple_pictures && details.hdig && details.hdig.length && details.hdig[item.picture_id]) {
                    item.hd_inv_file = details.hdig[item.picture_id];
                }
                if (unq.tc)
                    item.transform_color = unq.tc;
            }
        }
        else if (item.set_id) {
            const set = constants.set_items[item.set_id];
            if (details.ui)
                item.inv_file = details.ui;
            if (set) {
                if (set.i)
                    item.inv_file = set.i;
                if (set.hdi)
                    item.hd_inv_file = set.hdi;
                if (set.tc)
                    item.transform_color = set.tc;
            }
        }
    }
}
function generateFixedMods(mods, constants) {
    const modifiers = [];
    if (!mods)
        return [];
    for (const mod of mods) {
        for (const stat of constants.properties[mod.prop] || []) {
            const statId = constants.magical_properties.findIndex((e) => e.s === stat.s);
            const prop = constants.magical_properties[statId];
            if (prop) {
                let values = [];
                let v;
                let param;
                switch (stat.type) {
                    case "proc":
                        values = [mod.max, mod.p, mod.min];
                        v = mod.max;
                        break;
                    case "charges":
                        values = [mod.max, mod.p, mod.min, mod.min];
                        v = mod.max;
                        break;
                    case "all":
                        values = [mod.max, mod.max];
                        v = mod.max;
                        param = mod.p;
                        break;
                    case "min":
                        values = [mod.min];
                        v = mod.min;
                        break;
                    case "max":
                        values = [mod.max];
                        v = mod.max;
                    case "param":
                        values = mod.p ? [mod.p, mod.max] : [mod.max];
                        v = Number(mod.p);
                        if (prop.s == "poisonlength") {
                            values = [mod.min, mod.max, mod.p];
                        }
                        break;
                    case "other":
                        param = mod.p ? (prop.s == "item_addskill_tab" ? SkillTabs_json_1.default[Number(mod.p)].id : mod.p) : stat.val;
                        if (param && prop.s == "item_addskill_tab") {
                            values = [param & 0x7, (param >> 3) & 0x1fff, mod.max];
                        }
                        else if (param) {
                            values = [param, mod.max];
                        }
                        else {
                            values = [mod.max];
                        }
                        v = mod.max;
                        if (mod.prop == "skill-rand") {
                            const rnd = Math.floor(Math.random() * (mod.max - mod.min) + mod.min);
                            values = [constants.skills[rnd]?.id, mod.p];
                        }
                        break;
                }
                modifiers.push({
                    id: statId,
                    name: prop.s,
                    values: values,
                    value: v,
                    param: param,
                    type: stat.type,
                });
            }
        }
    }
    return modifiers;
}
function describeMods(magic_attributes, constants) {
    if (!magic_attributes)
        return [];
    //const mods: types.IMagicProperty[] = cloneDeep(magic_attributes);
    const mods = [...magic_attributes.map((attr) => ({ ...attr }))];
    //mods.sort((a, b) => a.id - b.id); 
    for (const mod of mods) {
        //const prop = constants.magical_properties[mod.id];
        mod.value = mod.values[mod.values?.length - 1];
        //mod.param = prop.dF !== 19 ? mod.values[0] : undefined;
        //mod.df =  prop.dF;
        //mod.so = prop.so;
    }
    consolidateMods(mods);
    for (const mod of mods) {
        const prop = constants.magical_properties[mod.id];
        mod.description = describeSingleMod(mod, prop, constants);
    }
    addModGroups(mods, constants);
    mods.sort((a, b) => constants.magical_properties[b.id]?.so - constants.magical_properties[a.id]?.so || (b.param ?? 0) - (a.param ?? 0));
    return mods;
}
function consolidateMods(mods) {
    for (const mod of mods) {
        let duplicateIndex;
        while ((duplicateIndex = mods.findIndex((other) => mod !== other && mod.id === other.id && "value" in mod && mod.param === other.param)) >= 0) {
            const [duplicate] = mods.splice(duplicateIndex, 1);
            mod.value = (mod.value ?? 0) + (duplicate.value ?? 0);
        }
    }
}
function describeSingleMod(mod, prop, constants) {
    if (!prop)
        return;
    let val = mod.value;
    //let val = mod.values[mod.values?.length - 1];
    if (prop.s.endsWith("perlevel")) {
        // Per-level mod, we show it for character level 99 for the flair
        if (prop.s.includes("tohit")) {
            val = val / 2;
        }
        else {
            val = val / 8;
        }
        val = Math.floor(99 * val);
    }
    let modDesc = (val ?? 0) < 0 ? prop.dN : prop.dP;
    if (prop.id == 39 || prop.id == 41 || prop.id == 43 || prop.id == 45) {
        modDesc = prop.dP;
    }
    if (prop.np) {
        modDesc = prop.dR;
        if (mod.values[0] == mod.values[1]) {
            modDesc = prop.dE;
        }
    }
    let valueDesc;
    switch (prop.dF) {
        case 1: // +[value] [string1]
        case 6: // +[value] [string1] [string2]
        case 12: // +[value] [string1]
            valueDesc = (val ?? 0) < 0 ? `${val}` : `+${val}`;
            break;
        case 2: // [value]% [string1]
        case 7: // [value]% [string1] [string2]
            valueDesc = `${val}%`;
            break;
        case 3: // [value] [string1]
        case 9: // [value] [string1] [string2]
            valueDesc = `${val}`;
            break;
        case 4: // +[value]% [string1]
        case 8: // +[value]% [string1] [string2]
            valueDesc = (val ?? 0) < 0 ? `${val}%` : `+${val}%`;
            break;
        case 5: // [value*100/128]% [string1]
        case 10: // [value*100/128]% [string1] [string2]
            valueDesc = `${Math.floor((val * 100) / 128)}%`;
            break;
        case 11: // Repairs 1 Durability In [100 / value] Seconds
            modDesc = modDesc.replace("%d", `${100 / val}`);
            break;
        case 13: // +[value] to [class] Skill Levels
            modDesc = formatStr(constants.classes[mod.values[0]].as, val);
            break;
        case 14: // +[value] to [skilltab] Skill Levels ([class] Only)
            const skillTab = constants.classes[mod.values[1]]?.ts[mod.values[0]];
            if (skillTab) {
                modDesc = `+${val} to ${skillTab} ${constants.classes[mod.values[1]].co}`;
                modDesc = formatStr(skillTab, val) + " " + constants.classes[mod.values[1]].co;
            }
            break;
        case 15: // [chance]% to cast [slvl] [skill] on [event]
            modDesc = modDesc
                // Extra % because the actual one is doubled to escape it
                .replace("%d%", `${mod.values[2]}`)
                .replace("%d", `${mod.values[0]}`)
                .replace("%s", `${constants.skills[mod.values[1]]?.n}`);
            break;
        case 16: // Level [sLvl] [skill] Aura When Equipped
            modDesc = modDesc.replace("%d", `${val}`).replace("%s", `${constants.skills[mod.values[0]]?.n}`);
            break;
        //todo
        // 17 [value] [string1] (Increases near [time])
        // modDesc = `${val} ${modDesc} (Increases near [time])`
        // 18 [value]% [string1] (Increases near [time])
        // modDesc = `${val}% ${modDesc} (Increases near [time])`
        case 19: //main [value * -1]% [string1]
            // if (mod.values[0] !== mod.values[1]) {
            //   modDesc = formatStr(modDesc, mod.values[0], mod.values[1]);
            // } else {
            modDesc = formatStr(modDesc, val);
            break;
        case 29:
            modDesc = formatStr(modDesc, -val);
            break;
        case 20: // [value * -1]% [string1]
            valueDesc = `${-val}%`;
            break;
        case 21: // [value * -1] [string1]
            valueDesc = `${-val}`;
            break;
        case 22: // [value]% [string1] [montype]
            valueDesc = `${val}%`;
            break;
        case 23: // [value]% [string1] [monster]
            valueDesc = `${val}%`;
            modDesc = formatStr(modDesc, val);
            break;
        case 24: // Level [lvl] [skill] ([curr]/[max] charges)
            modDesc = formatStr(modDesc, mod.values[0], constants.skills[mod.values[1]].n, mod.values[2], mod.values[3]);
            break;
        case 27: // +[value] to [skill] ([class] Only)
            const skill = constants.skills[mod.values[0]];
            modDesc = formatStr(modDesc, val, skill?.n, constants.classes.filter((e) => e?.c === skill?.c)[0]?.co);
            break;
        case 28: // +[value] to [skill]
            modDesc = formatStr(modDesc, val, constants.skills[mod.values[0]]?.n);
            break;
        // Custom describe functions to handle groups
        case 100:
            // Non-poison elemental or magic damage.
            if (mod.values?.[0] !== mod.values?.[1]) {
                modDesc = prop.dN;
            }
            modDesc = modDesc.replace("%d", `${mod.values?.[0]}`).replace("%d", `${mod.values?.[1]}`);
            break;
        case 101: // Poison damage
            if (mod.values?.[0] === mod.values?.[1]) {
                modDesc = modDesc
                    .replace("%d", `${Math.round((mod.values[0] * mod.values[2]) / 256)}`)
                    .replace("%d", `${Math.round(mod.values[2] / 25)}`);
            }
            else {
                modDesc = prop.dN
                    .replace("%d", `${Math.round((mod.values[0] * mod.values[2]) / 256)}`)
                    .replace("%d", `${Math.round((mod.values[1] * mod.values[2]) / 256)}`)
                    .replace("%d", `${Math.round(mod.values[2] / 25)}`);
            }
            break;
    }
    if (modDesc) {
        let fullDesc = "";
        switch (prop.dV) {
            case 1:
                fullDesc = `${valueDesc} ${modDesc}`;
                break;
            case 2:
                fullDesc = `${modDesc} ${valueDesc}`;
                break;
            default:
                fullDesc = modDesc;
        }
        if (6 <= prop.dF && prop.dF <= 9) {
            fullDesc += ` ${prop.d2}`;
        }
        return fullDesc;
    }
}
function addModGroups(modifiers, constants) {
    for (const group of ItemStatGroups_json_1.default) {
        const mods = modifiers?.filter(({ id }) => group.statsInGroup.includes(id)) ?? [];
        // We assume a mods have been merged so we cannot have duplicates
        if (mods.length !== group.statsInGroup.length) {
            continue;
        }
        if (group.allEqual && mods.some(({ value }) => value !== mods[0].value)) {
            continue;
        }
        // On some rare items we can get increase in min damage that's larger than the increase in max damage.
        // The game solves this by displaying them separately.
        if (group.isRange && (mods[0].value ?? 0) > (mods[1].value ?? 0)) {
            continue;
        }
        // Damage increase on non-weapons is awkward, it has all 4 mods that apply in the multiple groups.
        if (group.s === "group:secondary-dmg" || group.s === "group:min-dmg" || group.s === "group:max-dmg") {
            // We already described the range, ignore these "duplicate" groups
            if (modifiers?.find((mod) => mod.name === "group:primary-dmg")) {
                // We still have to remember to delete the description from the mods,
                // primary-dmg only contains 2, not all 4.
                for (const mod of mods) {
                    delete mod.description;
                }
                continue;
            }
        }
        const extraMod = {
            id: -1,
            name: group.s,
            so: group.so,
            df: group.dF,
            value: mods[0].value,
            //value: group.allEqual ? mods[0].value : undefined,
            values: mods.map(({ value }) => value ?? 0),
        };
        extraMod.description = describeSingleMod(extraMod, group, constants);
        modifiers?.push(extraMod);
        // Clear descriptions of items in group so they are not displayed
        for (const mod of mods) {
            delete mod.description;
        }
    }
}
function formatStr(str, ...values) {
    let i = 0;
    return str?.replace(/%(\+)?([ids%\d])/g, (m, plus, chr) => {
        if (chr === "%") {
            return chr;
        }
        else {
            let value = chr === "d" || chr === "s" || chr === "i" ? values[i++] : values[chr];
            //console.log("DEBUG:", { i, value });
            if (plus && !isNaN(value) && parseInt(value) > 0)
                value = "+" + value;
            return value;
        }
    });
}
function boundValue(v, min, max) {
    return Math.min(max, Math.max(min, v));
}
function _itemStatCostFromStat(stat, constants) {
    return constants.magical_properties.findIndex((e) => e.s === stat);
}
function _classFromCode(code, constants) {
    return constants.classes.filter((e) => e.c === code)[0];
}
function socketedAttributes(item) {
    let socketed_attributes = [];
    if (item.socketed_items) {
        for (const i of item.socketed_items) {
            if (i.magic_attributes) {
                socketed_attributes = socketed_attributes.concat(...JSON.parse(JSON.stringify(i.magic_attributes)));
            }
        }
    }
    return socketed_attributes;
}
function allAttributes(item) {
    const magic_attributes = item.magic_attributes || [];
    const runeword_attributes = item.runeword_attributes || [];
    const socketed_attributes = socketedAttributes(item);
    return [
        ...[],
        ...JSON.parse(JSON.stringify(magic_attributes)),
        ...JSON.parse(JSON.stringify(runeword_attributes)),
        ...JSON.parse(JSON.stringify(socketed_attributes)),
    ].filter((attribute) => attribute != null);
}
