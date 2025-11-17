<template>
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
      <Item v-if="head" :item.sync="head" @click.native="onSelect(head)" @contextmenu.prevent.stop="itemRC($event, head)"/>
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
      <Item v-if="torso" :item.sync="torso" @click.native="onSelect(torso)" @contextmenu.prevent.stop="itemRC($event, torso)"/>
    </span>
    <span class="mercenary-right-hand weapon">
      <Item v-if="right_hand" :item.sync="right_hand" @click.native="onSelect(right_hand)" @contextmenu.prevent.stop="itemRC($event, right_hand)"/>
    </span>
    <span class="mercenary-left-hand weapon">
      <Item v-if="left_hand" :item.sync="left_hand" @click.native="onSelect(left_hand)" @contextmenu.prevent.stop="itemRC($event, left_hand)"/>
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
    },
    computed: {
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