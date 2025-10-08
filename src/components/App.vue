<template>
  <a-config-provider :theme="{ algorithm: antdTheme.darkAlgorithm }">
    <ContextMenu :ref="'contextMenu'" @option-clicked="optionClicked"></ContextMenu>
    <div class="dark-theme" @click.native="rootClick">
    <link v-if="theme == 'd2'" href="css/theme.css" rel="stylesheet" />

    <div class="modal" tabindex="-1" role="dialog" id="LoadItem">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select an Item</h5>
            <a-button type="text" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a-button>
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
            <input style="display:none;" type="file" name="d2iFile" @change="onItemFileChange" id="d2iFile" ref="d2iFile">
            <a-button type="primary" @click="$refs.d2iFile && $refs.d2iFile.click()">Load From File</a-button>
            <a-button type="primary" @click="loadBase64Item">Load From String</a-button>
            <a-button type="primary" :disabled="!preview" @click="loadItem">Load</a-button>
            <a-button type="default" data-dismiss="modal">Close</a-button>
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
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <h5 class="mt-1 mb-2">Create</h5>
                      <a-dropdown>
                        <a-button type="primary">Create new</a-button>
                        <template #overlay>
                          <a-menu @click="onCreateMenuClick">
                            <a-menu-item key="0">Amazon</a-menu-item>
                            <a-menu-item key="10">Sorceress</a-menu-item>
                            <a-menu-item key="20">Necromancer</a-menu-item>
                            <a-menu-item key="30">Paladin</a-menu-item>
                            <a-menu-item key="40">Barbarian</a-menu-item>
                            <a-menu-item key="50">Druid</a-menu-item>
                            <a-menu-item key="60">Assassin</a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>
                    </div>
                    <div class="col-md-6">
                      <h5 class="mt-1 mb-2">Open</h5>
                      <div class="form-group">
                        <Flex gap="6" align="center" justify="left">
                          <a-select
                            id="open-mod"
                            v-model:value="$work_mod.value"
                            name="open-mod"
                            title="Workspace Mod"
                            @change="changeMod()"
                            style="min-width: 120px"
                          >
                            <a-select-option value="diablo2">Diablo2</a-select-option>
                            <a-select-option value="blizzless">Blizzless</a-select-option>
                            <a-select-option value="blizzless_beta">Blizzless Beta</a-select-option>
                          </a-select>
                          <a-select
                            id="work-version"
                            v-model:value="$work_version.value"
                            name="work-version"
                            title="Workspace Version"
                            @change="changeMod()"
                            style="min-width: 80px"
                          >
                            <!-- <option v-if="$work_mod.value == 'diablo2'" value="96">LOD 1.10-1.14d</option> -->
                            <!-- <option v-if="$work_mod.value == 'diablo2'" value="97">D2R Alpha</option> -->
                            <!-- <option v-if="$work_mod.value == 'diablo2'" value="98">D2R 2.4</option> -->
                            
                            <!-- <option v-if="$work_mod.value == 'blizzless'" value="98">Beta</option> -->
                            <a-select-option value="99">D2R 2.5+</a-select-option>
                          </a-select>
                          <a-upload :before-upload="() => false" :multiple="true" :show-upload-list="false" accept=".d2s,.d2i" @change="onAntUploadChange">
                            <a-button type="primary">Open D2S / D2I</a-button>
                          </a-upload>
                          <a-button type="primary" @click="pasteBase64Save">Paste as base64</a-button>
                        </Flex>
                      </div>
                    </div>
                  </div>

                  <nav v-if="hasOpened" class="navbar navbar-expand-md navbar-light">
                    <div class="w-100 d-flex justify-content-between align-items-center">
                      <div class="save-info d-flex align-items-center flex-1" v-if="hasOpened">
                        <span class="mr-2">Current:</span>
                        <template v-if="save && save.header && save.header.name">
                          <img v-if="classIconSrc" :src="classIconSrc" alt="class" style="height:24px;width:24px;object-fit:contain;" />
                          <strong class="ml-2">{{ save.header.name }}</strong>
                          <span class="ml-2">Level {{ save.header.level }}</span>
                          <a-tag class="ml-2" :color="currentModeLabelColor">{{ currentModeLabel }}</a-tag>
                          <a-tag v-if="isClassic" class="ml-2" color="gold">Classic</a-tag>
                        </template>
                        <template v-else-if="stashData">
                          <img src="img/icons/stash.png" alt="stash" style="height:24px;width:24px;object-fit:contain;" />
                          <Flex gap="2" align="center" justify="left" class="ml-2">
                            <Tag color="gold">Pages: {{ stashData.pageCount }}</Tag>
                            <Tag color="gold">Items: {{ stashItemsCount }}</Tag>
                          </Flex>
                        </template>
                      </div>
                      <div v-if="save != null" class="d-flex flex-1 justify-content-end">
                        <!-- <button type="button" id="d2" class="btn btn-primary" @click="saveFile('diablo2', 0x60)">Save D2</button> -->
                        <!-- <button type="button" id="d2" class="btn btn-primary" @click="saveFile('diablo2', 0x63)">Save D2R</button> -->
                        <!-- <a-button type="primary" id="d2r" @click="saveFile($work_mod.value, $work_version.value)">Save</a-button> -->
                        <a-button type="primary" id="d2r-blizz" @click="saveFile('blizzless', $work_version.value)">Save file</a-button>
                        <a-button type="primary" id="d2r-base64" @click="outputBase64Save($work_mod.value, $work_version.value)">Output as base64</a-button>
                      </div>
                    </div>
                  </nav>

                  <div v-if="save != null">
                    <div class="mb-3 ml-3">
                      <div class="row" v-if="!isStashOnly">
                        <a-button type="primary" @click="unlockHell">Unlock Hell</a-button>
                        <a-button type="primary" @click="unlockAllWPs">Unlock All WPs</a-button>
                        <a-button type="primary" @click="setLvl99">Set Level 99</a-button>
                        <a-button type="primary" @click="setAllSkills20">Set All Skills 20</a-button>
                        <a-button type="primary" @click="unlockQs">Complete Skill/Stat Qs</a-button>
                        <a-button type="primary" @click="maxGold">Max Gold</a-button>
                      </div>
                    </div>
                    <ul class="nav nav-tabs" id="tabs">
                      <li class="nav-item">
                        <a class="nav-link active" id="items-tab" data-toggle="tab" data-target="#items-content"
                          role="tab" type="button">Equipment</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="!isStashOnly">
                        <a class="nav-link" id="stats-tab" data-toggle="tab" data-target="#stats-content" role="tab"
                          type="button">Character</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="!isStashOnly">
                        <a class="nav-link" id="skills-tab" data-toggle="tab" data-target="#skills-content" role="tab"
                          type="button">Skills</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="!isStashOnly">
                        <a class="nav-link" id="quests-tab" data-toggle="tab" data-target="#quests-content" role="tab"
                          type="button">Quests</a>
                      </li>
                      <li class="nav-item" role="presentation" v-if="!isStashOnly">
                        <a class="nav-link" id="waypoints-tab" data-toggle="tab" data-target="#waypoints-content"
                          role="tab" type="button">Waypoints</a>
                      </li>
                    </ul>
                    <div class="tab-content" id="tabs-content">
                      <div class="tab-pane show active" id="items-content" role="tabpanel">
                        <div v-for="(notification, idx) in notifications" :key="idx" :class="notification.alert"
                          role="alert">
                          {{ notification.message }}
                          <a-button type="text" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a-button>
                        </div>
                        <div class="row mt-3">
                          <div class="col-auto equipment-inventory-col">
                            <Equipped v-if="!isStashOnly" :items.sync="equipped" @item-selected="onSelect" @item-event="onEvent"
                              :id="'Equipped'" :contextMenu="$refs.contextMenu" :gold="save?.attributes?.gold">
                            </Equipped>
                            <!-- <Grid v-if="activeTab == 1 || activeTab == 10" :width="grid.inv.w" :height="grid.inv.h" :page="1"
                              :items.sync="inventory" @item-selected="onSelect" @item-event="onEvent" :id="'InventoryGrid'" :contextMenu="$refs.contextMenu">
                            </Grid> -->
                            <Stash :items.sync="stashWithMeta" @item-selected="onSelect" @item-event="onEvent" :id="'Stash'"
                              :hidePersonal="isStashOnly"
                              :sharedCount="stashSharedCount"
                              :contextMenu="$refs.contextMenu">
                            </Stash>
                            <Mercenary v-if="!isStashOnly" :items.sync="mercenary" @item-selected="onSelect"
                              :contextMenu="$refs.contextMenu">
                            </Mercenary>
                            <div class="cube" v-if="!isStashOnly">
                              <Grid class="cube__grid" :width="grid.cube.w" :height="grid.cube.h" :page="8"
                                :items.sync="cube" @item-selected="onSelect" @item-event="onEvent" :id="'CubeGrid'"
                                :contextMenu="$refs.contextMenu">
                              </Grid>
                            </div>
                          </div>
                          <div class="col">
                            <div class="col"></div>
                            <ItemEditor :id="'Selected'" :item.sync="selected" :location="location"
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
  </a-config-provider>
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
  import { theme as antdTheme, Flex, Tag } from 'ant-design-vue';

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
      ContextMenu,
      Flex,
      Tag
    },
    data() {
      return {
        antdTheme: antdTheme,
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
      await this.changeMod();
      await this.initFromQuery();
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
          sharedGold: this.stashData && typeof this.stashData.sharedGold === 'number' ? this.stashData.sharedGold : null,
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
        return this.save.merc_items || [];
      },
    },
    methods: {
      closeLoadItemModal() {
        try {
          const modal = document.getElementById('LoadItem');
          if (!modal) return;
          // Bootstrap-like hide if available
          if (typeof window.$ !== 'undefined' && window.$(modal).modal) {
            window.$(modal).modal('hide');
            return;
          }
          // Fallback: toggle classes/attributes
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        } catch (_) {}
      },
      // Fully reset state related to currently opened save/stash
      resetOpenState() {
        this.save = null;
        this.stashData = null;
        this.selected = null;
        this.notifications = [];
        this.preview = null;
        this.previewModel = null;
        this.baseModel = null;
        this.baseOptions = null;
        this.location = {};
      },
      // Increase load token to invalidate previous async operations
      beginNewLoad() {
        if (typeof this.load !== 'number') this.load = 0;
        this.load += 1;
        return this.load;
      },
      onAntUploadChange({ fileList }) {
        if (!fileList || !fileList.length) return;
        const latest = fileList[fileList.length - 1];
        const file = latest && (latest.originFileObj || latest);
        if (!file) return;
        const token = this.beginNewLoad();
        this.resetOpenState();
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const buf = e.target.result;
            this.readBuffer(buf, file.name, token);
          } catch (err) {
            // noop, readBuffer handles messaging
          }
        };
        reader.onerror = () => {
          if (this.$message) {
            this.$message.error('Failed to read file');
          }
        };
        reader.readAsArrayBuffer(file);
      },
      async copyBase64OrPrompt(text) {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            window.prompt('Base64 save string (copy it):', text);
          }
        } catch (e) {
          window.prompt('Base64 save string (copy it):', text);
        }
      },
      async outputBase64Save(mod, version) {
        try {
          if (this.isStashOnly && this.stashData) {
            const response = await this.$d2s.writeStash(this.stashData, this.$work_mod.value, this.$work_version.value);
            const b64 = utils.arrayBufferToBase64(response);
            await this.copyBase64OrPrompt(b64);
            if (this.$message) {
              this.$message.success('Shared stash base64 is copied to clipboard');
            }
            return;
          }
          if (!this.save) {
            if (this.$message) {
              this.$message.error('No save is loaded');
            }
            return;
          }
          this.save.header.version = version;
          const response = await this.$d2s.write(this.save, mod, version);
          const b64 = utils.arrayBufferToBase64(response);
          await this.copyBase64OrPrompt(b64);
          if (this.$message) {
            this.$message.success('Character save base64 is copied to clipboard');
          }
        } catch (e) {
          if (this.$message) {
            this.$message.error('Failed to build base64');
          }
          if (localStorage.getItem('isDebug') == '1') console.error('[outputBase64Save] error', e);
        }
      },
      onCreateMenuClick({ key }) {
        const idx = parseInt(key);
        if (!isNaN(idx)) {
          this.newChar(idx);
        }
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
      async changeMod(failSafe = true) {
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
        await this.getPaletteData();
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
        if (!this.previewModel) return;
        try {
          if (this.previewModel.base64) {
            const bytes = utils.b64ToArrayBuffer(this.previewModel.base64);
            this.preview = await this.$d2s.readItem(bytes, this.$work_mod.value, this.$work_version.value);
          } else if (this.previewModel.item) {
            this.preview = this.previewModel.item;
            if (this.preview?.given_runeword) {
              this.baseOptions = this.getBasesOptions(this.preview);
              return;
            }
          }
          await this.resolveInventoryImage(this.preview);
        } catch (err) {
          this.closeLoadItemModal();
          if (this.$message) {
            this.$message.error(`Failed to open item: ${err && err.message ? err.message : 'Unknown error'}`);
          }
        }
      },
      async onItemFileLoad(event) {
        try {
          this.previewModel = {
            base64: utils.arrayBufferToBase64(event.target.result),
            // mod: this.$work_mod.value,
            // version: this.$work_version.value,
          };
          this.setPreviewItem();
        } catch (e) {
          this.closeLoadItemModal();
          if (this.$message) {
            this.$message.error('Failed to load item file');
          }
        }
      },
      onItemFileChange(event) {
        const file = event && event.target && event.target.files && event.target.files[0];
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.onload = this.onItemFileLoad;
        reader.onerror = () => {
          this.closeLoadItemModal();
          if (this.$message) {
            this.$message.error('Failed to read item file');
          }
        };
        reader.readAsArrayBuffer(file);
        event.target.value = null;
      },
      async loadBase64Item() {
        try {
          const b64 = prompt("Please enter your base64 string for item.");
          if (!b64) return;
          const bytes = utils.b64ToArrayBuffer(b64);
          this.preview = await this.$d2s.readItem(bytes, this.$work_mod.value, this.$work_version.value);
          await this.resolveInventoryImage(this.preview);
          this.paste(this.preview);
        } catch (e) {
          this.closeLoadItemModal();
          if (this.$message) {
            this.$message.error(`Failed to read item: ${e && e.message ? e.message : 'Unknown error'}`);
          }
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
        if (localStorage.getItem('isDebug') == '1') console.log('[resolveInventoryImages] total items:', allItems.length);
        const promises = allItems.map(async function (item) {
          return this.resolveInventoryImage(item);
        }, this);
        return Promise.all(promises);
      },
      async resolveInventoryImage(item) {
        if (!item) {
          if (localStorage.getItem('isDebug') == '1') console.log('[resolveInventoryImage] skip null item');
          return;
        }
        try {
          item.src = await utils.getInventoryImage(item, this.$work_mod.value, this.$work_version.value, this.$palettes.value);
          if (localStorage.getItem('isDebug') == '1') console.log('[resolveInventoryImage] resolved', { type: item.type, inv: item.inv_file, hasSrc: !!item.src });
        } catch (e) {
          if (localStorage.getItem('isDebug') == '1') console.error('[resolveInventoryImage] error', e);
        }
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
              } else {
                if (localStorage.getItem('isDebug') == '1') console.log('[resolveInventoryImage] socket image missing', { parent: item.type, idx: i });
              }
            })
            .catch((err) => { if (localStorage.getItem('isDebug') == '1') console.error('[resolveInventoryImage] socket image error', err); });
        }
      },
      setPropertiesOnItem(item) {
        if (!item) {
          return;
        }
        // Items from stash are already enhanced in parser; we only need to resolve their images here
        if (localStorage.getItem('isDebug') == '1') console.log('[setPropertiesOnItem] item', { type: item.type, q: item.quality, inv: item.inv_file });
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
        const token = this.beginNewLoad();
        this.resetOpenState();
        this.readBuffer(bytes, undefined, token);
      },
      onFileLoad(event) {
        this.readBuffer(event.target.result, event.target.filename);
      },
      async readBufferAuto(bytes, expectedLoad) {
        // Try to read as character first, then as shared stash
        this.save = null;
        this.selected = null;
        this.stashData = null;
        try {
          const response = await this.$d2s.read(bytes, this.$work_mod.value);
          if (expectedLoad != null && expectedLoad !== this.load) return;
          this.save = response;
          await this.resolveInventoryImages();
          if (this.$message) {
            this.$message.success('Character save opened successfully');
          }
          return;
        } catch (e1) {
          // Fallback to stash parsing
        }
        try {
          const response = await this.$d2s.readStash(bytes, this.$work_mod.value);
          if (expectedLoad != null && expectedLoad !== this.load) return;
          if (!this.save) {
            // Ensure UI renders stash even without a loaded character
            this.save = { items: [], merc_items: [], corpse_items: [], golem_item: null, header: {} };
          }
          this.stashData = response;
          for (var i = 0; i < this.stashData.pageCount; i++) {
            [... this.stashData.pages[i].items].forEach(item => { this.setPropertiesOnItem(item)});
          }
          if (this.$message) {
            this.$message.success(`Shared stash opened successfully (${this.stashData.pageCount} pages)`);
          }
          return;
        } catch (e2) {
          if (expectedLoad != null && expectedLoad !== this.load) return;
          if (this.$message) {
            this.$message.error('Provided base64 is not a valid D2S or D2I file');
          }
        }
      },
      readBuffer(bytes, filename, expectedLoad) {
        //this.addItemsToItemPack();
        const byteLen = bytes && (bytes.byteLength ?? bytes.length ?? 0);
        if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] start', { filename, byteLen });
        if (filename) {
          const lower = filename.toLowerCase();
          if (lower.endsWith(".d2s")) {
            if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] detected .d2s');
            this.save = null;
            this.$d2s.read(bytes, this.$work_mod.value)
            .then(response => {
              if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] d2s parsed OK');
              if (expectedLoad != null && expectedLoad !== this.load) return;
              this.save = response;
              this.save.header.name = filename.split('.')[0];
              this.resolveInventoryImages().then(() => { if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] inventory images resolved') });
              if (this.$message) {
                this.$message.success(`Character save opened successfully: \"${this.save.header.name}\"`);
              }
            })
            .catch(err => {
              if (localStorage.getItem('isDebug') == '1') console.error('[readBuffer] d2s parse error:', err);
              if (expectedLoad != null && expectedLoad !== this.load) return;
              if (this.$message) {
                this.$message.error(`Failed to open character save: ${err && err.message ? err.message : 'Unknown error'}`);
              }
            });
          } else if (lower.endsWith(".d2i")) {
            if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] detected .d2i');
            this.stashData = null;
            this.$d2s.readStash(bytes, this.$work_mod.value)
            .then(response => {
              if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] d2i parsed OK');
              if (expectedLoad != null && expectedLoad !== this.load) return;
              if (!this.save) {
                // Ensure UI renders stash even without a loaded character
                this.save = { items: [], merc_items: [], corpse_items: [], golem_item: null, header: {} };
                if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] created placeholder save for stash rendering');
              }
              this.stashData = response;
              const pages = this.stashData?.pages || [];
              if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] stash pages:', this.stashData.pageCount, 'items per page:', pages.map(p => p.items?.length || 0));
              for (var i = 0; i < this.stashData.pageCount; i++) {
                [... this.stashData.pages[i].items].forEach(item => { this.setPropertiesOnItem(item)})
              }
              if (this.$message) {
                this.$message.success(`Shared stash opened successfully (${this.stashData.pageCount} pages)`);
              }
            })
            .catch(err => {
              if (localStorage.getItem('isDebug') == '1') console.error('[readBuffer] d2i parse error:', err);
              if (expectedLoad != null && expectedLoad !== this.load) return;
              if (this.$message) {
                this.$message.error(`Failed to open shared stash: ${err && err.message ? err.message : 'Unknown error'}`);
              }
            })
          }
        } else {
          let that = this;
          if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] filename not provided, defaulting to character parse');
          this.save = null;
          this.selected = null;
          this.stashData = null;
          this.$d2s.read(bytes, this.$work_mod.value)
          .then(response => {
            if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] d2s parsed OK (no filename)');
            if (expectedLoad != null && expectedLoad !== that.load) return;
            that.save = response;
            that.resolveInventoryImages().then(() => { if (localStorage.getItem('isDebug') == '1') console.log('[readBuffer] inventory images resolved') });
            if (that.$message) {
              that.$message.success('Character save opened successfully');
            }
          })
          .catch(err => {
            if (localStorage.getItem('isDebug') == '1') console.error('[readBuffer] d2s parse error (no filename):', err);
            if (expectedLoad != null && expectedLoad !== that.load) return;
            if (that.$message) {
              that.$message.error(`Failed to open character save: ${err && err.message ? err.message : 'Unknown error'}`);
            }
          })
        }
        
      },
      async initFromQuery() {
        try {
          const search = window.location.search || '';
          const match = search.match(/[?&]s=([^&]*)/);
          if (!match) return;
          const encoded = match[1];
          // Preserve '+' as plus, only decode percent-encoding
          const decoded = decodeURIComponent(encoded.replace(/\+/g, '%2B'));
          const raw = decoded.trim();
          const cleaned = raw.replace(/\s+/g, '').replace(/^data:.*?;base64,/, '');
          let normalized = cleaned.replace(/-/g, '+').replace(/_/g, '/');
          const pad = normalized.length % 4;
          if (pad === 2) normalized += '==';
          else if (pad === 3) normalized += '=';
          let bytes;
          try {
            bytes = utils.b64ToArrayBuffer(normalized);
          } catch (e) {
            if (this.$message) {
              this.$message.error('Query parameter "s" is not valid base64');
            }
            return;
          }
          const token = this.beginNewLoad();
          this.resetOpenState();
          await this.readBufferAuto(bytes, token);
        } catch (err) {
          if (this.$message) {
            this.$message.error('Failed to process query parameter "s"');
          }
        }
      },
      async pasteBase64Save() {
        try {
          if (!navigator.clipboard || !navigator.clipboard.readText) {
            if (this.$message) {
              this.$message.error('Clipboard API is not available');
            }
            return;
          }
          const raw = (await navigator.clipboard.readText() || '').trim();
          if (!raw) {
            if (this.$message) {
              this.$message.error('Clipboard is empty');
            }
            return;
          }
          const b64 = raw.replace(/\s+/g, '').replace(/^data:.*?;base64,/, '');
          let bytes;
          try {
            bytes = utils.b64ToArrayBuffer(b64);
          } catch (e) {
            if (this.$message) {
              this.$message.error('Clipboard does not contain valid base64 data');
            }
            return;
          }
          const token = this.beginNewLoad();
          this.resetOpenState();
          await this.readBufferAuto(bytes, token);
        } catch (err) {
          if (this.$message) {
            this.$message.error(`Failed to open data from clipboard: ${err && err.message ? err.message : 'Unknown error'}`);
          }
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
        if (localStorage.getItem('isDebug') == '1') console.log('[onFileChange] triggered');
        const files = event.currentTarget.files;
        if (localStorage.getItem('isDebug') == '1') console.log('[onFileChange] files:', files);
        if (!files || !files.length) {
          event.currentTarget.value = null;
          return;
        }
        const file = typeof files.item === 'function' ? files.item(files.length - 1) : files[files.length - 1];
        if (!file) {
          event.currentTarget.value = null;
          return;
        }
        const token = this.beginNewLoad();
        this.resetOpenState();
        if (localStorage.getItem('isDebug') == '1') console.log('[onFileChange] reading file:', file.name, 'size:', file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const buf = e.target.result;
            if (localStorage.getItem('isDebug') == '1') console.log('[onFileChange] loaded:', file.name, 'byteLength:', buf?.byteLength);
            this.readBuffer(buf, file.name, token);
          } catch (err) {
            if (localStorage.getItem('isDebug') == '1') console.error('[onFileChange] onload error:', err);
          }
        };
        reader.onerror = (e) => {
          if (localStorage.getItem('isDebug') == '1') console.error('[onFileChange] FileReader error for', file.name, e);
          if (this.$message) {
            this.$message.error(`Failed to read file: ${file && file.name ? file.name : 'Unknown file'}`);
          }
        };
        reader.readAsArrayBuffer(file);
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
</style>
