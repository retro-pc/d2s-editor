<template>
  <div class="stash">
    <div
      class="btn-group"
      role="group">
      <button
        v-for="tabIndex in (items && items.pages ? items.pages.length : 0)"
        :key="tabIndex"
        type="button"
        class="btn btn-secondary"
        :class="{ active: activeTab === tabIndex }"
        @click="changeTab(tabIndex)">
        {{ tabIndex === 1 ? 'Personal' : `Shared` }}
      </button>
    </div>
    <div class="stash-bg" :class="{ 'stash-bg-big': $work_mod.value !== 'diablo2' }">
      <Grid
        v-if="items && items.pages && items.pages.length > 0"
        :width="stashGrid.w"
        :height="stashGrid.h"
        :page="activeTab"
        :items.sync="stash(activeTab - 1)"
        @item-selected="onSelect"
        @item-event="onEvent"
        :id="'Grid'"
        :contextMenu="contextMenu"
        class="y-0"></Grid>
    </div>
  </div>
</template>

<script>
import Grid from './Grid.vue';
import ContextMenu from "../ContextMenu.vue";

export default {
  name: 'Stash',
  components: {
    Grid,
    ContextMenu
  },
  data() {
    return {
      activeTab: 1
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