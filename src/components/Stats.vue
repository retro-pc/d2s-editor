<template>
  <div>
    <div class="form-group mt-2">
      <label for="name">Name</label>
      <a-input id="name" placeholder="Character Name" v-model:value="save.header.name" required />
    </div>
    <div>
      <div class="form-check form-check-inline">
        <a-checkbox v-model:checked="save.header.status.expansion">Expansion</a-checkbox>
      </div>
      <div class="form-check form-check-inline">
        <a-checkbox v-model:checked="save.header.status.ladder">Ladder</a-checkbox>
      </div>
      <div class="form-check form-check-inline">
        <a-checkbox v-model:checked="save.header.status.hardcore">Hardcore</a-checkbox>
      </div>
      <div class="form-check form-check-inline">
        <a-checkbox v-model:checked="save.header.status.died">Dead</a-checkbox>
      </div>
    </div>

    <div class="d-flex flex-row justify-content-between mx-5">
      <div>
    <div class="d-flex flex-wrap mt-5">
      <div class="mb-3">
        <label for="Level">Level</label>
        <div class="input-group">
              <a-input-number id="Level" v-model:value="save.attributes.level" :min="min(12)" :max="max(12)"
                @update:value="() => change(12, save.attributes, 'level')" style="width: 60px;" />
        </div>
      </div>
          <div class="mb-3">
        <label for="Experience">Experience</label>
        <div class="input-group">
          <a-input-number id="Experience" v-model:value="save.attributes.experience" style="width: 120px;" />
        </div>
      </div>
      <div class="mb-3">
        <label for="Gold">Gold</label>
        <div class="input-group">
              <a-input-number id="Gold" v-model:value="save.attributes.gold" :min="min(14)" :max="max(14)"
                @update:value="() => change(14, save.attributes, 'gold')" style="width: 100px;" />
        </div>
      </div>
      <div class="mb-3">
        <label for="StashedGold">Stashed Gold</label>
        <div class="input-group">
              <a-input-number id="StashedGold" v-model:value="save.attributes.stashed_gold" :min="min(15)"
                :max="max(15)" @update:value="() => change(15, save.attributes, 'stashed_gold')"
                style="width: 100px;" />
        </div>
      </div>
    </div>
        <div class="d-flex flex-wrap flex-column">
      <div class="mr-4 mb-3">
        <label for="Life">Life</label>
        <div class="input-group">
              <a-input-number id="Life" v-model:value="save.attributes.current_hp" :min="min(6)" :max="max(6)"
                @update:value="() => change(6, save.attributes, 'current_hp')" />
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
              <a-input-number id="MaxLife" v-model:value="save.attributes.max_hp" :min="min(7)" :max="max(7)"
                @update:value="() => change(7, save.attributes, 'max_hp')" />
        </div>
      </div>
      <div class="mr-4 mb-3">
        <label for="Mana">Mana</label>
        <div class="input-group">
              <a-input-number id="Mana" v-model:value="save.attributes.current_mana" :min="min(8)" :max="max(8)"
                @update:value="() => change(8, save.attributes, 'current_mana')" />
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
              <a-input-number id="MaxMana" v-model:value="save.attributes.max_mana" :min="min(9)" :max="max(9)"
                @update:value="() => change(9, save.attributes, 'max_mana')" />
        </div>
      </div>
      <div class="mr-4 mb-3">
        <label for="Stamina">Stamina</label>
        <div class="input-group">
              <a-input-number id="Stamina" v-model:value="save.attributes.current_stamina" :min="min(6)" :max="max(6)"
                @update:value="() => change(6, save.attributes, 'current_stamina')" />
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
              <a-input-number id="MaxStamina" v-model:value="save.attributes.max_stamina" :min="min(7)" :max="max(7)"
                @update:value="() => change(7, save.attributes, 'max_stamina')" />
        </div>
      </div>
    </div>
    <div class="d-flex flex-wrap">
      <div class="mb-3">
        <label for="Strength">Strength</label>
        <div class="input-group" style="width: 80px;">
              <a-input-number id="Strength" v-model:value="save.attributes.strength" :min="min(0)" :max="max(0)"
                @update:value="() => change(0, save.attributes, 'strength')" />
        </div>
      </div>
      <div class="mb-3">
        <label for="Dexterity">Dexterity</label>
        <div class="input-group" style="width: 80px;">
              <a-input-number id="Dexterity" v-model:value="save.attributes.dexterity" :min="min(2)" :max="max(2)"
                @update:value="() => change(2, save.attributes, 'dexterity')" />
        </div>
      </div>
      <div class="mb-3">
        <label for="Vitality">Vitality</label>
        <div class="input-group" style="width: 80px;">
              <a-input-number id="Vitality" v-model:value="save.attributes.vitality" :min="min(3)" :max="max(3)"
                @update:value="() => change(3, save.attributes, 'vitality')" />
        </div>
      </div>
      <div class="mb-3">
        <label for="Energy">Energy</label>
        <div class="input-group" style="width: 80px;">
              <a-input-number id="Energy" v-model:value="save.attributes.energy" :min="min(1)" :max="max(1)"
                @update:value="() => change(1, save.attributes, 'energy')" />
            </div>
          </div>
        </div>
      </div>

      <div class="display-stats">
        <div class="res-header mt-4">
          <Flex align="center" gap="20" justify="space-between">
            <h5 style="margin: 0;">Resistances:</h5>
            <a-select id="difficultySel" v-model:value="selectedDifficulty" style="width: 120px;">
              <a-select-option value="Normal">Normal</a-select-option>
              <a-select-option value="Nightmare">Nightmare</a-select-option>
              <a-select-option value="Hell">Hell</a-select-option>
            </a-select>
          </Flex>
        </div>
        <div class="stats-grid">
          <template v-for="r in resistDisplay" :key="r.key">
            <div class="stat-label">{{ r.label }}</div>
            <div class="stat-value" :class="r.cls">
              <a-tooltip :title="r.tooltip">
                <strong>{{ r.value }}</strong>
              </a-tooltip>
            </div>
          </template>
        </div>

        <div class="mt-4">
          <h5>Skills stats:</h5>
          <div class="stats-grid">
            <template v-for="s in skillsDisplay" :key="s.key">
              <div class="stat-label">{{ s.label }}</div>
              <div class="stat-value"><strong>{{ s.value }}</strong></div>
            </template>
          </div>
        </div>

        <div class="mt-4">
          <h5>Combined stats:</h5>
          <div class="stats-grid">
            <template v-for="stat in aggregatedDisplay" :key="stat.key">
              <div class="stat-label">{{ stat?.label || '' }}</div>
              <div class="stat-value"><strong>{{ stat?.value && stat?.prefix ? stat?.prefix : '' }}{{ stat?.value || "-"
              }}{{ stat?.value && stat?.suffix ? stat?.suffix : '' }}</strong></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Flex } from 'ant-design-vue';
  import utils from '../utils.js';

