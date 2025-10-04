<template>
  <div class="stash">
    <div
          class="btn-group"
          role="group">
        <button
            type="button"
            class="btn btn-secondary"
            :class="{ active: activeTab == 1 }"
            @click="changeTab(1)">Personal
        </button>
        <button
            type="button"
            class="btn btn-secondary"
            :class="{ active: activeTab == 2 }"
            @click="changeTab(2)">Shared
        </button>
        <button
            type="button"
            class="btn btn-secondary"
            :class="{ active: activeTab == 3 }"
            @click="changeTab(3)">Shared
        </button>
        <button
            type="button"
            class="btn btn-secondary"
            :class="{ active: activeTab == 4 }"
            @click="changeTab(4)">Shared
        </button>
    </div>
    <div class="stash-bg":class="{'stash-bg-big': $work_mod.value !== 'diablo2'}">
      <Grid
          v-if="activeTab == 1"
          :width="stashGrid.w"
          :height="stashGrid.h"
          :page="1"
          :items.sync="stash(0)"
          @item-selected="onSelect"
          @item-event="onEvent"
          :id="'Grid'"
          :contextMenu=contextMenu
          class="y-0"></Grid>
      <Grid
          v-if="activeTab == 2"
          :width="stashGrid.w"
          :height="stashGrid.h"
          :page="2"
          :items.sync="stash(1)"
          @item-selected="onSelect"
          @item-event="onEvent"
          :id="'Grid'"
          :contextMenu=contextMenu
          class="y-0"></Grid>
      <Grid
          v-if="activeTab == 3"
          :width="stashGrid.w"
          :height="stashGrid.h"
          :page="3"
          :items.sync="stash(2)"
          @item-selected="onSelect"
          @item-event="onEvent"
          :id="'Grid'"
          :contextMenu=contextMenu
          class="y-0"></Grid>
      <Grid
          v-if="activeTab == 4"
          :width="stashGrid.w"
          :height="stashGrid.h"
          :page="4"
          :items.sync="stash(3)"
          @item-selected="onSelect"
          @item-event="onEvent"
          :id="'Grid'"
          :contextMenu=contextMenu
          class="y-0"></Grid>
    </div>
  </div>
</template>

<script>
import Item from './Item.vue';
import Grid from './Grid.vue';
import ContextMenu from "../ContextMenu.vue";

export default {
  name: 'Stash',
  components: {
    Item,
    Grid,
    ContextMenu
  },
  data() {
    return {
      activeTab: 1,
      gameMode: 'd2r-blizz'
    };
  },
  props: {
    items: Object,
    id: String,
    contextMenu: Object,
  },
  computed: {
    stashGrid() {
      return this.$work_mod.value === 'blizzless'
          ? { w: 16, h: 13 }
          : { w: 10, h: 10 };
    }
  },
  methods: {
    onSelect(item) {
      this.$emit('item-selected', item);
    },
    onEvent(e) {
      this.$emit('item-event', e);
    },
    stash(i) {
      if (this.items.pages[i] == null) return [];
      return this.items.pages[i].items || []
    },
    changeTab(i) {
      this.activeTab = i;
    },
  }
}
</script>