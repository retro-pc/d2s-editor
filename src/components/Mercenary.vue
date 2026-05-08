<template>
  <div class="mercenary-settings d-flex justify-content-start gap-3 mb-3">
    <a-select v-model:value="mercenaryType" style="width: 255px" placeholder="Mercenary Type" :allow-clear="true">
      <a-select-option v-for="type in mercTypes" :key="type.value" :value="type.value">{{ type.label }}</a-select-option>
    </a-select>
    <!-- <a-input-number v-model:value="mercNameId" :min="0" :max="65535" style="width: 150px" placeholder="Name ID" title="merc_name_id" /> -->
    <a-input-number v-model:value="mercenaryLevel" :min="1" :max="99" style="width: 60px" placeholder="Level" />
  </div>
  <div class="mercenary">
    <span class="mercenary-head"
      v-on:drop="drop($event, 1)"
      v-on:dragover="dragover"
      v-on:dragenter="dragenter($event, 1)"
      v-on:dragleave="dragleave($event, 1)">
      <div
        class="layer"
        :id="id + '-1'">
      </div>
      <Item v-if="head" :item.sync="head" :dimmed="isItemDimmed ? isItemDimmed(head) : false" :highlighted="isItemHighlighted ? isItemHighlighted(head) : false" @hover="onHover(head)" @click.native="onSelect(head)" @contextmenu.prevent.stop="itemRC($event, head)"/>
    </span>
    <span class="mercenary-torso"
      v-on:drop="drop($event, 3)"
      v-on:dragover="dragover"
      v-on:dragenter="dragenter($event, 3)"
      v-on:dragleave="dragleave($event, 3)">
      <div
        class="layer"
        :id="id + '-3'">
      </div>
      <Item v-if="torso" :item.sync="torso" :dimmed="isItemDimmed ? isItemDimmed(torso) : false" :highlighted="isItemHighlighted ? isItemHighlighted(torso) : false" @hover="onHover(torso)" @click.native="onSelect(torso)" @contextmenu.prevent.stop="itemRC($event, torso)"/>
    </span>
    <span class="mercenary-right-hand weapon"
      v-on:drop="drop($event, 4)"
      v-on:dragover="dragover"
      v-on:dragenter="dragenter($event, 4)"
      v-on:dragleave="dragleave($event, 4)">
      <div
        class="layer"
        :id="id + '-4'">
      </div>
      <Item v-if="right_hand" :item.sync="right_hand" :dimmed="isItemDimmed ? isItemDimmed(right_hand) : false" :highlighted="isItemHighlighted ? isItemHighlighted(right_hand) : false" @hover="onHover(right_hand)" @click.native="onSelect(right_hand)" @contextmenu.prevent.stop="itemRC($event, right_hand)"/>
    </span>
    <span class="mercenary-left-hand weapon"
      v-on:drop="drop($event, 5)"
      v-on:dragover="dragover"
      v-on:dragenter="dragenter($event, 5)"
      v-on:dragleave="dragleave($event, 5)">
      <div
        class="layer"
        :id="id + '-5'">
      </div>
      <Item v-if="left_hand" :item.sync="left_hand" :dimmed="isItemDimmed ? isItemDimmed(left_hand) : false" :highlighted="isItemHighlighted ? isItemHighlighted(left_hand) : false" @hover="onHover(left_hand)" @click.native="onSelect(left_hand)" @contextmenu.prevent.stop="itemRC($event, left_hand)"/>
    </span>
  </div>
</template>

