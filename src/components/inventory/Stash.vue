<template>
  <div class="stash">
    <div class="btn-group" role="group">
      <template v-if="!hidePersonal">
        <a-button
          type="default"
          :class="{ active: activeTab == 1 }"
          @click="changeTab(1)">Personal</a-button>
        <a-button
          v-for="i in sharedCount"
          :key="`shared-tab-${i}`"
          type="default"
          :class="{ active: activeTab == (i + 1) }"
          @click="changeTab(i + 1)">Shared</a-button>
      </template>
      <template v-else>
        <a-button
          v-for="i in sharedCount"
          :key="`shared-only-tab-${i}`"
          type="default"
          :class="{ active: activeTab == i }"
          @click="changeTab(i)">Shared</a-button>
      </template>
    </div>
    <div class="stash-bg" :class="{'stash-bg-big': $work_mod.value !== 'diablo2'}">
      <Grid
        v-if="!hidePersonal && activeTab == 1"
        :width="stashGrid.w"
        :height="stashGrid.h"
        :page="1"
        :items.sync="stash(0)"
        @item-selected="onSelect"
        @item-event="onEvent"
        :id="'Grid'"
        :contextMenu="contextMenu"
        class="y-0"></Grid>
      <Grid
        v-for="i in sharedCount"
        :key="`grid-${i}`"
        v-show="(hidePersonal ? activeTab == i : activeTab == (i + 1))"
        :width="stashGrid.w"
        :height="stashGrid.h"
        :page="hidePersonal ? i : (i + 1)"
        :items.sync="stash(i)"
        @item-selected="onSelect"
        @item-event="onEvent"
        :id="'Grid'"
        :contextMenu="contextMenu"
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
    hidePersonal: Boolean,
    sharedCount: Number,
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