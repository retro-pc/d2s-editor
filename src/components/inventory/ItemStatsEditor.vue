<template>
  <div style="padding-top: 20px;">
    <div v-for="(stat, statIdx) in itemStats" :key="statIdx" class="form-row">
      <div class="col-md-auto">
        <button type="button" class="btn btn-link red" @click="removeStat(statIdx)">&times;</button>
      </div>
      <div class="col-md-3" style="padding-top: 5px;">
        <multiselect v-model.number="stat.id" :options="stats_options" :searchable="true" :canDeselect="false" :canClear="false" :required="true" @update:model-value="onItemModified"/>
      </div>
      <div v-for="valIdx in numValues(stat.id)" class="col-md-2" style="padding-top: 5px;">
        <template v-if="isClass(stat.id, valIdx)">
          <multiselect v-model.number="stat.values[valIdx-1]" :options="classes.map(charClass => ({value: charClass.id, label: charClass.co}))" :searchable="true" :canDeselect="false" :canClear="false" @update:model-value="onItemModified"/>
        </template>
        <template v-else-if="isClassSkillTab(stat.id, valIdx)">
          <multiselect v-model.number="stat.values[valIdx-1]" :options="[0, 1, 2].map(idx2 => ({value: idx2, label: classes[stat.values[valIdx]].ts[idx2]}))" :searchable="true" :canDeselect="false" :canClear="false" @update:model-value="onItemModified"/>
        </template>
        <template v-else-if="isSkill(stat.id, valIdx)">
          <multiselect v-model.number="stat.values[valIdx-1]" :options="skills_options" :searchable="true" :canDeselect="false" :canClear="false" @update:model-value="onItemModified"/>
        </template>
        <input v-else :id="id + 'Stat' + statIdx + 'Index'+ valIdx" v-model.number="stat.values[valIdx-1]"
        type="number" class= "edit-box" :min="getMinValue(stat.id, valIdx -1)" :max="getMaxValue(stat.id, valIdx - 1)" @input="changeStatValue(stat.id, stat.values, valIdx-1)">
      </div>
    </div>
    
    <div class="form-row">
      <button type="button" class="btn btn-link" @click="addNewStat">Add Stat</button>
    </div>
  </div>
</template>

<script>
import utils from '../../utils.js';

export default {
  props: {
    id: String,
    itemStats: Array,
    disabled: Boolean,
  },
  data() {
    return {
      stats: this.$getWorkConstantData().magical_properties,
      stats_options: this.$getWorkConstantData().magical_properties
        .filter(stat => stat && stat.s)
        .map(stat => ({value: stat.id, label: stat.s, desc: stat.dP || ""})),
      skills_options: this.$getWorkConstantData().skills
        .filter((skill) => skill && skill.s)
        .map((skill) => ({ value: skill.id, label: `${skill.s}${skill.id > 5 && !skill.c ? " (item)" : ""}` }))
        .sort((a, b) => { return a.label.localeCompare(b.label) }),
      classes: this.$getWorkConstantData().classes,
    }
  },
  methods: {
    onItemModified() {
      for (let i = 0; i < this.itemStats.length; i++) {
        let numVal = this.numValues(this.itemStats[i].id);
        if (numVal != this.itemStats[i].values.length) {
          this.itemStats[i].values = [0, 0, 0, 0].slice(0, numVal);
        }
      }
      this.$emit('stat-change', this.itemStats)
    },
    addNewStat() {
      const updated = Array.isArray(this.itemStats)
        ? [...this.itemStats, { id: 0, values: [1, 0, 1] }]
        : [{ id: 0, values: [1, 0, 1] }];
      this.$emit('update:itemStats', updated);

      //this.itemStats.push({ id: 0, values: [0] });
      this.onItemModified();
    },
    getMaxValue(statId, valIdx) {
      let stat = this.stats[statId];
      if (stat.np && valIdx < stat.np) {
        // Stat is a succession of np values (ex: coldmindam > coldmaxdam > coldlength)
        stat = this.stats[statId + valIdx];
      }
      const bitSize = this.getValueBitSize(stat, valIdx);
      const add = stat.sA ? stat.sA : 0;
      return utils.shift(1, bitSize) - 1 - add;
    },
    getMinValue(statId, valIdx) {
      let stat = this.stats[statId];
      if (valIdx > 0) {
        if (stat.np && valIdx < stat.np) {
          // Stat is a succession of np values (ex: coldmindam > coldmaxdam > coldlength)
          stat = this.stats[statId + valIdx];
        }
        // TODO: encode
      }
      let add = stat.sA ? stat.sA : 0;
      return -add;
    },
    changeStatValue(id, values, idx) {
      let maxValue = this.getMaxValue(id),
        minValue = this.getMinValue(id);
      if (values[idx] > maxValue) {
        values[idx] = maxValue;
      } else if (values[idx] < minValue) {
        values[idx] = minValue;
      }
      //"item_maxdamage_percent"
      if (id == 17) values[idx + 1] = values[idx];

      this.onItemModified();
    },
    removeStat(idx) {
      this.itemStats.splice(idx, 1);
      this.onItemModified();
    },
    isClass(id, idx) {
      let stat = this.stats[id];
      if ((stat.dF == 14) && idx == 2) {
        return true;
      }
      if ((stat.dF == 13) && idx == 1) {
        return true;
      }
      return false;
    },
    isClassSkillTab(id, idx) {
      let stat = this.stats[id];
      if ((stat.dF == 14) && idx == 1) {
        return true;
      }
      return false;
    },
    isSkill(id, idx) {
      let stat = this.stats[id];
      if (stat.dF == 15 || stat.dF == 24) {
        // Similar to e=2 or 3
        return idx == 2;
      }
      if (stat.dF == 16) {
        return idx == 1;
      }
      if (stat.dF == 16 || stat.dF == 27 || stat.dF == 28) {
        // Aura when equipped or Similar to e=1
        return idx == 1;
      }
      return false;
    },
    numValues(id) {
      let stat = this.stats[id];
      if (stat) {
        if (stat.np) {
          return stat.np
        }
        if (stat.dF == 14 || stat.e == 2) {
          return 3;
        }
        if (stat.e == 3) {
          return 4;
        }
        if (stat.sP) {
          return 2;
        }
        return 1;
      }
    },
    getValueBitSize(itemStatDef, valIdx) {
      // 0-indexed
      let bitSize = itemStatDef.sB;
      switch (itemStatDef.e) {
        case 1: // Logic is reversed: Param is the value, and values are the Params
          if (valIdx == 1 && itemStatDef.sP) bitSize = itemStatDef.sP;
          break;
        case 2: // 2 Params (6bits skill level + 10bits skill ID) + 1 Value (7bits chance)
          if (valIdx == 0) bitSize = 6;
          if (valIdx == 1) bitSize = 10;
          break;
        case 3: // 2 Params (6bits skill level + 10bits skill ID) + 2 Values (8bits current charges, 8bits max charges)
          if (valIdx == 0) bitSize = 6;
          if (valIdx == 1) bitSize = 10;
          if (valIdx == 2) bitSize = 8;
          if (valIdx == 3) bitSize = 8;
          break;
        default: // Undefined: optional (sP bits param) + sB bits value
          if (valIdx == 0 && itemStatDef.sP) bitSize = itemStatDef.sP;
          break;
      }
      return bitSize;
    }
  }
}  
</script>