<script>
  import Item from './inventory/Item.vue';

  export default {
    components: {
      Item
    },
    props: {
      items: Array,
      id: String,
      contextMenu: Object,
      isItemDimmed: Function,
      isItemHighlighted: Function,
      save: Object,
    },
    data() {
      return {
        mercTypes: [
          { value: 0, label: 'Rogue (Fire - Normal)' },
          { value: 1, label: 'Rogue (Cold - Normal)' },
          { value: 2, label: 'Rogue (Fire - Nightmare)' },
          { value: 3, label: 'Rogue (Cold - Nightmare)' },
          { value: 4, label: 'Rogue (Fire - Hell)' },
          { value: 5, label: 'Rogue (Cold - Hell)' },
          { value: 6, label: 'Desert Merc (Prayer - Normal)' },
          { value: 7, label: 'Desert Merc (Defiance - Normal)' },
          { value: 8, label: 'Desert Merc (Blessed Aim - Normal)' },
          { value: 9, label: 'Desert Merc (Thorns - Nightmare)' },
          { value: 10, label: 'Desert Merc (Holy Freeze - Nightmare)' },
          { value: 11, label: 'Desert Merc (Might - Nightmare)' },
          { value: 12, label: 'Desert Merc (Prayer - Hell)' },
          { value: 13, label: 'Desert Merc (Defiance - Hell)' },
          { value: 14, label: 'Desert Merc (Blessed Aim - Hell)' },
          { value: 33, label: 'Desert Merc (Thorns - Hell)' },
          { value: 34, label: 'Desert Merc (Holy Freeze - Hell)' },
          { value: 35, label: 'Desert Merc (Might - Hell)' },
          { value: 15, label: 'Iron Wolf (Fire - Normal)' },
          { value: 16, label: 'Iron Wolf (Cold - Normal)' },
          { value: 17, label: 'Iron Wolf (Lightning - Normal)' },
          { value: 18, label: 'Iron Wolf (Fire - Nightmare)' },
          { value: 19, label: 'Iron Wolf (Cold - Nightmare)' },
          { value: 20, label: 'Iron Wolf (Lightning - Nightmare)' },
          { value: 21, label: 'Iron Wolf (Fire - Hell)' },
          { value: 22, label: 'Iron Wolf (Cold - Hell)' },
          { value: 23, label: 'Iron Wolf (Lightning - Hell)' },
          { value: 24, label: 'Barbarian (2H Sword - Normal)' },
          { value: 26, label: 'Barbarian (2H Sword - Nightmare)' },
          { value: 28, label: 'Barbarian (2H Sword - Hell)' },
          { value: 36, label: 'Barbarian (1H + Shield - Normal)' },
          { value: 37, label: 'Barbarian (1H + Shield - Nightmare)' },
          { value: 38, label: 'Barbarian (1H + Shield - Hell)' },
          { value: 39, label: 'Barbarian (Dual Wield - Normal)' },
          { value: 40, label: 'Barbarian (Dual Wield - Nightmare)' },
          { value: 41, label: 'Barbarian (Dual Wield - Hell)' },
        ],
      };
    },
    computed: {
      mercenaryType: {
        get() {
          return this.save?.header?.merc_type;
        },
        set(value) {
          if (this.save && this.save.header) {
            this.save.header.merc_type = value;
          }
        }
      },
      mercNameId: {
        get() {
          return this.save?.header?.merc_name_id;
        },
        set(value) {
          if (this.save && this.save.header) {
            this.save.header.merc_name_id = value;
          }
        }
      },
      mercenaryLevel: {
        get() {
          // Вычисляем уровень из опыта (примерная формула)
          if (!this.save?.header?.merc_experience) return 1;
          // Упрощенная формула: каждые 10000 опыта = 1 уровень
          return Math.min(99, Math.max(1, Math.floor(this.save.header.merc_experience / 10000) + 1));
        },
        set(value) {
          if (this.save && this.save.header) {
            // Конвертируем уровень обратно в опыт
            this.save.header.merc_experience = (value - 1) * 10000;
          }
        }
      },
      head() { return this.items.find(e => e.equipped_id === 1); },
      neck() { return this.items.find(e => e.equipped_id === 2); },
      torso() { return this.items.find(e => e.equipped_id === 3); },
      right_hand() { return this.items.find(e => e.equipped_id === 4); },
      left_hand() { return this.items.find(e => e.equipped_id === 5); },
      right_finger() { return this.items.find(e => e.equipped_id === 6); },
      left_finger() { return this.items.find(e => e.equipped_id === 7); },
      waist() { return this.items.find(e => e.equipped_id === 8); },
      feet() { return this.items.find(e => e.equipped_id === 9); },
      hands() { return this.items.find(e => e.equipped_id === 10); },
      alt_right_hand() { return this.items.find(e => e.equipped_id === 11); },
      alt_left_hand() { return this.items.find(e => e.equipped_id === 12); }
    },
    methods: {
      onHover(item) {
        this.$emit('item-hover', item);
      },
      onEvent(e) {
        this.$emit('item-event', e);
      },
      onSelect(item) {
        this.$emit('item-selected', item);
      },
      itemRC($evt, item) {
        if (item != null) {
          this.contextMenu.showContextMenu($evt, item, [
            {text: "Select"},
            {text: "Copy"},
            {text: "Share"},
            {text: "Delete"}
          ]);
        }
      },
      dragover(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        return false;
      },
      dragenter(event, equipped_location) {
        event.preventDefault();
        let data = JSON.parse(localStorage.getItem('dragElement'));
        this.$emit('item-event', {
          uuid: data.uuid,
          item: data.item,
          id: `${this.id}-${equipped_location}`,
          location: {
            location: 0,
            equipped_location: equipped_location,
          },
          type: 'dragenter'
        });
      },
      dragleave(event, equipped_location) {
        event.preventDefault();
        let data = JSON.parse(localStorage.getItem('dragElement'));
        this.$emit('item-event', {
          uuid: data.uuid,
          item: data.item,
          id: `${this.id}-${equipped_location}`,
          location: {
            location: 0,
            equipped_location: equipped_location,
          },
          type: 'dragleave'
        });
      },
      drop(event, equipped_location) {
        event.preventDefault();
        let data = JSON.parse(localStorage.getItem('dragElement'));
        this.$emit('item-event', {
          uuid: data.uuid,
          item: data.item,
          id: `${this.id}-${equipped_location}`,
          location: {
            location: 0,
            equipped_location: equipped_location,
          },
          type: 'move'
        });
      },    
    }
  };  
</script>