<template>
  <ContextMenu :ref="'contextMenu'" @option-clicked="optionClicked"></ContextMenu>
  <div @click.native="rootClick">
    <link v-if="theme == 'd2'" href="css/theme.css" rel="stylesheet" />

    <div class="modal" tabindex="-1" role="dialog" id="LoadItem">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select an Item</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row d-flex justify-content-center mt-3 pl-5 pr-5">
              <Item v-if="preview?.type" :item="preview" clazz="item-edit"></Item>
            </div>
            <label for="Item">Item</label>
            <multiselect v-model="previewModel" :options="itempack" label="key" valueProp="value" :searchable="true"
              @update:model-value="setPreviewItem()" />
            <div v-if="baseOptions">
              <label>Base</label>
              <multiselect v-model="baseModel" :options="baseOptions" label="label" valueProp="value" :searchable="true"
                @update:model-value="setBase" />
            </div>
          </div>
          <div class="modal-footer">
            <input style="display:none;" type="file" name="d2iFile" @change="onItemFileChange" id="d2iFile">
            <label for="d2iFile" class="mb-0 btn btn-primary">Load D2I</label>
            <button type="button" class="btn btn-primary" @click="loadBase64Item">Load Base64</button>
            <button type="button" class="btn btn-primary" :disabled="!preview?.type" @click="loadItem">Load</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="offset-lg-1 col-lg-10 ">
          <div class="card bg-light">
            <div class="card-body">
              <div class="alert alert-primary" role="alert">
                This editor is still a work in progress. Some things may not work.
              </div>
              <form id="d2sForm">
                <fieldset>
                  <a-flex justify="space-between" align="center">
                    <div class="col-6 px-0">
                      <h5>Create character</h5>
                      <a-dropdown>
                        <button type="button" class="btn btn-primary">Create new</button>
                        <template #overlay>
                          <a-menu>
                            <template v-for="cls in createNewMenu">
                              <template v-if="!buildsFor(cls).length">
                                <a-menu-item :key="cls.key" @click="newChar(cls.baseIndex)">
                                  <a-flex align="center" justify="start" gap="8">
                                    <img :src="`img/chars/${cls.key}.webp`" alt="class" style="height:24px;width:24px;object-fit:contain;" />
                                    {{ cls.title }}
                                  </a-flex>
                                </a-menu-item>
                              </template>
                              <a-sub-menu v-else :key="cls.key">
                                <template #title>
                                  <a-flex align="center" justify="start" gap="8" style="display: inline-flex">
                                    <img :src="`img/chars/${cls.key}.webp`" alt="class" style="height:24px;width:24px;object-fit:contain;" />
                                    <span @click="newChar(cls.baseIndex)">{{ cls.title }}</span>
                                  </a-flex>
                                </template>
                                <a-menu-item v-for="b in buildsFor(cls)" :key="`${cls.key}-${b.index}`" @click="newChar(b.index)">{{ b.title }}</a-menu-item>
                              </a-sub-menu>
                            </template>
                          </a-menu>
                        </template>
                      </a-dropdown>
                    </div>

                    <div class="col-6 px-0">
                      <h5>Open save</h5>
                      <a-flex gap="8">
                        <select id="open-mod" v-model="$work_mod.value" name="open-mod" title="Workspace Mod" @change="changeMod()">
                          <option value="diablo2">Diablo2</option>
                          <option value="blizzless">Blizzless</option>
                          <option value="blizzless_beta">Blizzless Beta</option>
                        </select>
                        <select
                          id="work-version"
                          v-model="$work_version.value"
                          name="work-version"
                          title="Workspace Version"
                          @change="changeMod()">
                          <!-- <option v-if="$work_mod.value == 'diablo2'" value="96">LOD 1.10-1.14d</option> -->
                          <option v-if="$work_mod.value == 'diablo2'" value="97">D2R Alpha</option>
                          <!-- <option v-if="$work_mod.value == 'diablo2'" value="98">D2R 2.4</option> -->
                          <option value="99">D2R 2.5+</option>
                        </select>
                        <a-upload
                          name="d2sFile"
                          :multiple="false"
                          accept=".d2s,.d2i"
                          :before-upload="() => false"
                          :show-upload-list="false"
                          @change="onFileChange">
                          <button type="button" class="btn btn-primary">Open *.d2s, *.d2i save</button>
                        </a-upload>
                        <button type="button" class="btn btn-primary" @click="pasteBase64Save">Paste as base64</button>
                      </a-flex>
                    </div>
                  </a-flex>

                  <nav v-if="hasOpened" class="navbar navbar-expand-md mt-4">
                    <div class="w-100 d-flex justify-content-between align-items-center">
                      <a-flex align="center" class="col-6 px-0">
                        <template v-if="save && save.header && save.header.name">
                          <img v-if="classIconSrc" :src="classIconSrc" alt="class" style="height:24px;width:24px;object-fit:contain;" />
                          <a-flex vertical align="start" justify="center" class="ml-2" gap="0">
                            <strong class="text-lg">{{ save.header.name }}</strong>
                            <span class="text-sm">Level {{ save.header.level }}</span>
                          </a-flex>
                          <a-tag class="ml-3" :color="currentModeLabelColor">{{ currentModeLabel }}</a-tag>
                          <a-tag v-if="isClassic" class="ml-0" color="gold">Classic</a-tag>
                        </template>
                        <template v-else-if="stashData">
                          <img src="img/icons/stash.png" alt="stash" style="height:24px;width:24px;object-fit:contain;" />
                          <a-flex gap="2" align="center" justify="left" class="ml-2">
                            <a-tag color="gold">Pages: {{ stashData.pageCount }}</a-tag>
                            <a-tag color="gold">Items: {{ stashItemsCount }}</a-tag>
                          </a-flex>
                        </template>
                      </a-flex>
                      <a-flex v-if="save != null" justify="end" class="col-6 px-0">
                        <!-- <button type="button" id="d2" class="btn btn-primary" @click="saveFile('diablo2', 0x60)">Save D2</button> -->
                        <!-- <button type="button" id="d2" class="btn btn-primary" @click="saveFile('diablo2', 0x63)">Save D2R</button> -->
                        <button type="button" id="d2r" class="btn btn-primary" @click="saveFile($work_mod.value, $work_version.value)">Save</button>
                        <div v-if="$work_mod.value == 'blizzless_beta'">
                          <button type="button" id="d2r-blizz" class="btn btn-primary" @click="saveFile('blizzless', $work_version.value)">Save Blizzless</button>
                        </div>
                        <button type="button" class="btn btn-primary" @click="outputBase64Save">Output as base64</button>
                     
                      </a-flex>
                    </div>
                  </nav>

                  <div v-if="save != null && saveViewMod !== 'stash'">
                    <div class="row ml-0">
                      <button type="button" @click="unlockHell" class="btn btn-secondary text-sm">Unlock Hell</button>
                      <button type="button" @click="unlockAllWPs" class="btn btn-secondary text-sm">Unlock All WPs</button>
                      <button type="button" @click="setLvl99" class="btn btn-secondary text-sm">Set Level 99</button>
                      <button type="button" @click="setAllSkills20" class="btn btn-secondary text-sm">Set All Skills 20</button>
                      <button type="button" @click="unlockQs" class="btn btn-secondary text-sm">Complete Skill/Stat Qs</button>
                      <button type="button" @click="maxGold" class="btn btn-secondary text-sm">Max Gold</button>
                    </div>
                  </div>

                  <div v-if="save != null" class="mt-3">
                    <ul v-if="saveViewMod !== 'stash'" class="nav nav-tabs" id="tabs" >
                      <li class="nav-item">
                        <a class="nav-link active" id="items-tab" data-toggle="tab" data-target="#items-content"
                          role="tab" type="button">Equipment</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="saveViewMod !== 'stash'">
                        <a class="nav-link" id="stats-tab" data-toggle="tab" data-target="#stats-content" role="tab"
                          type="button">Character</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="saveViewMod !== 'stash'">
                        <a class="nav-link" id="skills-tab" data-toggle="tab" data-target="#skills-content" role="tab"
                          type="button">Skills</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="saveViewMod !== 'stash'">
                        <a class="nav-link" id="quests-tab" data-toggle="tab" data-target="#quests-content" role="tab"
                          type="button">Quests</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="saveViewMod !== 'stash'">
                        <a class="nav-link" id="waypoints-tab" data-toggle="tab" data-target="#waypoints-content"
                          role="tab" type="button">Waypoints</a>
                      </li>
                    </ul>
                    <div class="tab-content" id="tabs-content">
                      <div class="tab-pane show active" id="items-content" role="tabpanel">
                        <div class="row mt-3">
                          <div class="col-auto equipment-inventory-col">
                            <div class="mb-3">
                              <Equipped v-if="saveViewMod !== 'stash'" :items.sync="equipped" :isItemDimmed="isItemDimmed" :isItemHighlighted="isItemHighlighted" @item-hover="onItemHover" @item-selected="onSelect" @item-event="onEvent" @weapon-swap-changed="onWeaponSwapChanged"
                                :id="'Equipped'" :contextMenu="$refs.contextMenu" :gold="save?.attributes?.gold">
                              </Equipped>
                            </div>
                            <!-- <Grid v-if="activeTab == 1 || activeTab == 10" :width="grid.inv.w" :height="grid.inv.h" :page="1"
                              :items.sync="inventory" @item-selected="onSelect" @item-event="onEvent" :id="'InventoryGrid'" :contextMenu="$refs.contextMenu">
                            </Grid> -->
                            <Stash ref="stashRef" :items.sync="stashWithMeta" :mode="saveViewMod" :isItemDimmed="isItemDimmed" :isItemHighlighted="isItemHighlighted" @item-hover="onItemHover" @item-selected="onSelect" @item-event="onEvent" :id="'Stash'"
                              :contextMenu="$refs.contextMenu">
                            </Stash>
                            <Mercenary v-if="saveViewMod !== 'stash'" :items.sync="mercenary" :isItemDimmed="isItemDimmed" :isItemHighlighted="isItemHighlighted" @item-hover="onItemHover" @item-selected="onSelect" @item-event="onEvent" :id="'Mercenary'"
                              :contextMenu="$refs.contextMenu">
                            </Mercenary>
                            <div class="cube" v-if="saveViewMod !== 'stash'">
                              <Grid class="cube__grid" :width="grid.cube.w" :height="grid.cube.h" :page="8"
                                :items.sync="cube" :isItemDimmed="isItemDimmed" :isItemHighlighted="isItemHighlighted" @item-hover="onItemHover" @item-selected="onSelect" @item-event="onEvent" :id="'CubeGrid'"
                                :contextMenu="$refs.contextMenu">
                              </Grid>
                            </div>
                          </div>
                          <div class="col">
                            <div class="col">
                              <div class="row mb-2 justify-content-end">
                                <div class="col-12">
                                  <div class="item-search">
                                    <input
                                      class="form-control"
                                      type="text"
                                      v-model="itemSearchQuery"
                                      @keydown.esc.prevent="clearItemSearch"
                                      placeholder="Search items by name or modifiers..." />
                                    <button
                                      v-if="itemSearchQuery"
                                      type="button"
                                      class="btn btn-sm btn-secondary item-search__clear"
                                      @click="clearItemSearch">
                                      Clear
                                    </button>
                                  </div>

                                  <div v-if="itemSearchActive" class="item-search-results">
                                    <div v-if="!itemSearchResults.length" class="text-muted text-sm mt-2">
                                      No matches
                                    </div>
                                    <button
                                      v-for="(r, idx) in itemSearchResults"
                                      :key="idx"
                                      type="button"
                                      class="item-search-result"
                                      @click="selectItemSearchResult(r.item)">
                                      <img v-if="r.item && r.item.src" :src="r.item.src" class="item-search-result__img" alt="" />
                                      <div class="item-search-result__text">
                                        <div class="item-search-result__name">{{ r.title }}</div>
                                        <div v-if="r.location" class="item-search-result__meta text-muted text-sm">{{ r.location }}</div>
                                      </div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div class="row mb-3 justify-content-end">
                                <button type="button" class="btn btn-primary" :disabled="!clipboard"
                                  @click="paste()">Paste</button>
                                <button type="button" class="btn btn-primary" data-toggle="modal"
                                  data-target="#LoadItem">Load
                                  Item</button>
                              </div>
                            </div>
                            <ItemEditor v-if="selected" :id="'Selected'" :item.sync="selected" :location="location"
                              ref="editor" @item-event="onEvent"></ItemEditor>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane" id="stats-content" role="tabpanel" v-if="saveViewMod !== 'stash'">
                        <Stats v-if="save && save.header && save.attributes" v-bind:save.sync="save" :altDisplayed="equippedAltDisplayed" />
                      </div>
                      <div class="tab-pane" id="waypoints-content" role="tabpanel" v-if="saveViewMod !== 'stash'">
                        <Waypoints v-if="save && save.header && save.header.waypoints" v-bind:save.sync="save" />
                      </div>
                      <div class="tab-pane" id="quests-content" role="tabpanel" v-if="saveViewMod !== 'stash'">
                        <Quests v-if="save && save.header && save.header.quests_normal && save.header.quests_nm && save.header.quests_hell" v-bind:save.sync="save" />
                      </div>
                      <div class="tab-pane" id="skills-content" role="tabpanel" v-if="saveViewMod !== 'stash'">
                        <Skills v-if="save && save.skills && save.skills.length" v-bind:save.sync="save" />
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div id="errors">
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Item from './inventory/Item.vue';
  import ContextMenu from "./ContextMenu.vue";
  import Stats from './Stats.vue';
  import Waypoints from './Waypoints.vue';
  import Quests from './Quests.vue';
  import Skills from './Skills.vue';
  import Equipped from './inventory/Equipped.vue';
  import Grid from './inventory/Grid.vue';
  import Mercenary from './Mercenary.vue';
  import ItemEditor from './inventory/ItemEditor.vue';
  import Stash from './inventory/Stash.vue';

  import ItemPack from '../d2/ItemPack.js';
  import CharPack from '../d2/CharPack.js';
  import utils from '../utils.js';
  import {itemGroups as itemGroups} from '../items.js';
  import { message } from 'ant-design-vue';

  export default {
    components: {
      Item,
      Stats,
      Waypoints,
      Quests,
      Skills,
      Equipped,
      Stash,
      Grid,
      Mercenary,
      ItemEditor,
      ContextMenu
    },
    data() {
      return {
        save: null,
        stashData: null,
        saveViewMod: 'character',
        activeTab: 1,
        selected: null,
        itempack: ItemPack,
        previewModel: null,
        preview: null,
        baseModel: null,
        baseOptions: null,
        clipboard: null,
        itemSearchQuery: '',
        highlightedItem: null,
        load: null,
        grid: { inv: { w: 10, h: 4 }, cube: { w: 3, h: 4 } },
        location: {},
        theme: localStorage.getItem('theme'),
        equippedAltDisplayed: false,
        createNewMenu: [
          {
            key: 'amazon',
            title: 'Amazon',
            baseIndex: 0,
            builds: {
              diablo2: [
                { index: 1, title: 'Bowazon(Physical)' },
                { index: 2, title: 'Bowazon(Elemental)' },
                { index: 3, title: 'Bowazon(Mavina)' },
                { index: 4, title: 'Exploding Arrow' },
                { index: 5, title: 'Ligthing Fury' },
                { index: 6, title: 'Poison' },
                { index: 7, title: 'Spearzon' }
              ],
              blizzless_beta: [
                { index: 1, title: 'Poison' },
                { index: 2, title: 'Spearzon' },
                { index: 3, title: 'Cold' },
                { index: 4, title: 'Bowazon' },
                { index: 5, title: 'FemaleKnight' }
              ]
            }
          },
          {
            key: 'assassin',
            title: 'Assassin',
            baseIndex: 60,
            builds: {
              diablo2: [
                { index: 61, title: 'Phoenix' }
              ],
              blizzless_beta: [
                { index: 61, title: 'BladeSin' },
                { index: 62, title: 'FireTrapper' },
                { index: 63, title: 'Phoenix' },
                { index: 64, title: 'Trapper' },
                { index: 65, title: 'Kicker' },
                { index: 66, title: 'BladeFury' }
              ]
            }
          },
          {
            key: 'barbarian',
            title: 'Barbarian',
            baseIndex: 40,
            builds: {
              diablo2: [
                { index: 41, title: 'Whirlwind' },
                { index: 42, title: 'Double Throw' }
              ],
              blizzless_beta: [
                { index: 41, title: 'Whirlwind' },
                { index: 42, title: 'WC' },
                { index: 43, title: 'Thrower' },
                { index: 44, title: 'Berserk' }
              ]
            }
          },
          {
            key: 'druid',
            title: 'Druid',
            baseIndex: 50,
            builds: {
              diablo2: [
                { index: 51, title: 'Fire' }
              ],
              blizzless_beta: [
                { index: 51, title: 'Fire' },
                { index: 52, title: 'Shoсkwave' },
                { index: 53, title: 'Rabies' }
              ]
            }
          },
          {
            key: 'necromancer',
            title: 'Necromancer',
            baseIndex: 20,
            builds: {
              diablo2: [
                { index: 21, title: 'Poison' }
              ],
              blizzless_beta: [
                { index: 21, title: 'Poison' },
                { index: 22, title: 'Ultra' },
                { index: 23, title: 'Coroner' }
              ]
            }
          },
          {
            key: 'paladin',
            title: 'Paladin',
            baseIndex: 30,
            builds: {
              diablo2: [
                { index: 31, title: 'Hammerdin' },
                { index: 32, title: 'Fist of the Heavens' }
              ],
              blizzless_beta: [
                { index: 31, title: 'Hammerdin' },
                { index: 32, title: 'Auradin' }
              ]
            }
          },
          {
            key: 'sorceress',
            title: 'Sorceress',
            baseIndex: 10,
            builds: {
              diablo2: [
                { index: 11, title: 'Blizzard' },
                { index: 12, title: 'Blizzard(Mana)' },
                { index: 13, title: 'Fire' },
                { index: 14, title: 'Nova' },
                { index: 15, title: 'Enchant Bow' }
              ],
              blizzless_beta: [
                { index: 11, title: 'Enchantress' },
                { index: 12, title: 'Rogue' },
                { index: 13, title: 'Fire' },
                { index: 14, title: 'Nova' },
                { index: 15, title: 'Blizzard' }
              ]
            }
          }
        ]
      };
    },
    async mounted() {
      if (localStorage.grid) {
        this.grid = JSON.parse(localStorage.getItem('grid'));
      }
      this.changeMod();
    },
    filters: {
    },
    computed: {
      hasOpened() {
        return !!(this.save && this.save.header && this.save.header.name) || !!this.stashData;
      },
      stashItemsCount() {
        if (!this.stashData || !this.stashData.pages) return 0;
        return this.stashData.pages.reduce((acc, p) => acc + (p.items ? p.items.length : 0), 0);
      },
      isClassic() {
        // Classic если нет Expansion флага
        return !!(this.save && this.save.header && this.save.header.status && !this.save.header.status.expansion);
      },
      currentModeLabel() {
        if (!this.save || !this.save.header || !this.save.header.status) return '';
        const s = this.save.header.status;
        // SC/HC + Ladder
        const base = s.hardcore ? 'HC' : 'SC';
        return s.ladder ? `${base}L` : base;
      },
      currentModeLabelColor() {
        if (!this.save || !this.save.header || !this.save.header.status) return '';
        const s = this.save.header.status;
        return s.hardcore ? 'red' : 'blue';
      },
      isStashOnly() {
        return !!this.stashData && (!this.save || !this.save.header || !this.save.header.name);
      },
      stashSharedCount() {
        if (!this.stashData || !this.stashData.pages) return 0;
        return this.stashData.pageCount || this.stashData.pages.length || 0;
      },
      classIconSrc() {
        if (!this.save || !this.save.header || !this.save.header.class) return null;
        const name = (this.save.header.class || '').toLowerCase();
        // match filenames in public/img/chars
        return `img/chars/${name}.webp`;
      },
      equipped() {
        return this.save.items.filter(
          item => item.location_id === 1 || item.location_id === 0 && item.alt_position_id === 1
        )
      },
      inventory() {
        return this.save.items.filter(
          item => item.location_id === 0 && item.alt_position_id === 1,
        );
      },
      stash() {
        let stash = Object();
        stash.pages = [];
        stash.pages.push([]);
        stash.pages[0].items = [];
        stash.pages[0].items = this.save.items.filter(item => item.location_id === 0 && item.alt_position_id === 5);

        if (this.stashData != null && Array.isArray(this.stashData.pages)) {
          for (let i = 0; i < this.stashData.pages.length; i++) {
            stash.pages.push(this.stashData.pages[i]);
          }
        }
        return stash;
      },
      stashWithMeta() {
        const base = this.stash;
        const meta = {
          gold: this.save && this.save.attributes ? this.save.attributes.gold : null,
          stashedGold: this.save && this.save.attributes ? this.save.attributes.stashed_gold : null,
          sharedGold: this.stashData && this.stashData.sharedGold,
        };
        return { ...base, meta };
      },
      stashGrid() {
        return this.$work_mod.value === 'blizzless'
          ? { w: 16, h: 13 }
          : { w: 10, h: 10 };
      },
      cube() {
        return this.save.items.filter(
          item => item.location_id === 0 && item.alt_position_id === 4,
        );
      },
      mercenary() {
        return (this.save && this.save.merc_items) || [];
      },
      itemSearchActive() {
        return this.normalizeItemSearchQuery(this.itemSearchQuery).length > 0;
      },
      itemSearchAllItems() {
        const all = [];
        if (this.save && Array.isArray(this.save.items)) {
          all.push(...this.save.items);
        }
        if (this.save && Array.isArray(this.save.merc_items)) {
          all.push(...this.save.merc_items);
        }
        if (this.stashData && Array.isArray(this.stashData.pages)) {
          for (const p of this.stashData.pages) {
            if (p && Array.isArray(p.items)) {
              all.push(...p.items);
            }
          }
        }

        const uniq = [];
        const seen = new Set();
        for (const it of all) {
          if (!it) continue;
          if (seen.has(it)) continue;
          seen.add(it);
          uniq.push(it);
        }
        return uniq;
      },
      itemSearchMatches() {
        if (!this.itemSearchActive) return [];
        const q = this.normalizeItemSearchQuery(this.itemSearchQuery);
        if (!q) return [];

        const out = [];
        for (const item of this.itemSearchAllItems) {
          const text = this.itemSearchText(item);
          if (text && text.includes(q)) {
            out.push({
              item,
              title: this.itemSearchTitle(item),
              location: this.itemSearchLocation(item),
            });
          }
        }

        return out;
      },
      itemSearchResults() {
        // Keep the list snappy even for huge stashes.
        return this.itemSearchMatches.slice(0, 200);
      },
      itemSearchMatchedSet() {
        return new Set(this.itemSearchMatches.map(r => r.item));
      },
    },
    methods: {
      normalizeItemSearchQuery(q) {
        return (q || '')
          .toString()
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim();
      },
      stripD2Markup(s) {
        return (s || '')
          .toString()
          .replace(/\\(.*?);/gi, '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      },
      itemSearchTitle(item) {
        try {
          if (!item) return '';
          const constants = this.$getWorkConstantData();
          const personalizedName = item.personalized_name ? `${item.personalized_name}'s ` : '';

          if (item.runeword_id) {
            const rw = constants.runewords?.[item.runeword_id]?.n;
            return (rw ? `${personalizedName}${rw}` : (item.runeword_name || item.type_name || '')).trim();
          }
          if (item.unique_id) {
            const unq = constants.unq_items?.[item.unique_id]?.n;
            return (unq ? `${personalizedName}${unq}` : (item.type_name || '')).trim();
          }
          if (item.set_id) {
            const setName = constants.set_items?.[item.set_id]?.n;
            return (setName ? `${personalizedName}${setName}` : (item.type_name || '')).trim();
          }

          let name = item.type_name || '';
          if (item.rare_name_id) {
            const n = constants.rare_names?.[item.rare_name_id]?.n;
            if (n) name = `${n} ${name}`;
          }
          if (item.rare_name_id2) {
            const n2 = constants.rare_names?.[item.rare_name_id2]?.n;
            if (n2) name = `${name} ${n2}`;
          }
          if (item.magic_prefix) {
            const p = constants.magic_prefixes?.[item.magic_prefix]?.n;
            if (p) name = `${p} ${name}`;
          }
          if (item.magic_suffix) {
            const s = constants.magic_suffixes?.[item.magic_suffix]?.n;
            if (s) name = `${name} ${s}`;
          }
          if (item.personalized_name) {
            name = `${item.personalized_name}'s ${name}`;
          }
          return name.trim();
        } catch (_) {
          return (item && item.type_name) ? item.type_name : '';
        }
      },
      itemSearchLocation(item) {
        if (!item) return '';
        // A compact human label for the results list.
        if (this.save && Array.isArray(this.save.merc_items) && this.save.merc_items.includes(item)) {
          return 'Mercenary';
        }
        if (item.location_id === 1) {
          return 'Equipped';
        }
        if (item.location_id === 0) {
          if (item.alt_position_id === 1) return 'Inventory';
          if (item.alt_position_id === 4) return 'Cube';
          if (item.alt_position_id === 5) return 'Stash';
          return 'Stash';
        }
        if (item.location_id === 5) {
          return 'Stash';
        }
        return '';
      },
      itemSearchText(item) {
        if (!item) return '';
        const parts = [];
        parts.push(this.itemSearchTitle(item));
        if (item.type_name) parts.push(item.type_name);
        if (item.runeword_name) parts.push(item.runeword_name);

        const statDescs = [];
        if (Array.isArray(item.displayed_combined_magic_attributes)) {
          for (const st of item.displayed_combined_magic_attributes) {
            if (st && st.description) statDescs.push(st.description);
          }
        }
        if (Array.isArray(item.displayed_set_attributes)) {
          for (const group of item.displayed_set_attributes) {
            if (!Array.isArray(group)) continue;
            for (const st of group) {
              if (st && st.description) statDescs.push(st.description);
            }
          }
        }
        for (const d of statDescs) parts.push(this.stripD2Markup(d));

        return this.normalizeItemSearchQuery(parts.join(' '));
      },
      isItemDimmed(item) {
        if (!this.itemSearchActive) return false;
        return !this.itemSearchMatchedSet.has(item);
      },
      isItemHighlighted(item) {
        return !!this.highlightedItem && this.highlightedItem === item;
      },
      ensureItemDomId(item) {
        if (!item) return null;
        if (!item.__domId) {
          item.__domId = utils.uuidv4();
        }
        return item.__domId;
      },
      scrollItemIntoView(item) {
        const domId = this.ensureItemDomId(item);
        if (!domId) return;
        this.$nextTick(() => {
          const el = document.querySelector(`[data-item-id="${domId}"]`);
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          }
        });
      },
      clearItemSearch() {
        this.itemSearchQuery = '';
      },
      findStashPageIndexForItem(item) {
        try {
          const stash = this.stashWithMeta;
          const pages = stash && Array.isArray(stash.pages) ? stash.pages : [];
          for (let i = 0; i < pages.length; i++) {
            const p = pages[i];
            const items = p && Array.isArray(p.items) ? p.items : [];
            if (items.includes(item)) return i;
          }
        } catch (_) {}
        return null;
      },
      selectItemSearchResult(item) {
        // Keep the highlight until user hovers that item.
        this.highlightedItem = item;

        const stashPageIndex = this.findStashPageIndexForItem(item);
        if (stashPageIndex != null) {
          // page 0 => personal stash; page >= 1 => shared stash
          if (stashPageIndex >= 1) {
            this.saveViewMod = 'stash';
          } else {
            this.saveViewMod = 'character';
          }

          const tab = stashPageIndex >= 1 ? stashPageIndex : 1;
          this.$nextTick(() => {
            this.$refs.stashRef && this.$refs.stashRef.setActiveTab && this.$refs.stashRef.setActiveTab(tab);
            this.$nextTick(() => this.scrollItemIntoView(item));
          });
        } else {
          this.scrollItemIntoView(item);
        }

        this.clearItemSearch();
      },
      onItemHover(item) {
        if (this.highlightedItem && item === this.highlightedItem) {
          this.highlightedItem = null;
        }
      },
      buildsFor(cls) {
        const mod = this.$work_mod?.value;
        if (!cls || !cls.builds) return [];
        if (mod === 'diablo2') return cls.builds.diablo2 || [];
        if (mod === 'blizzless_beta') return cls.builds.blizzless_beta || [];
        return [];
      },
      async getPaletteData() {
        let a1PaletteBuffer;
        const colorMapBuffers = {};
        const a1PalettePath = utils.getA1PalettePath(this.$work_mod.value, this.$work_version.value);
        let response = await fetch(a1PalettePath);
        a1PaletteBuffer = new Uint8Array(await response.arrayBuffer());
        const colormapPaths = utils.getColormapPaths(this.$work_mod.value, this.$work_version.value);
        for (const [index, colorMapPath] of Object.entries(colormapPaths)) {
          response = await fetch(colorMapPath);
          colorMapBuffers[index] = new Uint8Array(await response.arrayBuffer());
        }
        utils.fillPalettes(this.$palettes.value, a1PaletteBuffer, colorMapBuffers);
      },
      // Uses globalProperties $work_mod & $work_version as input
      changeMod(failSafe = true) {
        let succeed = true;
        try {
          // Safety check
          this.$getWorkConstantData();
        } catch (e) {
          succeed = false;
          if (failSafe) {
            this.$work_mod.value = 'diablo2'; // Fallback
            this.$work_version.value = 99; // Fallback
          } else {
            return false;
          }
        }
        this.save = null;
        this.preview = null;
        this.stashData = null;
        this.saveViewMod = 'character';
        this.getPaletteData();
        this.addItemsToItemPack();
        // console.log('Changing mod to ' + this.$work_mod.value + this.$work_version.value);
        return succeed;
      },
      stash(i) {
        if (i == 0) {
          return this.save.items.filter(item => item.location_id === 0 && item.alt_position_id === 5,);
        } else {
          if (this.stashData == null) return [];
          return this.stashData.pages[i-1].items || [];
        }
      },
      rootClick() {
        this.$refs.contextMenu.close();
      },
      optionClicked(event) {
        switch (event.option.text) {
          case "Delete":
            this.onEvent({
              type: 'delete',
              item: event.obj
            });
            break;
          case "Copy":
            this.onEvent({
              type: 'copy',
              item: event.obj
            });
            break;
          case "Share":
            this.onEvent({
              type: 'share',
              item: event.obj
            });
            break;
          case "Paste At":
            if(event.obj?.length !== 2 || this.clipboard == null) {
              break;
            }
            this.onEvent({
              type: 'pasteAt',
              item: this.clipboard,
              grid: event.obj
            });
            break;
          case "Select":
            this.onSelect(event.obj);
            break;
        }
        this.$refs.contextMenu.close();
      },
      gridChange() {
        localStorage.setItem('grid', JSON.stringify(this.grid));
      },
      changeTab(i) {
        this.activeTab = i;
      },
      updateLocation(val) {
        this.location = {
          location: val.location_id,
          equipped_location: val.equipped_id,
          x: val.position_x,
          y: val.position_y,
          storage_page: val.alt_position_id
        }
      },
      onSelect(e) {
        this.selected = e;
        //console.log(e);
        //this.updateLocation(this.selected);
      },
      findIndex(list, i) {
        return list.findIndex(item =>
          item.type == i.type
          && item.location_id == i.location_id
          && item.equipped_id == i.equipped_id
          && item.position_x == i.position_x
          && item.position_y == i.position_y
          && item.alt_position_id == i.alt_position_id
        );
      },
      deleteItem(list, idx) {
        list.splice(idx, 1);
        this.selected = null;
        this.location = null;
      },
      async shareItem(item) {
        let bytes = await this.$d2s.writeItem(item, this.$work_mod.value, this.$work_version.value);
        let base64 = utils.arrayBufferToBase64(bytes);
        navigator.clipboard.writeText(base64);
        message.info(`Item data copied to clipboard. Use load from string to share it with someone.`);
      },
      onEvent(e) {
        if(e.type == 'share') {
          this.shareItem(e.item);
        } else if(e.type == 'copy') {
          this.clipboard = JSON.parse(JSON.stringify(e.item));
          navigator.clipboard.writeText(JSON.stringify(e.item));
          this.notifications.push({ alert: "alert alert-info", message: `Item data copied to clipboard.` });
        } else if(e.type == 'update') {
          this.$d2s.enhanceItems([e.item], this.$work_mod.value, this.$work_version.value);
          this.resolveInventoryImage(e.item);
        } else if(e.type == 'delete') {
          let idx = this.findIndex(this.save.items, e.item);
          if(idx != -1) {
            this.deleteItem(this.save.items, idx);
            return;
          }
          idx = this.findIndex(this.save.merc_items, e.item);
          if(idx != -1) {
            this.deleteItem(this.save.merc_items, idx);
            return;
          }
        } else if (e.type == 'move') {
          let element = document.getElementById(e.id);
          element.style.backgroundColor = ""; element.style.width = ""; element.style.height = "";
          //if (this.$uuid == e.uuid) 
          {
            let idx = this.findIndex(this.save.items, e.item);
            this.onMove(this.save.items[idx], e);
          // } else {
          //   //copy to another tab
          //   if (this.onMove(e.item, e)) {
          //     this.save.items.push(e.item);
          //   }
          }
        } else if (e.type == 'dragenter') {
          //console.log(e);
          let item = e.item;
          if (this.canPlaceItem(item, e.location.storage_page, e.location.x, e.location.y)) {
            let element = document.getElementById(e.id);
            element.style.backgroundColor = "green"; element.style.width = `calc(var(--grid-size) * ${item.inv_width})`; element.style.height = `calc(var(--grid-size) * ${item.inv_height})`;
          }
        } else if (e.type == 'dragleave') {
          let element = document.getElementById(e.id);
          element.style.backgroundColor = ""; element.style.width = ""; element.style.height = "";
        } else if (e.type === "pasteAt") {
          const location_id = this.activeTab === 1 ? 1 : 0; // Equipped
          const storage_page = this.activeTab === 1 ? 1 :  // Equipped
              this.activeTab === 3 ? 5 : // Stash
              this.activeTab === 8 ? 8 : // Cube
                  1; // Inventory
          if (this.canPlaceItem(e.item, storage_page, e.grid[0], e.grid[1])) {
            this.paste(e.item, [location_id, this.location?.equipped_location, e.grid[0], e.grid[1], storage_page]);
          } else {
            this.paste(e.item);
          }
        }
      },
      onMove(item, e) {
        if(!this.canPlaceItem(item, e.location.storage_page, e.location.x, e.location.y)) {
          return false;
        }
        if (e.location.location == 1) {
          item.location_id = e.location.location;
          item.equipped_id = e.location.equipped_location;
          item.position_x = 0;
          item.position_y = 0;
          item.alt_position_id = 0;
        } else if (e.location.location == 0) {
          item.location_id = e.location.location;
          item.equipped_id = 0;
          item.position_x = e.location.x;
          item.position_y = e.location.y;
          item.alt_position_id = e.location.storage_page;
        } else if (e.location.location == 4) {
          item.location_id = e.location.location;
          item.equipped_id = 0;
          item.position_x = 4; //why?
          item.position_y = 0;
          item.alt_position_id = 0;
        }
        else if (e.location.location == 5) {
          item.location_id = e.location.location;
          item.equipped_id = e.location.equipped_location;
          item.position_x =  e.location.x;
          item.position_y = e.location.y;
          item.alt_position_id = 0;
        }
        return true;
      },
      async setBase(e) {
        if (this.baseModel) {
          this.preview.type = this.baseModel;
          await this.$d2s.enhanceItems([this.preview], this.$work_mod.value, this.$work_version.value);
          await this.resolveInventoryImage(this.preview);
        }
      },
      async setPreviewItem() {
        this.baseOptions = null;
        this.baseModel = null;
        this.preview = null;
        if (this.previewModel) {
          if (this.previewModel.base64) {
            let bytes = utils.b64ToArrayBuffer(this.previewModel.base64);
            this.preview = await this.$d2s.readItem(bytes, "diablo2", 0x63);
          } else if (this.previewModel.item) {
            this.preview = this.previewModel.item;
            if (this.preview.given_runeword) {
              this.baseOptions = this.getBasesOptions(this.preview);
              return;
            }
          }
          await this.resolveInventoryImage(this.preview);
        }
      },
      async loadD2iItem(event) {
        this.previewModel = {
          base64: utils.arrayBufferToBase64(event.target.result),
          mod: "diablo2",
          version: 0x61,
        };
        this.setPreviewItem();
      },
      onItemFileChange(event) {
        let reader = new FileReader();
        reader.onload = this.loadD2iItem;
        reader.readAsArrayBuffer(event.target.files[0]);
        event.target.value = null;
      },
      async loadBase64Item() {
        try {
          let b64 = prompt("Please enter your base64 string for item.");
          if (b64) {
            this.previewModel = {
              base64: b64,
            };
            this.setPreviewItem();
          }
        } catch(e) {
          message.error("Failed to read item.");
        }
      },
      loadItem() {
        if (this.preview && this.preview.type) {
          this.paste(this.preview);
        }  
      },
      paste(item, position) {
        let copy = JSON.parse(JSON.stringify(item != null ? item : this.clipboard));
        let pos = position ?? this.findSafeLocation(copy);
        copy.location_id = pos[0];
        copy.equipped_id = pos[1];
        copy.position_x = pos[2];
        copy.position_y = pos[3];
        copy.alt_position_id = pos[4];
        if (copy.location_id == 4) {
          message.warning(`Could not find safe location to place item. Placed in mouse buffer.`);
        } else {
          let loc = copy.alt_position_id == 1 ? 'inventory' : (copy.alt_position_id == 5 ? 'stash' : 'cube');
          message.info(`Loaded item in ${loc} at ${copy.position_x}, ${copy.position_y}`);
        }
        this.save.items.push(copy);
        this.selected = copy;
        this.updateLocation(this.selected);
      },
      findSafeLocation(item) {
        //inv = 1, cube = 4, stash = 5
        for (var i = 0; i < this.grid.inv.w; i++) {
          for (var j = 0; j < this.grid.inv.h; j++) {
            if (this.canPlaceItem(item, 1, i, j)) {
              return [0, 0, i, j, 1];
            }
          }
        }
        for (var i = 0; i < this.stashGrid.w; i++) {
          for (var j = 0; j < this.stashGrid.h; j++) {
            if (this.canPlaceItem(item, 5, i, j)) {
              return [0, 0, i, j, 5];
            }
          }
        }
        for (var i = 0; i < this.grid.cube.w; i++) {
          for (var j = 0; j < this.grid.cube.h; j++) {
            if (this.canPlaceItem(item, 4, i, j)) {
              return [0, 0, i, j, 4];
            }
          }
        }
        return [4, 0, 4, 0, 0];
      },
      canPlaceItem(item, loc, x, y) {
        var bounds;
        if (loc == 4) {
          bounds = this.grid.cube;
        } else if (loc == 5) {
          bounds = this.stashGrid;
        } else {
          bounds = this.grid.inv;
        }
        if ((x + item.inv_width) > bounds.w) {
          return false;
        }
        if ((y + item.inv_height) > bounds.h) {
          return false;
        }
        var rect = [x, y, x + item.inv_width, y + item.inv_height];
        let closeItems = this.save.items.filter(
          item => item.location_id === 0 && item.alt_position_id === loc,
        );
        for (var closeItem of closeItems) {
          var r = [closeItem.position_x, closeItem.position_y, closeItem.position_x + closeItem.inv_width, closeItem.position_y + closeItem.inv_height];
          if (this.contains(rect, r) || this.overlaps(rect, r)) {
            return false;
          }
        }
        return true;
      },
      contains(a, b) {
        return !(
          b[0] < a[0] ||
          b[1] < a[1] ||
          b[2] > a[2] ||
          b[3] > a[3]
        );
      },
      overlaps(a, b) {
        if (a[0] >= b[2] || b[0] >= a[2]) return false;
        if (a[1] >= b[3] || b[1] >= a[3]) return false;
        return true;
      },
      async resolveInventoryImages() {
        const allItems = [...(this.save.items || []), ...(this.save.merc_items || []), ...(this.save.corpse_items || []), this.save.golem_item].filter(Boolean);
        const promises = allItems.map(async function (item) {
          return this.resolveInventoryImage(item);
        }, this);
        return Promise.all(promises);
      },
      async resolveInventoryImage(item) {
        if (!item) {
          return;
        }
        item.src = await utils.getInventoryImage(item, this.$work_mod.value, this.$work_version.value, this.$palettes.value);
        if (!item.socketed_items) {
          return;
        }
        for (let i = 0; i < item.socketed_items.length; i++) {
          utils.getInventoryImage(item.socketed_items[i], this.$work_mod.value, this.$work_version.value, this.$palettes.value)
            .then((img) => {
              if (img && item.socketed_items[i]) {
                // Recheck cause it's async, and user may have used unsocket all button in the meanwhile
                item.socketed_items[i].src = img;
                //item.socketed_items[i].magic_attributes.forEach((it, idx) => { if (item.socketed_attributes.findIndex(x => x.id == it.id) == -1) item.socketed_attributes.push(it) });
              }
            })
        }
      },
      addItemsToItemPack() {
        const constants = this.$getWorkConstantData();
        // Regenerate item pack
        this.itempack = [];
        this.itempack.push(...ItemPack);
        this.addRunewordToItemPack(constants.runewords, "Runewords");
        this.addUniqToItemPack(constants.unq_items, "Uniques");
        this.addSetToItemPack(constants.set_items, "Sets");
        this.addBasesToItemPack(constants.armor_items, "Armor");
        this.addBasesToItemPack(constants.weapon_items, "Weapons");
        this.addOtherToItemPack(constants.other_items, "Misc");
        //this.resolveInventoryImages();  
      },     
      newChar(index) {
        let bytes = [];
        if (this.$work_mod.value == 'diablo2') {
          bytes = utils.b64ToArrayBuffer(CharPack.diablo2[index]);
        } else if (this.$work_mod.value == 'blizzless') {
          bytes = utils.b64ToArrayBuffer(CharPack.blizzless[index]);
        } else if (this.$work_mod.value == 'blizzless_beta') {
          bytes = utils.b64ToArrayBuffer(CharPack.blizzless_beta[index]);
        }
        this.readBuffer(bytes);
      },
      onFileLoad(event) {
        this.readBuffer(event.target.result, event.target.filename);
      },
      readBuffer(bytes, filename) {
        const byteLen = bytes && (bytes.byteLength ?? bytes.length ?? 0);
        if (filename) {
          const lower = filename.toLowerCase();
          if (lower.endsWith(".d2s")) {
            this.save = null;
            this.$d2s.read(bytes, this.$work_mod.value)
            .then(response => {
              this.save = response;
              this.save.header.name = filename.split('.')[0];
              this.saveViewMod = 'character';
              this.resolveInventoryImages();
            })
          } else if (lower.endsWith(".d2i")) {
            this.stashData = null;
            this.$d2s.readStash(bytes, this.$work_mod.value)
            .then(response => {
              if (!this.save) {
                // Ensure UI renders stash even without a loaded character
                this.save = { items: [], merc_items: [], corpse_items: [], golem_item: null, header: {} };
              }
              this.stashData = response;
              this.saveViewMod = 'stash';
              const pages = this.stashData?.pages || [];
              for (var i = 0; i < this.stashData.pageCount; i++) {
                [... this.stashData.pages[i].items].forEach(item => { this.resolveInventoryImage(item)})
              }
            })
          }
        } else {
          let that = this;
          this.save = null;
          this.selected = null;
          this.stashData = null;
          this.$d2s.read(bytes, this.$work_mod.value)
          .then(response => {
            that.save = response;
            that.saveViewMod = 'character';
            that.resolveInventoryImages();
          });
        }
        
      },
      saveFileStash() {
        if (this.stashData != null) {
          let link = document.createElement('a');
          link.style.display = 'none';
          document.body.appendChild(link);
          this.$d2s.writeStash(this.stashData, this.$work_mod.value, this.$work_version.value).then(function (response) {
            let blob = new Blob([response], { type: "octet/stream" });
            link.href = window.URL.createObjectURL(blob);
            link.download = 'SharedStashSoftCoreV2.d2i';
            link.click();
            link.remove();
          });
        }
      },
      onFileChange({ file }) {
        if (!file) return;
        this.save = null;
        this.stashData = null;
        this.selected = null;
        const reader = new FileReader();
        reader.onload = (e) => {
          const buf = e.target.result;
          this.readBuffer(buf, file.name);
        };
        reader.onerror = () => {
          if (this.$message) {
            this.$message.error('Failed to read file');
          }
        };
        reader.readAsArrayBuffer(file);
      },
      async pasteBase64Save() {
        try {
          const text = await navigator.clipboard.readText();
          if (!text) {
            message.error('Clipboard is empty.');
            return;
          }
          const idx = text.indexOf(',');
          const b64 = (idx !== -1 ? text.substring(idx + 1) : text).trim();
          const bytes = utils.b64ToArrayBuffer(b64);
          this.save = null;
          this.stashData = null;
          this.selected = null;
          try {
            const response = await this.$d2s.read(bytes, this.$work_mod.value);
            this.save = response;
            this.saveViewMod = 'character';
            await this.resolveInventoryImages();
            message.info('Save loaded from clipboard.');
          } catch (e1) {
            const stash = await this.$d2s.readStash(bytes, this.$work_mod.value);
            if (!this.save) {
              this.save = { items: [], merc_items: [], corpse_items: [], golem_item: null, header: {} };
            }
            this.stashData = stash;
            this.saveViewMod = 'stash';
            for (let i = 0; i < this.stashData.pageCount; i++) {
              [...this.stashData.pages[i].items].forEach(item => { this.resolveInventoryImage(item); });
            }
            message.info('Stash loaded from clipboard.');
          }
        } catch (e) {
          console.error(e);
          message.error('Failed to load from clipboard. Ensure it is a valid base64 save.');
        }
      },
      maxGold() {
        this.save.attributes.gold = this.save.header.level * 10000;
        this.save.attributes.stashed_gold = 2500000
      },
      unlockQs() {
        const self = this;
        function update(difficulty, act, quest, attributes, amount) {
          if (self.save.header[difficulty][act][quest].is_completed === false) {
            if (quest === "prison_of_ice") {
              self.save.header[difficulty][act][quest].consumed_scroll = true;
            }
            self.save.header[difficulty][act][quest].is_completed = true;
            for(let attribute of attributes) {
              self.save.attributes[attribute] = (self.save.attributes[attribute] ?? 0) + amount;
            }
          }
        }
        for (const diff of ["quests_normal", "quests_nm", "quests_hell"]) {
          update(diff, "act_i", "den_of_evil", ["unused_skill_points"], 1);
          update(diff, "act_ii", "radaments_lair", ["unused_skill_points"], 1);
          update(diff, "act_iii", "lam_esens_tome", ["unused_stats"], 5);
          update(diff, "act_iii", "the_golden_bird", ["max_hp", "current_hp"], 20);
          update(diff, "act_iv", "the_fallen_angel", ["unused_skill_points"], 2);
          update(diff, "act_v", "rescue_on_mount_arreat", [], null);
          update(diff, "act_v", "prison_of_ice", [], null);
        }
      },
      unlockHell() {
        for (var i of ["quests_normal", "quests_nm", "quests_hell"]) {
          for (var j of ["act_i", "act_ii", "act_iii", "act_iv", "act_v"]) {
            this.save.header[i][j].introduced = true;
            this.save.header[i][j].completed = true;
          }
          this.save.header[i].act_i.sisters_to_the_slaughter.is_completed = true;
          this.save.header[i].act_ii.the_summoner.is_completed = true;
          this.save.header[i].act_ii.tainted_sun.is_completed = true;
          this.save.header[i].act_ii.the_horadric_staff.is_completed = true;
          this.save.header[i].act_ii.arcane_sanctuary.is_completed = true;
          this.save.header[i].act_ii.the_seven_tombs.is_completed = true;
          this.save.header[i].act_iii.khalims_will.is_completed = true;
          this.save.header[i].act_iii.the_blackened_temple.is_completed = true;
          this.save.header[i].act_iii.the_guardian.is_completed = true;
          this.save.header[i].act_iv.terrors_end.is_completed = true;
          this.save.header[i].act_v.rite_of_passage.is_completed = true;
          this.save.header[i].act_v.eve_of_destruction.is_completed = true;
        }
        for (var i of ["normal", "nm", "hell"]) {
          this.save.header.waypoints[i].act_i.rogue_encampement = true;
          this.save.header.waypoints[i].act_ii.lut_gholein = true;
          this.save.header.waypoints[i].act_iii.kurast_docks = true;
          this.save.header.waypoints[i].act_iv.the_pandemonium_fortress = true;
          this.save.header.waypoints[i].act_v.harrogath = true;
        }
        this.save.header.progression = 15;
      },
      unlockAllWPs() {
        for (var i of ["normal", "nm", "hell"]) {
          for (var a in this.save.header.waypoints[i]) {
            for (var w in this.save.header.waypoints[i][a]) {
              this.save.header.waypoints[i][a][w] = true;
            }
          }
        }
      },
      setLvl99() {
        this.save.header.level = 99;
      },
      setAllSkills20() {
        for (var s of this.save.skills) {
          s.points = 20;
        }
      },
      saveFile(mod, version) {
        this.save.header.version = version;
        let link = document.createElement('a');
        let that = this;
        link.style.display = 'none';
        document.body.appendChild(link);
        this.$d2s.write(this.save, mod, version)
        .then(function (response) {
          let blob = new Blob([response], { type: "octet/stream" });
          link.href = window.URL.createObjectURL(blob);
          const fileName = (that.save && that.save.header && that.save.header.name) ? that.save.header.name : 'character';
          link.download = fileName + '.d2s';
          link.click();
          link.remove();
        });
      },
      async outputBase64Save() {
        try {
          if (this.saveViewMod === 'stash' && this.stashData != null) {
            const buf = await this.$d2s.writeStash(this.stashData, this.$work_mod.value, this.$work_version.value);
            const b64 = utils.arrayBufferToBase64(buf);
            await navigator.clipboard.writeText(b64);
            message.success('Stash base64 copied to clipboard.');
            return;
          }
          if (!this.save) {
            message.error('Nothing to export. Load or create a save first.');
            return;
          }
          const buf = await this.$d2s.write(this.save, this.$work_mod.value, this.$work_version.value);
          const b64 = utils.arrayBufferToBase64(buf);
          await navigator.clipboard.writeText(b64);
          message.success('Save base64 copied to clipboard.');
        } catch (e) {
          console.error(e);
          message.error('Failed to export base64.');
        }
      },
      async addBasesToItemPack(constants, category) {
        let newItems = [];
        for (const item of Object.entries(constants)) {
          const value = item[1];
          newItems.push({
            //code
            type: item[0],
            quality: 2,
            level: value.lvl,
            inv_width: value.iw,
            inv_height: value.ih,
            categories: value.c,
            ethereal: 0,
            identified: 1
          });
        }
        this.$d2s.enhanceItems(newItems, this.$work_mod.value, this.$work_version.value);
        for (const item of newItems) {
          //let bytes = await d2s.writeItem(item, 0x63, window.constants);
          //let base64 = utils.arrayBufferToBase64(bytes);
          this.itempack.push({
            key: `[Bases]/${category}/${item.categories[0]}/${item.type_name}`,
            value: {item: item
              //base64: base64
            }
          });
        }
      },
      async addRunewordToItemPack(constants, category) {
        let newItems = [];
        for (const item of constants.filter(i => i !== null)) {
          let socketedItems = [];
          for (const r of item.r) {
            socketedItems.push({type: r, simple_item: 1, identified: 1, location_id: 6})
          }
          newItems.push({
            runeword_id: item.id,
            runeword_name: item.n,
            given_runeword: 1,
            quality: 3,
            level: 90, //todo
            ethereal: 0,
            socketed: 1,
            identified: 1,
            types: item.types,
            total_nr_of_sockets: socketedItems.length,
            nr_of_items_in_sockets: socketedItems.length,
            simple_item: 0,
            socketed_items: socketedItems,
            runeword_attributes: this.$d2s.generateFixedMods(item.m, this.$getWorkConstantData()),
          });
        }
        this.$d2s.enhanceItems(newItems, this.$work_mod.value, this.$work_version.value);
        for (const item of newItems) {
          this.itempack.push({
            key: `[${category}]/${item.runeword_name}`,
            value: {item: item}
          });
        }
      },
      async addSetToItemPack(constants, category) {
        let newItems = [];
        for (const item of constants) {
          if (item.c) {
            let set_attributes = [];
            for (let i = 0; i < item.ms?.length; i++) {
              if (set_attributes) {
                set_attributes.push(this.$d2s.generateFixedMods([item.ms[i]], this.$getWorkConstantData()));
              }
              else {
                set_attributes = [this.$d2s.generateFixedMods([item.ms[i]], this.$getWorkConstantData())]
              }
            }
            newItems.push({
              //code
              type: item.c,
              level: item.lvl,
              inv_file: item.i,
              quality: 5,
              set_id: item.id,
              set_name: item.n,
              ethereal: 0,
              identified: 1,
              set_attributes: set_attributes,
              magic_attributes: this.$d2s.generateFixedMods(item.m, this.$getWorkConstantData())
            });
          }
        }
        this.$d2s.enhanceItems(newItems, this.$work_mod.value, this.$work_version.value);
        for (const item of newItems) {
          let socketIndex = item.magic_attributes.findIndex(i => i.name == "item_numsockets");
          if (socketIndex > 0) {
            item.socketed =  true;
            item.total_nr_of_sockets = item.magic_attributes[socketIndex].value;
            item.magic_attributes.splice(socketIndex, 1);
          }
          this.itempack.push({
            key: `[${category}]/${item.set_name}`,
            value: {item: item}
          });
        }
      },
      async addUniqToItemPack(constants, category) {
        let newItems = [];
        for (const item of constants) {
          if (item.c) {
            newItems.push({
              //code
              type: item.c,
              level: item.lvl,
              inv_file: item.i,
              quality: 7,
              unique_id: item.id,
              unique_name: item.n,
              ethereal: 0,
              identified: 1,
              magic_attributes: this.$d2s.generateFixedMods(item.m, this.$getWorkConstantData())
            });
          }
        }
        this.$d2s.enhanceItems(newItems, this.$work_mod.value, this.$work_version.value);
        for (const item of newItems) {
          let socketIndex = item.magic_attributes.findIndex(i => i.name == "item_numsockets");
          if (socketIndex > 0) {
            item.socketed =  true;
            item.total_nr_of_sockets = item.magic_attributes[socketIndex].param;
            item.magic_attributes.splice(socketIndex, 1);
          }
          this.itempack.push({
            key: `[${category}]/${item.unique_name}`,
            value: {item: item}
          });
        }
      },
      async addOtherToItemPack(constants, category) {
        let newItems = [];
        for (const item of Object.entries(constants)) {
          const value = item[1];
          newItems.push({
            //code
            type: item[0],
            level: 13,
            quality: 2,
            //simple_item: 1,
            categories: value.c,
            ethereal: 0,
            identified: 1
          });
        }
        this.$d2s.enhanceItems(newItems, this.$work_mod.value, this.$work_version.value);
        for (const item of newItems) {
          this.itempack.push({
            key: `[${category}]/${item.categories[0]}/${item.type_name}`,
            value: {item: item}
          });
        }
      },
      getBasesOptions(item) {
        let bases = [];
        const constants = {...this.$getWorkConstantData().armor_items, ...this.$getWorkConstantData().weapon_items};
        bases = this.findBasesInConstants(item, constants);
        return Object.entries(constants)
            .filter((entry) => bases.includes(entry[0]))
            .map((entry) => ({ value: entry[0], label: entry[1].n }));;
      },
      findBasesInConstants(item, constants) {
        let bases = [];
        bases = Object.keys(constants).filter(id => {
          const c = constants[id];
          if (item.given_runeword == 1 && c.gemsockets < item.total_nr_of_sockets) return false;
          return c.spawnable && [...itemGroups[item.types[0]] || [],
                                ...itemGroups[item.types[1]] || [],
                                ...itemGroups[item.types[2]] || []]
                                .includes(c.type)
        }).sort((a, b) => constants[a].level < constants[b].level);
        return bases;
      },
    },
    onWeaponSwapChanged(isAlt) {
      try {
        if (!this.save || !Array.isArray(this.save.items)) return;
        for (const item of this.save.items) {
          if (item && item.location_id === 1 && (item.equipped_id === 4 || item.equipped_id === 5 || item.equipped_id === 11 || item.equipped_id === 12)) {
            // nothing to change on item; Stats.vue will read active swap flag from localStorage
          }
        }
        this.equippedAltDisplayed = !!isAlt;
        localStorage.setItem('equippedAltDisplayed', isAlt ? '1' : '0');
      } catch (_) {}
    },
  };
</script>

<style>
.dark-theme {
  background-color: #141414;
  color: #e8e8e8;
}
.dark-theme .card.bg-light {
  background-color: #1f1f1f;
}
.dark-theme .alert.alert-primary {
  background-color: #2a2a2a;
  border-color: #3a3a3a;
  color: #e6f7ff;
}
.dark-theme .modal-content {
  background-color: #1f1f1f;
  color: #e8e8e8;
}
.dark-theme .nav-tabs .nav-link {
  color: #bfbfbf;
}
.dark-theme .nav-tabs .nav-link.active {
  color: #fff;
  background-color: #262626;
  border-color: #434343 #434343 #262626;
}
/* Force left alignment for all inputs */
.ant-input,
.ant-input-number-input {
  text-align: left;
}

.item-search {
  display: flex;
  gap: 8px;
  align-items: center;
}

.item-search__clear {
  white-space: nowrap;
}

.item-search-results {
  margin-top: 8px;
  max-height: 260px;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
}

.item-search-result {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
}

.item-search-result:hover {
  background: rgba(255, 255, 255, 0.06);
}

.item-search-result__img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex: 0 0 auto;
}

.item-search-result__name {
  line-height: 1.1;
}
</style>
