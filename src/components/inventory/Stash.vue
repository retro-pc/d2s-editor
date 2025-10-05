<template>
  <div class="stash mt-3">
    <div class="btn-group" role="group">
      <template v-if="!hidePersonal">
        <a-button
          type="default"
          :class="{ active: activeTab == 1, 'stash-tab': true }"
          @click="changeTab(1)">Personal</a-button>
        <a-button
          v-for="i in sharedCount"
          :key="`shared-tab-${i}`"
          type="default"
          :class="{ active: activeTab == (i + 1), 'stash-tab': true }"
          @click="changeTab(i + 1)">Shared</a-button>
      </template>
      <template v-else>
        <a-button
          v-for="i in sharedCount"
          :key="`shared-only-tab-${i}`"
          type="default"
          :class="{ active: activeTab == i, 'stash-tab': true }"
          @click="changeTab(i)">Shared</a-button>
      </template>
    </div>
    <div class="stash-gold d-flex align-items-center" v-if="goldForActiveTab != null">
      <img src="img/icons/gold.png" alt="gold" style="height:20px;width:20px;object-fit:contain;" />
      <span class="ml-2">{{ goldForActiveTab }}</span>
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
    goldForActiveTab() {
      try {
        // Personal page 1 uses save.attributes.gold; shared pages use stashData.sharedGold if present
        if (!this.items) return null;
        if (!this.hidePersonal && this.activeTab === 1) {
          // Expect parent passes player stashed gold via items.meta?.stashedGold
          if (this.items.meta && typeof this.items.meta.stashedGold === 'number') {
            return this.items.meta.stashedGold;
          }
          return null;
        }
        // Active shared page
        if (this.items.meta && typeof this.items.meta.sharedGold === 'number') {
          return this.items.meta.sharedGold;
        }
        return null;
      } catch (_) {
        return null;
      }
    },
    goldLabel() {
      if (!this.items) return 'Gold';
      if (!this.hidePersonal && this.activeTab === 1) return 'Stashed Gold';
      return 'Shared Gold';
    },
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