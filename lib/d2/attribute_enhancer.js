"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFixedMods = exports.enhanceItems = exports.enhancePlayerAttributes = exports.enhanceAttributes = void 0;
var constants_1 = require("./constants");
var types = __importStar(require("./types"));
var ItemStatGroups_json_1 = __importDefault(require("./ItemStatGroups.json"));
var SkillTabs_json_1 = __importDefault(require("./SkillTabs.json"));
//do nice stuff
//combine group properties (all resists/all stats) and build friendly strings for a ui
//enhanced def/durability/weapon damage.
//lookup socketed compact items (runes/gems) properties for the slot they are in
//compute attributes like str/resists/etc..
function enhanceAttributes(char, mod, version) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            enhanceItems(char.items, mod, version);
            enhanceItems([char.golem_item], mod, version);
            enhanceItems(char.merc_items, mod, version);
            enhanceItems(char.corpse_items, mod, version);
            enhancePlayerAttributes(char, mod, version);
            return [2 /*return*/];
        });
    });
}
exports.enhanceAttributes = enhanceAttributes;
function enhancePlayerAttributes(char, mod, version) {
    return __awaiter(this, void 0, void 0, function () {
        var items, constants;
        return __generator(this, function (_a) {
            items = char.items.filter(function (item) {
                return item.location_id === 1 && item.equipped_id !== 13 && item.equipped_id !== 14;
            });
            constants = constants_1.getConstantData(mod, version);
            char.item_bonuses = [].concat
                .apply([], items.map(function (item) { return allAttributes(item); }))
                .filter(function (attribute) { return attribute != null; });
            //char.item_bonuses = _groupAttributes(char.item_bonuses, constants);
            describeMods(char.item_bonuses, constants);
            return [2 /*return*/];
        });
    });
}
exports.enhancePlayerAttributes = enhancePlayerAttributes;
function enhanceItems(items, mod, version) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, items_1, item, constants;
        return __generator(this, function (_a) {
            if (!items) {
                return [2 /*return*/];
            }
            for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                item = items_1[_i];
                if (!item) {
                    continue;
                }
                constants = constants_1.getConstantData(mod, version);
                postProcessItem(item, constants);
            }
            return [2 /*return*/];
        });
    });
}
exports.enhanceItems = enhanceItems;
function postProcessItem(item, constants) {
    var _a;
    if (item.socketed_items && item.socketed_items.length) {
        for (var _i = 0, _b = item.socketed_items; _i < _b.length; _i++) {
            var socketed = _b[_i];
            var pt = constants.armor_items[item.type] || constants.weapon_items[item.type] || constants.other_items[socketed.type];
            var gem = constants.other_items[socketed.type];
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
        //item.displayed_set_attributes = item.set_attributes?.map((set_attributes) => describeMods(set_attributes, constants))
        var set_attributes = (_a = item.set_attributes) === null || _a === void 0 ? void 0 : _a.map(function (attr) { return attr[0]; });
        item.displayed_set_attributes = describeMods(set_attributes, constants).map(function (value) { return [value]; });
    }
}
function enhanceItem(item, constants) {
    var _a, _b, _c, _d;
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
        item.magical_name_ids = [0, 0, 0, 0, 0, 0];
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
    var details = null;
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
        var base_damage = {};
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
        if (item.multiple_pictures) {
            item.inv_file = details.ig[item.picture_id];
        }
        if (item.magic_prefix || item.magic_suffix) {
            if (item.magic_prefix && ((_a = constants.magic_prefixes[item.magic_prefix]) === null || _a === void 0 ? void 0 : _a.tc)) {
                item.transform_color = constants.magic_prefixes[item.magic_prefix].tc;
            }
            if (item.magic_suffix && ((_b = constants.magic_suffixes[item.magic_suffix]) === null || _b === void 0 ? void 0 : _b.tc)) {
                item.transform_color = constants.magic_suffixes[item.magic_suffix].tc;
            }
        }
        else if (item.magical_name_ids && item.magical_name_ids.length === 6) {
            for (var i = 0; i < 6; i++) {
                var id = item.magical_name_ids[i];
                if (id) {
                    if (i % 2 == 0 && constants.magic_prefixes[id] && ((_c = constants.magic_prefixes[id]) === null || _c === void 0 ? void 0 : _c.tc)) {
                        // even is prefixes
                        item.transform_color = constants.magic_prefixes[id].tc;
                    }
                    else if (constants.magic_suffixes[id] && ((_d = constants.magic_suffixes[id]) === null || _d === void 0 ? void 0 : _d.tc)) {
                        // odd is suffixes
                        item.transform_color = constants.magic_suffixes[id].tc;
                    }
                }
            }
        }
        else if (item.unique_id) {
            var unq = constants.unq_items[item.unique_id];
            if (details.ui)
                item.inv_file = details.ui;
            if (unq && unq.i)
                item.inv_file = unq.i;
            if (unq && unq.tc)
                item.transform_color = unq.tc;
        }
        else if (item.set_id) {
            var set = constants.set_items[item.set_id];
            if (details.ui)
                item.inv_file = details.ui;
            if (set && set.i)
                item.inv_file = set.i;
            if (set && set.tc)
                item.transform_color = set.tc;
        }
    }
}
function generateFixedMods(mods, constants) {
    var _a;
    var modifiers = [];
    if (!mods)
        return [];
    for (var _i = 0, mods_1 = mods; _i < mods_1.length; _i++) {
        var mod = mods_1[_i];
        var _loop_1 = function (stat) {
            var statId = constants.magical_properties.findIndex(function (e) { return e.s === stat.s; });
            var prop = constants.magical_properties[statId];
            if (prop) {
                var values = [];
                var v = void 0;
                var param = void 0;
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
                        values = [mod.min, mod.max];
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
                            var rnd = Math.floor(Math.random() * (mod.max - mod.min) + mod.min);
                            values = [(_a = constants.skills[rnd]) === null || _a === void 0 ? void 0 : _a.id, mod.p];
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
        };
        for (var _b = 0, _c = constants.properties[mod.prop] || []; _b < _c.length; _b++) {
            var stat = _c[_b];
            _loop_1(stat);
        }
    }
    return modifiers;
}
exports.generateFixedMods = generateFixedMods;
function describeMods(magic_attributes, constants) {
    var _a;
    if (!magic_attributes)
        return [];
    //const mods: types.IMagicProperty[] = cloneDeep(magic_attributes);
    var mods = __spreadArrays(magic_attributes.map(function (attr) { return (__assign({}, attr)); }));
    //mods.sort((a, b) => a.id - b.id); 
    for (var _i = 0, mods_2 = mods; _i < mods_2.length; _i++) {
        var mod = mods_2[_i];
        var prop = constants.magical_properties[mod.id];
        mod.value = mod.values[((_a = mod.values) === null || _a === void 0 ? void 0 : _a.length) - 1];
        //mod.param = prop.dF !== 19 ? mod.values[0] : undefined;
        //mod.df =  prop.dF;
        //mod.so = prop.so;
    }
    consolidateMods(mods);
    for (var _b = 0, mods_3 = mods; _b < mods_3.length; _b++) {
        var mod = mods_3[_b];
        var prop = constants.magical_properties[mod.id];
        mod.description = describeSingleMod(mod, prop, constants);
    }
    addModGroups(mods, constants);
    mods.sort(function (a, b) { var _a, _b, _c, _d; return ((_a = constants.magical_properties[b.id]) === null || _a === void 0 ? void 0 : _a.so) - ((_b = constants.magical_properties[a.id]) === null || _b === void 0 ? void 0 : _b.so) || ((_c = b.param) !== null && _c !== void 0 ? _c : 0) - ((_d = a.param) !== null && _d !== void 0 ? _d : 0); });
    return mods;
}
function consolidateMods(mods) {
    var _a, _b;
    var _loop_2 = function (mod) {
        var duplicateIndex = void 0;
        while ((duplicateIndex = mods.findIndex(function (other) { return mod !== other && mod.id === other.id && "value" in mod && mod.param === other.param; })) >= 0) {
            var duplicate = mods.splice(duplicateIndex, 1)[0];
            mod.value = ((_a = mod.value) !== null && _a !== void 0 ? _a : 0) + ((_b = duplicate.value) !== null && _b !== void 0 ? _b : 0);
        }
    };
    for (var _i = 0, mods_4 = mods; _i < mods_4.length; _i++) {
        var mod = mods_4[_i];
        _loop_2(mod);
    }
}
function describeSingleMod(mod, prop, constants) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (!prop)
        return;
    var val = mod.value;
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
    var modDesc = (val !== null && val !== void 0 ? val : 0) < 0 ? prop.dN : prop.dP;
    if (prop.id == 39 || prop.id == 41 || prop.id == 43 || prop.id == 45) {
        modDesc = prop.dP;
    }
    if (prop.np) {
        modDesc = prop.dR;
        if (mod.values[0] == mod.values[1]) {
            modDesc = prop.dE;
        }
    }
    var valueDesc;
    switch (prop.dF) {
        case 1: // +[value] [string1]
        case 6: // +[value] [string1] [string2]
        case 12: // +[value] [string1]
            valueDesc = (val !== null && val !== void 0 ? val : 0) < 0 ? "" + val : "+" + val;
            break;
        case 2: // [value]% [string1]
        case 7: // [value]% [string1] [string2]
            valueDesc = val + "%";
            break;
        case 3: // [value] [string1]
        case 9: // [value] [string1] [string2]
            valueDesc = "" + val;
            break;
        case 4: // +[value]% [string1]
        case 8: // +[value]% [string1] [string2]
            valueDesc = (val !== null && val !== void 0 ? val : 0) < 0 ? val + "%" : "+" + val + "%";
            break;
        case 5: // [value*100/128]% [string1]
        case 10: // [value*100/128]% [string1] [string2]
            valueDesc = Math.floor((val * 100) / 128) + "%";
            break;
        case 11: // Repairs 1 Durability In [100 / value] Seconds
            modDesc = modDesc.replace("%d", "" + 100 / val);
            break;
        case 13: // +[value] to [class] Skill Levels
            modDesc = formatStr(constants.classes[mod.values[0]].as, val);
            break;
        case 14: // +[value] to [skilltab] Skill Levels ([class] Only)
            var skillTab = (_a = constants.classes[mod.values[1]]) === null || _a === void 0 ? void 0 : _a.ts[mod.values[0]];
            if (skillTab) {
                modDesc = "+" + val + " to " + skillTab + " " + constants.classes[mod.values[1]].co;
                modDesc = formatStr(skillTab, val) + " " + constants.classes[mod.values[1]].co;
            }
            break;
        case 15: // [chance]% to cast [slvl] [skill] on [event]
            modDesc = modDesc
                // Extra % because the actual one is doubled to escape it
                .replace("%d%", "" + mod.values[2])
                .replace("%d", "" + mod.values[0])
                .replace("%s", "" + ((_b = constants.skills[mod.values[1]]) === null || _b === void 0 ? void 0 : _b.n));
            break;
        case 16: // Level [sLvl] [skill] Aura When Equipped
            modDesc = modDesc.replace("%d", "" + val).replace("%s", "" + ((_c = constants.skills[mod.values[0]]) === null || _c === void 0 ? void 0 : _c.n));
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
            valueDesc = -val + "%";
            break;
        case 21: // [value * -1] [string1]
            valueDesc = "" + -val;
            break;
        case 22: // [value]% [string1] [montype]
            valueDesc = val + "%";
            break;
        case 23: // [value]% [string1] [monster]
            valueDesc = val + "%";
            modDesc = formatStr(modDesc, val);
            break;
        case 24: // Level [lvl] [skill] ([curr]/[max] charges)
            modDesc = formatStr(modDesc, mod.values[0], constants.skills[mod.values[1]].n, mod.values[2], mod.values[3]);
            break;
        case 27: // +[value] to [skill] ([class] Only)
            var skill_1 = constants.skills[mod.values[0]];
            modDesc = formatStr(modDesc, val, skill_1 === null || skill_1 === void 0 ? void 0 : skill_1.n, (_d = constants.classes.filter(function (e) { return (e === null || e === void 0 ? void 0 : e.c) === (skill_1 === null || skill_1 === void 0 ? void 0 : skill_1.c); })[0]) === null || _d === void 0 ? void 0 : _d.co);
            break;
        case 28: // +[value] to [skill]
            modDesc = formatStr(modDesc, val, (_e = constants.skills[mod.values[0]]) === null || _e === void 0 ? void 0 : _e.n);
            break;
        // Custom describe functions to handle groups
        case 100:
            // Non-poison elemental or magic damage.
            if (((_f = mod.values) === null || _f === void 0 ? void 0 : _f[0]) !== ((_g = mod.values) === null || _g === void 0 ? void 0 : _g[1])) {
                modDesc = prop.dN;
            }
            modDesc = modDesc.replace("%d", "" + ((_h = mod.values) === null || _h === void 0 ? void 0 : _h[0])).replace("%d", "" + ((_j = mod.values) === null || _j === void 0 ? void 0 : _j[1]));
            break;
        case 101: // Poison damage
            if (((_k = mod.values) === null || _k === void 0 ? void 0 : _k[0]) === ((_l = mod.values) === null || _l === void 0 ? void 0 : _l[1])) {
                modDesc = modDesc
                    .replace("%d", "" + Math.round((mod.values[0] * mod.values[2]) / 256))
                    .replace("%d", "" + Math.round(mod.values[2] / 25));
            }
            else {
                modDesc = prop.dN
                    .replace("%d", "" + Math.round((mod.values[0] * mod.values[2]) / 256))
                    .replace("%d", "" + Math.round((mod.values[1] * mod.values[2]) / 256))
                    .replace("%d", "" + Math.round(mod.values[2] / 25));
            }
            break;
    }
    if (modDesc) {
        var fullDesc = "";
        switch (prop.dV) {
            case 1:
                fullDesc = valueDesc + " " + modDesc;
                break;
            case 2:
                fullDesc = modDesc + " " + valueDesc;
                break;
            default:
                fullDesc = modDesc;
        }
        if (6 <= prop.dF && prop.dF <= 9) {
            fullDesc += " " + prop.d2;
        }
        return fullDesc;
    }
}
function addModGroups(modifiers, constants) {
    var _a, _b, _c;
    var _loop_3 = function (group) {
        var mods = (_a = modifiers === null || modifiers === void 0 ? void 0 : modifiers.filter(function (_a) {
            var id = _a.id;
            return group.statsInGroup.includes(id);
        })) !== null && _a !== void 0 ? _a : [];
        // We assume a mods have been merged so we cannot have duplicates
        if (mods.length !== group.statsInGroup.length) {
            return "continue";
        }
        if (group.allEqual && mods.some(function (_a) {
            var value = _a.value;
            return value !== mods[0].value;
        })) {
            return "continue";
        }
        // On some rare items we can get increase in min damage that's larger than the increase in max damage.
        // The game solves this by displaying them separately.
        if (group.isRange && ((_b = mods[0].value) !== null && _b !== void 0 ? _b : 0) > ((_c = mods[1].value) !== null && _c !== void 0 ? _c : 0)) {
            return "continue";
        }
        // Damage increase on non-weapons is awkward, it has all 4 mods that apply in the multiple groups.
        if (group.s === "group:secondary-dmg" || group.s === "group:min-dmg" || group.s === "group:max-dmg") {
            // We already described the range, ignore these "duplicate" groups
            if (modifiers === null || modifiers === void 0 ? void 0 : modifiers.find(function (mod) { return mod.name === "group:primary-dmg"; })) {
                // We still have to remember to delete the description from the mods,
                // primary-dmg only contains 2, not all 4.
                for (var _i = 0, mods_5 = mods; _i < mods_5.length; _i++) {
                    var mod = mods_5[_i];
                    delete mod.description;
                }
                return "continue";
            }
        }
        var extraMod = {
            id: -1,
            name: group.s,
            so: group.so,
            df: group.dF,
            value: mods[0].value,
            //value: group.allEqual ? mods[0].value : undefined,
            values: mods.map(function (_a) {
                var value = _a.value;
                return value !== null && value !== void 0 ? value : 0;
            }),
        };
        extraMod.description = describeSingleMod(extraMod, group, constants);
        modifiers === null || modifiers === void 0 ? void 0 : modifiers.push(extraMod);
        // Clear descriptions of items in group so they are not displayed
        for (var _a = 0, mods_6 = mods; _a < mods_6.length; _a++) {
            var mod = mods_6[_a];
            delete mod.description;
        }
    };
    for (var _i = 0, statGroups_1 = ItemStatGroups_json_1.default; _i < statGroups_1.length; _i++) {
        var group = statGroups_1[_i];
        _loop_3(group);
    }
}
function formatStr(str) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var i = 0;
    return str === null || str === void 0 ? void 0 : str.replace(/%(\+)?([ids%\d])/g, function (m, plus, chr) {
        if (chr === "%") {
            return chr;
        }
        else {
            var value = chr === "d" || chr === "s" || chr === "i" ? values[i++] : values[chr];
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
    return constants.magical_properties.findIndex(function (e) { return e.s === stat; });
}
function _classFromCode(code, constants) {
    return constants.classes.filter(function (e) { return e.c === code; })[0];
}
function socketedAttributes(item) {
    var socketed_attributes = [];
    if (item.socketed_items) {
        for (var _i = 0, _a = item.socketed_items; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.magic_attributes) {
                socketed_attributes = socketed_attributes.concat.apply(socketed_attributes, JSON.parse(JSON.stringify(i.magic_attributes)));
            }
        }
    }
    return socketed_attributes;
}
function allAttributes(item) {
    var magic_attributes = item.magic_attributes || [];
    var runeword_attributes = item.runeword_attributes || [];
    var socketed_attributes = socketedAttributes(item);
    return __spreadArrays([], JSON.parse(JSON.stringify(magic_attributes)), JSON.parse(JSON.stringify(runeword_attributes)), JSON.parse(JSON.stringify(socketed_attributes))).filter(function (attribute) { return attribute != null; });
}
//# sourceMappingURL=attribute_enhancer.js.map