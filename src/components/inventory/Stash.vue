<template>
  <div class="stash">
    <div
      class="btn-group"
      role="group">
      <button
        v-for="(pageIndex, idx) in displayedPages"
        :key="pageIndex"
        type="button"
        class="btn btn-secondary"
        :class="{ active: activeTab === (idx + 1) }"
        @click="changeTab(idx + 1)">
        {{ mode === 'character' ? 'Personal' : 'Shared' }}
      </button>
    </div>
    <div v-if="mode === 'character'" class="stash-gold d-flex align-items-center">
      <img src="img/icons/gold.png" alt="gold" style="height:20px;width:20px;object-fit:contain;" />
      <span class="ml-2 text-sm">{{ goldForActiveTab || 0 }}</span>
    </div>
    <div class="stash-bg" :class="{ 'stash-bg-big': $work_mod.value !== 'diablo2' }">
      <Grid
        v-if="currentPageIndex !== null"
        :width="stashGrid.w"
        :height="stashGrid.h"
        :page="gridPageNumber"
        :items.sync="stash(currentPageIndex)"
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
    mode: {
      type: String,
      default: 'character'
    }
  },
  computed: {
    goldForActiveTab() {
      try {
        // Personal page 1 uses save.attributes.gold; shared pages use stashData.sharedGold if present
        if (!this.items) return null;
        if (this.mode === 'character') {
          // Expect parent passes player stashed gold via items.meta?.stashedGold
          if (this.items.meta && typeof this.items.meta.stashedGold === 'number') {
            return this.items.meta.stashedGold;
          }
          return 0;
        }
        // Active shared page
        if (this.items.meta && typeof this.items.meta.sharedGold === 'number') {
          return this.items.meta.sharedGold;
        }
        return 0;
      } catch (_) {
        return 0;
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
    },
    displayedPages() {
      const pages = (this.items && Array.isArray(this.items.pages)) ? this.items.pages : [];
      if (!pages.length) return [];
      if (this.mode === 'character') return [0];
      // Only shared pages: indices 1..N-1
      return pages.slice(1).map((_, idx) => idx + 1);
    },
    currentPageIndex() {
      if (!this.displayedPages.length) return null;
      const idx = this.activeTab - 1;
      return this.displayedPages[idx] ?? this.displayedPages[0];
    },
    gridPageNumber() {
      // Preserve old numbering: personal -> 1, first shared -> 2, etc.
      if (this.mode === 'character') return 1;
      return (this.currentPageIndex != null) ? (this.currentPageIndex + 1) : 2;
    }
  },
  watch: {
    mode() {
      this.resetActiveTab();
    },
    displayedPages() {
      this.resetActiveTab();
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
    resetActiveTab() {
      if (this.activeTab < 1 || this.activeTab > this.displayedPages.length) {
        this.activeTab = 1;
      }
    }
  }
}
</script>