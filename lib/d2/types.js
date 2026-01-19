"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemType = exports.Quality = exports.EItemQuality = exports.EStashType = void 0;
var EStashType;
(function (EStashType) {
    EStashType[EStashType["shared"] = 0] = "shared";
    EStashType[EStashType["private"] = 1] = "private";
})(EStashType = exports.EStashType || (exports.EStashType = {}));
var EItemQuality;
(function (EItemQuality) {
    EItemQuality[EItemQuality["normal"] = 0] = "normal";
    EItemQuality[EItemQuality["exceptional"] = 1] = "exceptional";
    EItemQuality[EItemQuality["elite"] = 2] = "elite";
})(EItemQuality = exports.EItemQuality || (exports.EItemQuality = {}));
var Quality;
(function (Quality) {
    Quality[Quality["Low"] = 1] = "Low";
    Quality[Quality["Normal"] = 2] = "Normal";
    Quality[Quality["Superior"] = 3] = "Superior";
    Quality[Quality["Magic"] = 4] = "Magic";
    Quality[Quality["Set"] = 5] = "Set";
    Quality[Quality["Rare"] = 6] = "Rare";
    Quality[Quality["Unique"] = 7] = "Unique";
    Quality[Quality["Crafted"] = 8] = "Crafted";
})(Quality = exports.Quality || (exports.Quality = {}));
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Armor"] = 1] = "Armor";
    ItemType[ItemType["Shield"] = 2] = "Shield";
    ItemType[ItemType["Weapon"] = 3] = "Weapon";
    ItemType[ItemType["Other"] = 4] = "Other";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
//# sourceMappingURL=types.js.map