const xp = [0, 500, 1500, 3750, 7875, 14175, 22680, 32886, 44396, 57715, 72144, 90180, 112725, 140906, 176132, 220165, 275207, 344008, 430010, 537513, 671891, 839864, 1049830, 1312287, 1640359, 2050449, 2563061, 3203826, 3902260, 4663553, 5493363, 6397855, 7383752, 8458379, 9629723, 10906488, 12298162, 13815086, 15468534, 17270791, 19235252, 21376515, 23710491, 26254525, 29027522, 32050088, 35344686, 38935798, 42850109, 47116709, 51767302, 56836449, 62361819, 68384473, 74949165, 82104680, 89904191, 98405658, 107672256, 117772849, 128782495, 140783010, 153863570, 168121381, 183662396, 200602101, 219066380, 239192444, 261129853, 285041630, 311105466, 339515048, 370481492, 404234916, 441026148, 481128591, 524840254, 572485967, 624419793, 681027665, 742730244, 809986056, 883294891, 963201521, 1050299747, 1145236814, 1248718217, 1361512946, 1484459201, 1618470619, 1764543065, 1923762030, 2097310703, 2286478756, 2492671933, 2717422497, 2962400612, 3229426756, 3520485254, 3837739017];

  export default {
  components: {
    Flex
  },
    props: {
      save: Object,
    altDisplayed: Boolean,
    },
    data() {
      return {
        stats: this.$getWorkConstantData().magical_properties,
      selectedDifficulty: 'Hell',
    }
  },
  computed: {
    equippedAndInventory() {
      const items = (this.save && Array.isArray(this.save.items)) ? this.save.items : [];
      const isAltDisplayed = this.altDisplayed ?? (localStorage.getItem('equippedAltDisplayed') === '1');
      return items.filter(item => {
        if (!item) return false;
        // Inventory page 1 - always included
        if (item.location_id === 0 && item.alt_position_id === 1) return true;
        // Equipped filtering: include non-weapon slots always, and include only active weapon set
        if (item.location_id === 1) {
          const id = item.equipped_id;
          // Non-weapon slots (keep)
          if (id && id !== 4 && id !== 5 && id !== 11 && id !== 12) return true;
          // Weapon sets
          if (!isAltDisplayed) {
            // Primary set: right(4) + left(5)
            return id === 4 || id === 5;
          } else {
            // Alt set: alt right(11) + alt left(12)
            return id === 11 || id === 12;
          }
        }
        return false;
      });
    },
    skillsDisplay() {
      // Aggregate skill-related bonuses
        const constants = this.$getWorkConstantData();
      const className = this.save?.header?.class || '';
      const classEntry = Object.values(constants.classes || {}).find((c) => c.n === className);
      const classId = classEntry?.id ?? null;
      const sums = {
        all: 0,
        classes: {}, // by classId
        tabs: {}, // by packed key (classId<<3 | tab)
        skills: {}, // by skillId
      };
      const add = (obj, key, inc) => { obj[key] = (obj[key] || 0) + (inc || 0); };
      const getValue = (attr) => {
        if (!attr) return 0;
        if (typeof attr.value === 'number') return attr.value;
        if (Array.isArray(attr.values) && attr.values.length) return attr.values[attr.values.length - 1] || 0;
        return 0;
      };
      for (const item of this.equippedAndInventory) {
        const attrs = (item && Array.isArray(item.combined_magic_attributes)) ? item.combined_magic_attributes : [];
        for (const a of attrs) {
          if (!a || typeof a.name !== 'string') continue;
          // All skills
          if (a.name === 'item_allskills') {
            sums.all += getValue(a);
          }
          // + to class skills (dF=13) values[0] = classId
          else if (a.name === 'item_addclassskills') {
            const cid = Array.isArray(a.values) ? a.values[0] : null;
            if (cid != null) add(sums.classes, cid, getValue(a));
          }
          // + to skill tab (dF=14) values[0]=tab, values[1]=classId
          else if (a.name === 'item_addskill_tab') {
            const tab = Array.isArray(a.values) ? a.values[0] : null;
            const cid = Array.isArray(a.values) ? a.values[1] : null;
            if (tab != null && cid != null) {
              const packed = (cid << 3) | (tab & 0x7);
              add(sums.tabs, packed, getValue(a));
            }
          }
          // + to skill (class only) dF=27 and + to skill dF=28 → enhancer sets param appropriately; prefer name check and use values[0] as skillId
          else if (a.df === 27 || a.df === 28 || a.name === 'item_singleskill' || a.name === 'item_nonclassskill' || a.name === 'item_addskill' || a.name === 'item_addskill_classonly') {
            // item_singleskill and item_nonclassskill use values[0] = skillId, values[last] = amount (value also populated)
            const skillId = Array.isArray(a.values) ? a.values[0] : null;
            if (skillId != null) add(sums.skills, skillId, getValue(a));
          }
        }
      }
      const out = [];
      if (sums.all) out.push({ key: 's_all', label: 'All Skills', value: `+${sums.all}` });
      // Current class only
      if (classId != null && sums.classes[classId]) {
        out.push({ key: 's_class', label: `${className} Skills`, value: `+${sums.classes[classId]}` });
      }
      // Skill tabs for current class
      if (classId != null) {
        for (const packedStr of Object.keys(sums.tabs)) {
          const packed = parseInt(packedStr, 10);
          const cid = packed >> 3;
          const tab = packed & 0x7;
          if (cid !== classId) continue;
          const tabName = constants.classes[cid]?.ts?.[tab] || `Tab ${tab+1}`;
          out.push({ key: `s_tab_${cid}_${tab}`, label: tabName, value: `+${sums.tabs[packed]}` });
        }
      }
      // Specific skills
      for (const sidStr of Object.keys(sums.skills)) {
        const sid = parseInt(sidStr, 10);
        const name = constants.skills?.[sid]?.n || `Skill ${sid}`;
        out.push({ key: `s_skill_${sid}`, label: name, value: `+${sums.skills[sid]}` });
      }
      return out;
    },
    aggregatedDisplay() {
        const simpleProps = [
        { key: 'fcr', prop: 'item_fastercastrate', label: 'Faster Cast Rate', suffix: '%', prefix: '' },
        { key: 'ias', prop: 'item_fasterattackrate', label: 'Increased Attack Speed', suffix: '%', prefix: '' },
        { key: 'frw', prop: 'item_fastermovevelocity', label: 'Faster Run/Walk', suffix: '%', prefix: '' },
        { key: 'fhr', prop: 'item_fastergethitrate', label: 'Faster Hit Recovery', suffix: '%', prefix: '' },
        { key: 'mf', prop: 'item_magicbonus', label: 'Magic Find', suffix: '%', prefix: '' },
        { key: 'eg', prop: 'item_goldbonus', label: 'Extra Gold from Monsters', suffix: '%', prefix: '' },
        { key: 'ml', prop: 'manadrainmindam', label: 'Mana stolen per hit', suffix: '%', prefix: '' },
        { key: 'll', prop: 'lifedrainmindam', label: 'Life stolen per hit', suffix: '%', prefix: '' },
        { key: 'pdr', prop: 'normal_damage_reduction', label: 'Physical Damage Reduction', suffix: '', prefix: '' },
        { key: 'mdr', prop: 'magic_damage_reduction', label: 'Magic Damage Reduction', suffix: '', prefix: '' },
          // Removed per request: Defense & Attack Rating
        { key: 'cb', prop: 'item_crushingblow', label: 'Crushing Blow', suffix: '%', prefix: '' },
        { key: 'ow', prop: 'item_openwounds', label: 'Open Wounds', suffix: '%', prefix: '' },
        { key: 'cbf', prop: 'item_cannotbefrozen', label: 'Cannot Be Frozen', suffix: '', prefix: '' },
      ];
      const sums = Object.fromEntries(simpleProps.map(m => [m.prop, 0]));
      // For attack rating composed and absorbs
      const extraSums = {
        tohit: 0,
        item_tohit_percent: 0,
        item_absorbcold_percent: 0,
        item_absorbcold: 0,
        item_absorblight_percent: 0,
        item_absorblight: 0,
        item_absorbfire_percent: 0,
        item_absorbfire: 0,
      };
      const getValue = (attr) => {
        if (!attr) return 0;
        if (typeof attr.value === 'number') return attr.value;
        if (Array.isArray(attr.values) && attr.values.length) return attr.values[attr.values.length - 1] || 0;
        return 0;
      };
      for (const item of this.equippedAndInventory) {
        const attrs = (item && Array.isArray(item.combined_magic_attributes)) ? item.combined_magic_attributes : [];
        for (const a of attrs) {
          if (!a || typeof a.name !== 'string') continue;
          if (a.name in sums) {
            sums[a.name] += getValue(a) || 0;
          } else if (a.name in extraSums) {
            extraSums[a.name] += getValue(a) || 0;
          }
        }
      }
      const result = simpleProps.map(m => {
        let value = sums[m.prop] || 0;
        // Special case for CBF: display Yes when present
        if (m.prop === 'item_cannotbefrozen') {
          return { key: m.key, label: m.label, value: value > 0 ? 'Yes' : '-', suffix: '', prefix: '' };
        }
        return { key: m.key, label: m.label, value: Math.floor(value), suffix: m.suffix, prefix: m.prefix };
      });
        // Attack Rating removed per request
      // Absorbs (prefer % over flat)
      const coldAbs = extraSums.item_absorbcold_percent || 0;
      const coldAbsFlat = extraSums.item_absorbcold || 0;
      result.push({ key: 'abs_cold', label: 'Cold Absorb', value: coldAbs ? Math.floor(coldAbs) : (coldAbsFlat ? Math.floor(coldAbsFlat) : 0), suffix: coldAbs ? '%' : '', prefix: '' });
      const lightAbs = extraSums.item_absorblight_percent || 0;
      const lightAbsFlat = extraSums.item_absorblight || 0;
      result.push({ key: 'abs_light', label: 'Lightning Absorb', value: lightAbs ? Math.floor(lightAbs) : (lightAbsFlat ? Math.floor(lightAbsFlat) : 0), suffix: lightAbs ? '%' : '', prefix: '' });
      const fireAbs = extraSums.item_absorbfire_percent || 0;
      const fireAbsFlat = extraSums.item_absorbfire || 0;
      result.push({ key: 'abs_fire', label: 'Fire Absorb', value: fireAbs ? Math.floor(fireAbs) : (fireAbsFlat ? Math.floor(fireAbsFlat) : 0), suffix: fireAbs ? '%' : '', prefix: '' });
      return result;
    },
    resistDisplay() {
      // Sum elemental resists and max resists from items
      const names = {
        fire: 'fireresist',
        light: 'lightresist',
        cold: 'coldresist',
        poison: 'poisonresist',
      };
      const maxNames = {
        fire: 'maxfireresist',
        light: 'maxlightresist',
        cold: 'maxcoldresist',
        poison: 'maxpoisonresist',
      };
      const sums = { fire: 0, light: 0, cold: 0, poison: 0 };
      const maxSums = { fire: 0, light: 0, cold: 0, poison: 0 };
      // Difficulty penalty
      const penalty = this.selectedDifficulty === 'Hell' ? 100 : (this.selectedDifficulty === 'Nightmare' ? 50 : 0);
      // Prison of Ice: +10 all res per difficulty completed
      const prisonBonus = this.computePrisonOfIceAllRes();
      // Salvation aura bonus
      const salvation = this.computeSalvationAuraBonus();
      const naturalRes = this.computeBarbarianNaturalResistance();
      const getValue = (attr) => {
        if (!attr) return 0;
        if (typeof attr.value === 'number') return attr.value;
        if (Array.isArray(attr.values) && attr.values.length) return attr.values[attr.values.length - 1] || 0;
        return 0;
      };
      for (const item of this.equippedAndInventory) {
        const attrs = (item && Array.isArray(item.combined_magic_attributes)) ? item.combined_magic_attributes : [];
        for (const a of attrs) {
          if (!a || typeof a.name !== 'string') continue;
          if (a.name === names.fire) sums.fire += getValue(a) || 0;
          else if (a.name === names.light) sums.light += getValue(a) || 0;
          else if (a.name === names.cold) sums.cold += getValue(a) || 0;
          else if (a.name === names.poison) sums.poison += getValue(a) || 0;
          else if (a.name === maxNames.fire) maxSums.fire += getValue(a) || 0;
          else if (a.name === maxNames.light) maxSums.light += getValue(a) || 0;
          else if (a.name === maxNames.cold) maxSums.cold += getValue(a) || 0;
          else if (a.name === maxNames.poison) maxSums.poison += getValue(a) || 0;
        }
      }
      const capBase = 75;
      const items = [];
      // Add all-res bonus (quests) to each resist as requested instead of showing separately
      const addAllRes = prisonBonus;
      // Add Salvation aura to fire/light/cold
      sums.fire += addAllRes + salvation + naturalRes;
      sums.light += addAllRes + salvation + naturalRes;
      sums.cold += addAllRes + salvation + naturalRes;
      sums.poison += addAllRes + naturalRes; // Salvation doesn't affect poison
      // Apply difficulty penalty
      const applyPenaltyAndCap = (val, maxAdd) => {
        const maxRes = capBase + Math.floor(maxAdd || 0);
        const after = Math.max(-100, Math.min(maxRes, Math.floor((val || 0) - penalty)));
        return { value: after, cap: maxRes };
      };
      const f = applyPenaltyAndCap(sums.fire, maxSums.fire);
      const l = applyPenaltyAndCap(sums.light, maxSums.light);
      const c = applyPenaltyAndCap(sums.cold, maxSums.cold);
      const p = applyPenaltyAndCap(sums.poison, maxSums.poison);
      items.push({ key: 'firer', label: 'Fire Resistance', value: `${f.value}%`, cls: 'res-fire', tooltip: `Base: ${Math.floor(sums.fire)}%, Penalty: -${penalty}%, Cap: ${f.cap}%` });
      items.push({ key: 'lightr', label: 'Lightning Resistance', value: `${l.value}%`, cls: 'res-light', tooltip: `Base: ${Math.floor(sums.light)}%, Penalty: -${penalty}%, Cap: ${l.cap}%` });
      items.push({ key: 'coldr', label: 'Cold Resistance', value: `${c.value}%`, cls: 'res-cold', tooltip: `Base: ${Math.floor(sums.cold)}%, Penalty: -${penalty}%, Cap: ${c.cap}%` });
      items.push({ key: 'poisr', label: 'Poison Resistance', value: `${p.value}%`, cls: 'res-poison', tooltip: `Base: ${Math.floor(sums.poison)}%, Penalty: -${penalty}%, Cap: ${p.cap}%` });
      return items;
      },
    },
    methods: {
      max(id) {
        let stat = this.stats[id];
        let s = utils.shift(1, stat.cB) - 1;
        if (stat.vS) {
          s = Math.floor(utils.shift(s, -stat.vS))
        }
        return s;
      },
      min(id) {
        return 0;
      },
      change(id, values, idx) {
        let maxValue = this.max(id),
          minValue = this.min(id);
        if (values[idx] > maxValue) {
          values[idx] = maxValue;
        } else if (values[idx] < minValue) {
          values[idx] = minValue;
        }
        if (id == 12) {
          this.save.header.level = values[idx];
          this.save.attributes.experience = xp[values[idx] - 1];
        }
      },
    computePrisonOfIceAllRes() {
      if (!this.save || !this.save.header) return 0;
      const diffs = ['quests_normal', 'quests_nm', 'quests_hell'];
      let completed = 0;
      for (const d of diffs) {
        try {
          if (this.save.header[d]?.act_v?.prison_of_ice?.is_completed) completed++;
        } catch (_) { }
      }
      return completed * 10;
    },
    computeSalvationAuraBonus() {
      // Find item_aura with skill Salvation and derive bonus by level
      const constants = this.$getWorkConstantData();
      let maxAuraLevel = 0;
      for (const item of this.equippedAndInventory) {
        const attrs = (item && Array.isArray(item.combined_magic_attributes)) ? item.combined_magic_attributes : [];
        for (const a of attrs) {
          if (!a || a.name !== 'item_aura' || !Array.isArray(a.values)) continue;
          const skillId = a.values[0] ?? 0;
          const levelCandidate1 = a.values[1] ?? 0; // common layout: [skillId, level]
          const levelCandidate2 = (typeof a.value === 'number' && a.value > 0) ? a.value : 0; // if enhancer populated value
          const level = levelCandidate1 || levelCandidate2;
          const skillName = constants?.skills?.[skillId]?.n || '';
          if (skillName.toLowerCase() === 'salvation' && level > 0) {
            maxAuraLevel = Math.max(maxAuraLevel, level);
          }
        }
      }
      if (maxAuraLevel <= 0) return 0;
      // Map levels to resist bonus (capped by provided table)
      if (maxAuraLevel >= 4) return 80;
      if (maxAuraLevel === 3) return 75;
      if (maxAuraLevel === 2) return 68;
      return 60; // level 1
    },
    computeBarbarianNaturalResistance() {
      // Only applies to Barbarian; compute total level of Natural Resistance including +skills
      const constants = this.$getWorkConstantData();
      if ((this.save?.header?.class || '').toLowerCase() !== 'barbarian') return 0;
      // Find the skill id for Natural Resistance
      let naturalId = null;
      for (const sid in constants.skills || {}) {
        const sk = constants.skills[sid];
        if (sk?.n === 'Natural Resistance') { naturalId = parseInt(sid, 10); break; }
      }
      if (naturalId == null) return 0;
      // Base points
      const basePoints = (this.save?.skills || []).find(s => s.id === naturalId)?.points || 0;
      // + to specific skill from gear
      let plusSpecific = 0;
      // + to class skills (Barbarian)
      let plusClass = 0;
      // + to skill tab (Masteries) for Barbarian (tab index: try to detect by skill's class tab id if present)
      let plusTab = 0;
      // + all skills
      let plusAll = 0;
      const isBarbarianClassId = constants.classes.find(c => c?.n === 'Barbarian')?.id;
      // We need to infer Natural Resistance's tab; try to read from SkillDesc or fallback to tab 1 (Masteries)
      // If constants has SkillDesc mapping, it would be ideal; as a heuristic, use tab 1 for Barbarian Masteries
      const masteryTabIdx = 1;
      for (const item of this.equippedAndInventory) {
        const attrs = (item && Array.isArray(item.combined_magic_attributes)) ? item.combined_magic_attributes : [];
        for (const a of attrs) {
          if (!a || typeof a.name !== 'string') continue;
          const val = (typeof a.value === 'number') ? a.value : (Array.isArray(a.values) ? (a.values[a.values.length - 1] || 0) : 0);
          if (!val) continue;
          if (a.name === 'item_allskills') plusAll += val;
          else if (a.name === 'item_addclassskills') {
            const cid = Array.isArray(a.values) ? a.values[0] : null;
            if (cid === isBarbarianClassId) plusClass += val;
          } else if (a.name === 'item_addskill_tab') {
            const tab = Array.isArray(a.values) ? a.values[0] : null;
            const cid = Array.isArray(a.values) ? a.values[1] : null;
            if (cid === isBarbarianClassId && tab === masteryTabIdx) plusTab += val;
          } else if (a.name === 'item_singleskill' || a.name === 'item_nonclassskill' || a.df === 27 || a.df === 28) {
            const sid = Array.isArray(a.values) ? a.values[0] : null;
            if (sid === naturalId) plusSpecific += val;
          }
        }
      }
      const totalLevel = basePoints + plusSpecific + plusClass + plusTab + plusAll;
      if (totalLevel <= 0) return 0;
      // Map level -> resist % using provided table ranges
      const table = [
        0,12,21,28,35,40,44,47,49,52,54,56,58,60,61,62,64,64,65,66,67,
        68,68,69,70,70,71,72,72,72,72,73,73,74,74,74,75,75,76,76,76,
        76,76,76,76,77,77,77,77,78,78,78,78,78,79,79,79,79,79,79,80
      ];
      const lvl = Math.max(1, Math.min(totalLevel, table.length - 1));
      return table[lvl] || 0;
    }
  },
  watch: {
    "save.header.level": function (level, s) {
      this.save.attributes.level = level;
      this.save.attributes.experience = xp[level - 1];

      const newLevel = level - s;
      this.save.attributes.unused_stats = (this.save.attributes.unused_stats ?? 0) + (newLevel * 5);
      this.save.attributes.unused_skill_points = (this.save.attributes.unused_skill_points ?? 0) + newLevel;
      const constants = this.$getWorkConstantData();
      for (const cCode in constants.classes) {
        const stat = constants.classes[cCode];
        if (stat.n === this.save.header.class) {
          this.save.attributes.max_hp += newLevel * stat.s.lpl / 4;
          this.save.attributes.current_hp += newLevel * stat.s.lpl / 4;

          this.save.attributes.max_stamina += newLevel * stat.s.spl / 4;
          this.save.attributes.current_stamina += newLevel * stat.s.spl / 4;

          this.save.attributes.max_mana += newLevel * stat.s.mpl / 4;
          this.save.attributes.current_mana += newLevel * stat.s.mpl / 4;
          break;
        }
      }
    },
    "save.attributes.vitality": function (val, old) {
      const constants = this.$getWorkConstantData();
      const change = val - old;
      for (const cCode in constants.classes) {
        const stat = constants.classes[cCode];
        if (window.stat.n === this.save.header.class) {
          this.save.attributes.max_hp += change * stat.s.lpv / 4;
          this.save.attributes.current_hp += change * stat.s.lpv / 4;

          this.save.attributes.max_stamina += change * stat.s.spv / 4;
          this.save.attributes.current_stamina += change * stat.s.spv / 4;
          break;
        }
      }
    },
    "save.attributes.energy": function (val, old) {
      const constants = this.$getWorkConstantData();
      const change = val - old;
      for (const cCode in constants.classes) {
        const stat = constants.classes[cCode];
        if (window.stat.n === this.save.header.class) {
          this.save.attributes.max_mana += change * stat.s.mpe / 4;
          this.save.attributes.current_mana += change * stat.s.mpe / 4;
          break;
        }
        }
      },
    }
  };  
</script>

<style>
label {
  width: unset;
}

.display-stats {
  display: block;
}

.display-stats .stats-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 12px;
  row-gap: 4px;
  align-items: center;
}

.display-stats .stat-label {
  color: #8ab4f8;
}

.display-stats .stat-value {
  text-align: right;
}

.mt-4 {
  margin-top: 1.5rem;
}

/* Pastel colors for resist values */
.res-fire {
  color: #d88b8b;
}

.res-light {
  color: #d8ca8b;
}

.res-cold {
  color: #8bb1d8;
}

.res-poison {
  color: #8bd89d;
}
</style>