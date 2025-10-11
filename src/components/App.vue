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
              @update:model-value="setPreviewItem" />
            <div v-if="baseOptions">
              <label>Base</label>
              <multiselect v-model="baseModel" :options="baseOptions" label="label" valueProp="value" :searchable="true"
                @update:model-value="setBase" />
            </div>
          </div>
          <div class="modal-footer">
            <input style="display:none;" type="file" name="d2iFile" @change="onItemFileChange" id="d2iFile">
            <label for="d2iFile" class="mb-0 btn btn-primary">Load From File</label>
            <button type="button" class="btn btn-primary" @click="loadBase64Item">Load From String</button>
            <button type="button" class="btn btn-primary" @click="loadItem">Load</button>
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
                  <div class="form-group">
                    <div class="input-group">
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
                        @change="changeMod()"
                      >
                        <!-- <option v-if="$work_mod.value == 'diablo2'" value="96">LOD 1.10-1.14d</option> -->
                        <!-- <option v-if="$work_mod.value == 'diablo2'" value="97">D2R Alpha</option> -->
                        <!-- <option v-if="$work_mod.value == 'diablo2'" value="98">D2R 2.4</option> -->
                        
                        <!-- <option v-if="$work_mod.value == 'blizzless'" value="98">Beta</option> -->
                        <option value="99">D2R 2.5+</option>
                      </select>
                      <div class="custom-file">
                        <input type="file" name="d2sFile" class="custom-file-input" multiple @change="onFileChange"
                          id="d2sFile" accept=".d2s,.d2i">
                        <label class="custom-file-label load-save-label" for="d2sFile">*.d2s,*.d2i</label>
                      </div>
                      <!-- <div>
                       <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">Create New</button>
                        <div class="dropdown-menu dropdown-menu-right">
                          <button class="dropdown-item" type="button" @click="newChar(0)">Amazon</button>
                          <button class="dropdown-item" type="button" @click="newChar(1)">Sorceress</button>
                          <button class="dropdown-item" type="button" @click="newChar(2)">Necromancer</button>
                          <button class="dropdown-item" type="button" @click="newChar(3)">Paladin</button>
                          <button class="dropdown-item" type="button" @click="newChar(4)">Barbarian</button>
                          <button class="dropdown-item" type="button" @click="newChar(5)">Druid</button>
                          <button class="dropdown-item" type="button" @click="newChar(6)">Assassin</button>
                        </div>
                      </div>
                      <div class="input-group-append"><span>&nbsp;</span></div> -->
                    </div>
                  </div>

                  <nav class="navbar navbar-expand-md navbar-light">
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                          <a class="nav-link" href="#">Create new</a>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="navbarGeneral" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Amazon
                          </a>
                          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarGeneral">
                            <a class="dropdown-item" href="#" @click="newChar(0)">Amazon</a>
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header">Builds</h6>
                            <div v-if="$work_mod.value == 'diablo2'">
                              <a class="dropdown-item" href="#" @click="newChar(1)">Bowazon(Physical)</a>
                              <a class="dropdown-item" href="#" @click="newChar(2)">Bowazon(Elemental)</a>
                              <a class="dropdown-item" href="#" @click="newChar(3)">Bowazon(Mavina)</a>
                              <a class="dropdown-item" href="#" @click="newChar(4)">Exploding Arrow</a>
                              <a class="dropdown-item" href="#" @click="newChar(5)">Ligthing Fury</a>
                              <a class="dropdown-item" href="#" @click="newChar(6)">Poison</a>
                              <a class="dropdown-item" href="#" @click="newChar(7)">Spearzon</a>
                            </div>
                            <div v-if="$work_mod.value == 'blizzless_beta'">
                              <a class="dropdown-item" href="#" @click="newChar(1)">Poison</a>
                              <a class="dropdown-item" href="#" @click="newChar(2)">Spearzon</a>
                              <a class="dropdown-item" href="#" @click="newChar(3)">Cold</a>
                              <a class="dropdown-item" href="#" @click="newChar(4)">Bowazon</a>
                              <a class="dropdown-item" href="#" @click="newChar(5)">FemaleKnight</a>
                            </div>
                          </div>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="navbarGeneral" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Assassin
                          </a>
                          <div class="dropdown-menu" aria-labelledby="navbarGeneral">
                            <a class="dropdown-item" href="#" @click="newChar(60)">Assassin</a>
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header">Builds</h6>
                            <div v-if="$work_mod.value == 'diablo2'">
                              <a class="dropdown-item" href="#" @click="newChar(61)">Phoenix</a>
                            </div>
                            <div v-if="$work_mod.value == 'blizzless_beta'">
                              <a class="dropdown-item" href="#" @click="newChar(61)">BladeSin</a>
                              <a class="dropdown-item" href="#" @click="newChar(62)">FireTrapper</a>
                              <a class="dropdown-item" href="#" @click="newChar(63)">Phoenix</a>
                              <a class="dropdown-item" href="#" @click="newChar(64)">Trapper</a>
                              <a class="dropdown-item" href="#" @click="newChar(65)">Kicker</a>
                              <a class="dropdown-item" href="#" @click="newChar(66)">BladeFury</a>
                            </div>
                          </div>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="navbarGeneral" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Barbarian
                          </a>
                          <div class="dropdown-menu" aria-labelledby="navbarGeneral">
                            <a class="dropdown-item" href="#" @click="newChar(40)">Barbarian</a>
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header">Builds</h6>
                            <div v-if="$work_mod.value == 'diablo2'">
                              <a class="dropdown-item" href="#" @click="newChar(41)">Whirlwind</a>
                              <a class="dropdown-item" href="#" @click="newChar(42)">Double Throw</a>
                            </div>
                            <div v-if="$work_mod.value == 'blizzless_beta'">
                              <a class="dropdown-item" href="#" @click="newChar(41)">Whirlwind</a>
                              <a class="dropdown-item" href="#" @click="newChar(42)">WC</a>
                              <a class="dropdown-item" href="#" @click="newChar(43)">Thrower</a>
                              <a class="dropdown-item" href="#" @click="newChar(44)">Berserk</a>
                            </div>
                          </div>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="navbarGeneral" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Druid
                          </a>
                          <div class="dropdown-menu" aria-labelledby="navbarGeneral">
                            <a class="dropdown-item" href="#" @click="newChar(50)">Druid</a>
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header">Builds</h6>
                            <div v-if="$work_mod.value == 'diablo2'">
                              <a class="dropdown-item" href="#" @click="newChar(51)">Fire</a>
                            </div>
                            <div v-if="$work_mod.value == 'blizzless_beta'">
                               <a class="dropdown-item" href="#" @click="newChar(51)">Fire</a>
                               <a class="dropdown-item" href="#" @click="newChar(52)">Shoсkwave</a>
                               <a class="dropdown-item" href="#" @click="newChar(53)">Rabies</a> 
                            </div>
                          </div>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="navbarGeneral" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Necromancer
                          </a>
                          <div class="dropdown-menu" aria-labelledby="navbarGeneral">
                            <a class="dropdown-item" href="#" @click="newChar(20)">Necromancer</a>
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header">Builds</h6>
                            <div v-if="$work_mod.value == 'diablo2'">
                              <a class="dropdown-item" href="#" @click="newChar(21)">Poison</a>
                            </div>
                            <div v-if="$work_mod.value == 'blizzless_beta'">
                              <a class="dropdown-item" href="#" @click="newChar(21)">Poison</a>
                              <a class="dropdown-item" href="#" @click="newChar(22)">Ultra</a>
                              <a class="dropdown-item" href="#" @click="newChar(23)">Coroner</a>
                            </div>
                          </div>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="navbarGeneral" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Paladin
                          </a>
                          <div class="dropdown-menu" aria-labelledby="navbarGeneral">
                            <a class="dropdown-item" href="#" @click="newChar(30)">Paladin</a>
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header">Builds</h6>
                            <div v-if="$work_mod.value == 'diablo2'">
                              <a class="dropdown-item" href="#" @click="newChar(31)">Hammerdin</a>
                              <a class="dropdown-item" href="#" @click="newChar(32)">Fist of the Heavens</a>
                            </div>
                            <div v-if="$work_mod.value == 'blizzless_beta'">
                              <a class="dropdown-item" href="#" @click="newChar(31)">Hammerdin</a>
                              <a class="dropdown-item" href="#" @click="newChar(32)">Auradin</a>
                            </div>
                          </div>
                        </li>
                        <li class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" id="navbarGeneral" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sorceress
                          </a>
                          <div class="dropdown-menu" aria-labelledby="navbarGeneral">
                            <a class="dropdown-item" href="#" @click="newChar(10)">Sorceress</a>
                            <div class="dropdown-divider"></div>
                            <h6 class="dropdown-header">Builds</h6>
                            <div v-if="$work_mod.value == 'diablo2'">
                              <a class="dropdown-item" href="#" @click="newChar(11)">Blizzard</a>
                              <a class="dropdown-item" href="#" @click="newChar(12)">Blizzard(Mana)</a>
                              <a class="dropdown-item" href="#" @click="newChar(13)">Fire</a>
                              <a class="dropdown-item" href="#" @click="newChar(14)">Nova</a>
                              <a class="dropdown-item" href="#" @click="newChar(15)">Enchant Bow</a>
                            </div>
                            <div v-if="$work_mod.value == 'blizzless_beta'">
                              <a class="dropdown-item" href="#" @click="newChar(11)">Enchantress</a>
                              <a class="dropdown-item" href="#" @click="newChar(12)">Rogue</a>
                              <a class="dropdown-item" href="#" @click="newChar(13)">Fire</a>
                              <a class="dropdown-item" href="#" @click="newChar(14)">Nova</a>
                              <a class="dropdown-item" href="#" @click="newChar(15)">Blizzard</a>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </nav>

                  <div v-if="save != null">
                    <ul class="nav nav-tabs" id="tabs">
                      <li class="nav-item">
                        <a class="nav-link active" id="items-tab" data-toggle="tab" data-target="#items-content"
                          role="tab" type="button">Equipment</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="stats-tab" data-toggle="tab" data-target="#stats-content" role="tab"
                          type="button">Character</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="skills-tab" data-toggle="tab" data-target="#skills-content" role="tab"
                          type="button">Skills</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="quests-tab" data-toggle="tab" data-target="#quests-content" role="tab"
                          type="button">Quests</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="waypoints-tab" data-toggle="tab" data-target="#waypoints-content"
                          role="tab" type="button">Waypoints</a>
                      </li>
                    </ul>
                    <div class="tab-content" id="tabs-content">
                      <div class="tab-pane show active" id="items-content" role="tabpanel">
                        <div v-for="(notification, idx) in notifications" :key="idx" :class="notification.alert"
                          role="alert">
                          {{ notification.message }}
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="row mt-3">
                          <div class="col-auto equipment-inventory-col">
                            <Equipped :items.sync="equipped" @item-selected="onSelect" @item-event="onEvent"
                              :id="'Equipped'" :contextMenu="$refs.contextMenu">
                            </Equipped>
                            <!-- <Grid v-if="activeTab == 1 || activeTab == 10" :width="grid.inv.w" :height="grid.inv.h" :page="1"
                              :items.sync="inventory" @item-selected="onSelect" @item-event="onEvent" :id="'InventoryGrid'" :contextMenu="$refs.contextMenu">
                            </Grid> -->
          <Stash :items.sync="stash" @item-selected="onSelect" @item-event="onEvent" :id="'Stash'"
                              :contextMenu="$refs.contextMenu">
                            </Stash>
                            <Mercenary :items.sync="mercenary" @item-selected="onSelect"
                              :contextMenu="$refs.contextMenu">
                            </Mercenary>
                            <div class="cube">
                              <Grid class="cube__grid" :width="grid.cube.w" :height="grid.cube.h" :page="8"
                                :items.sync="cube" @item-selected="onSelect" @item-event="onEvent" :id="'CubeGrid'"
                                :contextMenu="$refs.contextMenu">
                              </Grid>
                            </div>
                          </div>
                          <div class="col">
                            <div class="col">
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
                      <div class="tab-pane" id="stats-content" role="tabpanel">
                        <Stats v-if="save && save.header && save.attributes" v-bind:save.sync="save" />
                      </div>
                      <div class="tab-pane" id="waypoints-content" role="tabpanel">
                        <Waypoints v-if="save && save.header && save.header.waypoints" v-bind:save.sync="save" />
                      </div>
                      <div class="tab-pane" id="quests-content" role="tabpanel">
                        <Quests v-if="save && save.header && save.header.quests_normal && save.header.quests_nm && save.header.quests_hell" v-bind:save.sync="save" />
                      </div>
                      <div class="tab-pane" id="skills-content" role="tabpanel">
                        <Skills v-if="save && save.skills && save.skills.length" v-bind:save.sync="save" />
                      </div>
                    </div>
          <div v-if="save != null">
                      <div class="row">
                        <button type="button" @click="unlockHell" class="btn btn-primary">Unlock Hell</button>
                        <button type="button" @click="unlockAllWPs" class="btn btn-primary">Unlock All WPs</button>
                        <button type="button" @click="setLvl99" class="btn btn-primary">Set Level 99</button>
                        <button type="button" @click="setAllSkills20" class="btn btn-primary">Set All Skills 20</button>
                        <button type="button" @click="unlockQs" class="btn btn-primary">Complete Skill/Stat Qs</button>
                        <button type="button" @click="maxGold" class="btn btn-primary">Max Gold</button>
                      </div>
          <div class="row mt-3">
                        <!-- <button type="button" id="d2" class="btn btn-primary" @click="saveFile('diablo2', 0x60)">Save D2</button> -->
                        <!-- <button type="button" id="d2" class="btn btn-primary" @click="saveFile('diablo2', 0x63)">Save D2R</button> -->
                        <button type="button" id="d2r" class="btn btn-primary" @click="saveFile($work_mod.value, $work_version.value)">Save</button>
                        <button type="button" id="d2r-blizz" class="btn btn-primary" @click="saveFile('blizzless', $work_version.value)">Save Blizzless</button>
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

  // TODO https://github.com/dschu012/d2s/pull/77
  // import * as d2s from '@dschu012/d2s';
  // import { constants as constants96 } from '@dschu012/d2s/lib/data/versions/96_constant_data';
  // import { constants as constants99 } from '@dschu012/d2s/lib/data/versions/99_constant_data';

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
        activeTab: 1,
        selected: null,
        itempack: ItemPack,
        previewModel: null,
        preview: null,
        baseModel: null,
        baseOptions: null,
        clipboard: null,
        load: null,
        notifications: [],
        grid: { inv: { w: 10, h: 4 }, cube: { w: 3, h: 4 } },
        location: {},
        theme: localStorage.getItem('theme')
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
        return this.save.merc_items || [];
      },
    },
    methods: {
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
        this.getPaletteData();
        this.addItemsToItemPack();
        // console.log('Changing mod to ' + this.$work_mod.value + this.$work_version.value);
        // console.log(this.$d2s.getConstantData(this.$work_mod.value, this.$work_version.value));
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
        //this.updateLocation(this.selected);
      },
      findIndex(list, i) {
        return list.findIndex(item =>
          item.location_id == i.location_id
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
        this.notifications.push({ alert: "alert alert-info", message: `Item data copied to clipboard. Use load from string to share it with someone.` });
      },
      onEvent(e) {
        if(e.type == 'share') {
          this.shareItem(e.item);
        } else if(e.type == 'copy') {
          this.clipboard = JSON.parse(JSON.stringify(e.item));
          navigator.clipboard.writeText(JSON.stringify(e.item));
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
        } else if(e.type == 'move') {
          let element = document.getElementById(e.id);
          element.style.backgroundColor = ""; element.style.width = ""; element.style.height = "";
          if (this.$uuid == e.uuid) {
            let idx = this.findIndex(this.save.items, e.item);
            this.onMove(this.save.items[idx], e);
          } else {
            //copy to another tab
            if(this.onMove(e.item, e)) {
              this.save.items.push(e.item);
            }
          }
        } else if(e.type == 'dragenter') {
          let item = e.item;
          if(this.canPlaceItem(item, e.location.storage_page, e.location.x, e.location.y)) {
            let element = document.getElementById(e.id);
            element.style.backgroundColor = "green"; element.style.width = `calc(var(--grid-size) * ${item.inv_width})`; element.style.height = `calc(var(--grid-size) * ${item.inv_height})`;
          }
        } else if(e.type == 'dragleave') {
          let element = document.getElementById(e.id);
          element.style.backgroundColor = ""; element.style.width = ""; element.style.height = "";
        }  else if(e.type === "pasteAt") {
          const location_id = this.activeTab === 1 ? 1 : 0; // Equipped
          const storage_page = this.activeTab === 1 ? 1 :  // Equipped
              this.activeTab === 3 ? 5 : // Stash
              this.activeTab === 8 ? 8 : // Cube
                  1; // Inventory
          if(this.canPlaceItem(e.item, storage_page, e.grid[0], e.grid[1])) {
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
        return true;
      },
      async setBase(e) {
        if (this.baseModel) {
          this.preview.type = this.baseModel;
          await this.$d2s.enhanceItems([this.preview], this.$work_mod.value, this.$work_version.value);
          await this.resolveInventoryImage(this.preview);
        }
      },
      async setPreviewItem(e) {
        this.baseOptions = null;
        this.baseModel = null;
        if (this.previewModel) {
          if (this.previewModel.base64) {
            let bytes = utils.b64ToArrayBuffer(this.previewModel.base64);
            this.preview = await this.$d2s.readItem(bytes, this.$work_mod.value, this.$work_version.value);
          } else if (this.previewModel.item) {
            this.preview = this.previewModel.item;
            if (this.preview?.given_runeword) {
              this.baseOptions = this.getBasesOptions(this.preview);
              return;
            }
        }
          await this.resolveInventoryImage(this.preview);
        }
      },
      async onItemFileLoad(event) {
        this.previewModel = {
          base64: utils.arrayBufferToBase64(event.target.result),
          // mod: this.$work_mod.value,
          // version: this.$work_version.value,
        };
        this.setPreviewItem();
      },
      onItemFileChange(event) {
        let reader = new FileReader();
        reader.onload = this.onItemFileLoad;
        reader.readAsArrayBuffer(event.target.files[0]);
        event.target.value = null;
      },
      async loadBase64Item() {
        try {
          let b64 = prompt("Please enter your base64 string for item.");
          if (b64 && this.preview) {
            let bytes = utils.b64ToArrayBuffer(b64);
            //await this.readItem(bytes, 0x63);
            this.preview = await this.$d2s.readItem(bytes, mod, version);
            await this.resolveInventoryImage(this.preview);
            this.paste(this.preview);
          }
        } catch(e) {
          alert("Failed to read item.");
        }
      },
      loadItem() {
        this.paste(this.preview);
      },
      paste(item, position) {
        let copy = JSON.parse(JSON.stringify(item != null ? item : this.clipboard));
        let pos = position ?? this.findSafeLocation(copy);
        copy.location_id = pos[0];
        copy.equipped_id = pos[1];
        copy.position_x = pos[2];
        copy.position_y = pos[3];
        copy.alt_position_id = pos[4];
        this.notifications = [];
        if (copy.location_id == 4) {
          this.notifications.push({ alert: "alert alert-warning", message: `Could not find safe location to place item. Placed in mouse buffer.` });
        } else {
          let loc = copy.alt_position_id == 1 ? 'inventory' : (copy.alt_position_id == 5 ? 'stash' : 'cube');
          this.notifications.push({ alert: "alert alert-info", message: `Loaded item in ${loc} at ${copy.position_x}, ${copy.position_y}` });
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
      setPropertiesOnItem(item) {
        if (!item) {
          return;
        }
        // Items from stash are already enhanced in parser; we only need to resolve their images here
        this.resolveInventoryImage(item);
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
        //this.addItemsToItemPack();
        const byteLen = bytes && (bytes.byteLength ?? bytes.length ?? 0);
        if (filename) {
          const lower = filename.toLowerCase();
          if (lower.endsWith(".d2s")) {
            this.save = null;
            this.$d2s.read(bytes, this.$work_mod.value)
            .then(response => {
              this.save = response;
              this.save.header.name = filename.split('.')[0];
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
              const pages = this.stashData?.pages || [];
              for (var i = 0; i < this.stashData.pageCount; i++) {
                [... this.stashData.pages[i].items].forEach(item => { this.setPropertiesOnItem(item)})
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
      onFileChange(event) {
        this.save = null;
        this.stashData = null;
        this.selected = null;
        const files = event.currentTarget.files;
        const count = Math.min(files.length || 0, 2);
        for (let i = 0; i < count; i++) {
          const file = typeof files.item === 'function' ? files.item(i) : files[i];
          if (!file) continue;
          const reader = new FileReader();
          reader.onload = (e) => {
            const buf = e.target.result;
            this.readBuffer(buf, file.name);
          };
          reader.readAsArrayBuffer(file);
        }
        // Allow selecting the same file again
        event.currentTarget.value = null;
      },
      maxGold() {
        this.save.attributes.gold = this.save.header.level * 10000;
        this.save.attributes.stashed_gold = 2500000
      },
      unlockQs() {
        const self = this;
        function update(difficulty, act, quest, attributes, amount) {
          if (self.save.header[difficulty][act][quest].is_completed === false){
            self.save.header[difficulty][act][quest].is_completed = true;
            if (quest === "prison_of_ice"){
              self.save.header[difficulty][act][quest].consumed_scroll = true;
            } else {
              for(let attribute of attributes) {
                self.save.attributes[attribute] = (self.save.attributes[attribute] ?? 0) + amount;
              }
            }
          }
        }
        for (const diff of ["quests_normal", "quests_nm", "quests_hell"]) {
          update(diff, "act_i", "den_of_evil", ["unused_skill_points"], 1);
          update(diff, "act_ii", "radaments_lair", ["unused_skill_points"], 1);
          update(diff, "act_iii", "lam_esens_tome", ["unused_stats"], 5);
          update(diff, "act_iii", "the_golden_bird", ["max_hp", "current_hp"], 20);
          update(diff, "act_iv", "the_fallen_angel", ["unused_skill_points"], 2);
          update(diff, "act_v", "prison_of_ice", null, null);
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
              //set_attributes: 
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
            item.total_nr_of_sockets = item.magic_attributes[socketIndex].value;
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
            simple_item: 1,
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
  };
</script>
