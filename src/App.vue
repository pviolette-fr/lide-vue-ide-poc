<template>
  <v-app
    class="h-screen"
    :dark="options.useDarkTheme"
  >
    <v-navigation-drawer
      v-model="drawerOpen"
      app
      fixed
      clipped
    >
      <v-layout
        row
        fill-height>
        <v-navigation-drawer
          :dark="!options.useDarkTheme"
          :light="options.useDarkTheme"
          mini-variant
          color="secondary"
          stateless
          value="true"
          class="py-2"
        >
          <!--
          <v-toolbar
            flat
            class="transparent">
            <v-list class="pa-0">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img src="https://randomuser.me/api/portraits/men/85.jpg">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>John Leider</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn
                    icon
                    @click.native.stop="mini = !mini"
                  >
                    <v-icon>chevron_left</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-toolbar>
-->
          <v-list
            class="pt-0"
            dense>
            <v-divider/>
            <v-list-tile
              @click="drawerSideActive = 'files'"
              class="mb-2"
            >
              <v-list-tile-action
              >
                <v-btn
                  :class="{drawerSideActive: drawerSideActive === 'files'}"
                  title="Files"
                  flat
                >
                  <v-icon
                  >far fa-folder</v-icon>
                </v-btn>

              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>File</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              @click="drawerSideActive = 'settings'"
            >
              <v-list-tile-action
              >
                <v-btn
                  :class="{'drawerSideActive': drawerSideActive === 'settings'}"

                  flat
                  file="Settings">
                  <v-icon
                  >fa-cog</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Settings</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <v-layout
          column
          class="w-3/4">
          <template v-if="drawerSideActive === 'files'">
            <files-panel
              :files-name="fileNameList"
              :active-file-index="activeFileIndex"
              @file-selected="selectFile"
              @submit-new-file="submitNewFile"
              @duplicate-file="duplicateFileAtIndex"
              @remove-file="removeFileAtIndex"
            />
          </template>
          <template v-if="drawerSideActive === 'settings'">
            <v-list
              subheader
              two-line
              dense
            >
              <v-subheader>IDE Configuration</v-subheader>
              <v-list-tile>
                <v-list-tile-action>
                  <v-switch v-model="options.useSoftTabs"/>
                </v-list-tile-action>
                <v-list-tile-content @click="options.useSoftTabs = !options.useSoftTabs">
                  <v-list-tile-title>Indent With Space</v-list-tile-title>
                  <v-list-tile-sub-title>Use soft tabs</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-switch v-model="options.useWrapMode"/>
                </v-list-tile-action>
                <v-list-tile-content @click="options.useWrapMode = !options.useWrapMode">
                  <v-list-tile-title>Wrap Lines</v-list-tile-title>
                  <v-list-tile-sub-title>Wrap long lines</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-select
                  dense
                  :items="[{label: 'Stacked', value: true}, {label: 'Side By Side', value: false}]"
                  v-model="options.layoutStacked"
                  label="Layout"
                  item-text="label"
                  item-value="value"
                />
              </v-list-tile>
              <v-divider/>
              <v-subheader>Theming</v-subheader>
              <v-list-tile>
                <v-select
                  dense
                  :items="availableThemes"
                  v-model="options.editorTheme"
                  label="Editor Theme"
                  item-text="label"
                  item-value="value"
                />
              </v-list-tile>
            </v-list>

          </template>
        </v-layout>
      </v-layout>
    </v-navigation-drawer>
    <v-toolbar
      color="primary"
      dark
      fixed
      app
      clipped-left
    >
      <v-toolbar-side-icon @click="toggleDrawer"/>
      <v-toolbar-title>LIDE - Université d'Angers</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          flat
          title="IDE Configuration"
          small
          @click="openIDEConfiguration"
        >
          <v-icon>fa-cog</v-icon>
        </v-btn>
        <v-btn
          flat
          title="Profile"
          small
        >
          <v-icon>fa-user-cog</v-icon>
        </v-btn>
        <v-btn
          flat
          small
          title="Quit"
        >
          <v-icon>fa-sign-out-alt</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container
        fill-height
        fluid
      >
        <v-layout column>
          <v-layout
            :row="!options.layoutStacked"
            :column="options.layoutStacked"
            xs12>
            <!-- Editor -->
            <v-flex
              d-flex
              :style="{'height' : options.layoutStacked && showConsole? 'calc(50% - 3px)' : '100%'}"
            >
              <v-layout
                column
              >
                <div
                  class="font-mono"
                  style="max-height: 48px;">
                  <v-chip
                    small
                    color="secondary"
                    label>
                    {{ activeFile.name }}
                  </v-chip>
                </div>
                <div class="flex-grow flex-1">
                  <editor
                    ref="editor"
                    class="text-lg"
                    :session="activeFileEditSession"
                    :theme="options.editorTheme"
                    :line-highlight="options.lineHighlight"
                  />
                </div>
              </v-layout>
            </v-flex>
            <template v-if="showConsole">
              <div
                class="cursor-move bg-grey-light relative"
                style="min-height: 6px; min-width: 6px"
                :class="{'h-full' : !options.layoutStacked,
                         'w-full' : options.layoutStacked,}"
              >
                <div
                  class="bg-black absolute"
                  :style="{
                    'top': options.layoutStacked ? '50%' : 'calc(50% - 2rem)',
                    'left': options.layoutStacked ? 'calc(50% - 2 rem)' : '50%'
                  }"
                  :class="{
                    'h-8' : !options.layoutStacked,
                    'w-8' : options.layoutStacked,
                    'h-px' : options.layoutStacked,
                    'w-px': !options.layoutStacked}"/>
              </div>
              <v-flex
                xs6
                d-flex
                :style="{'max-height' : options.layoutStacked ? 'calc(50% - 4px)' : '100%'}"
                class="relative"
                :class="{'h-full' : !options.layoutStacked}"
              >
                <console
                  class="absolute w-full h-full"
                  :show-prompt="showConsolePrompt"
                  :buffer="consoleBuffer"
                  :input-loading="inputLoading"
                  @input="appendLineToBuffer"/>
              </v-flex>
            </template>
          </v-layout>
          <v-toolbar
            dense
          >
            <v-spacer/>
            <v-btn
              flat
              :disabled="isRunning"
              :loading="isRunningLoading"
              @click="run"
            >
              <v-icon>fa-play</v-icon>
              <span class="hidden md:inline ml-2">Run</span>
            </v-btn>
            <v-btn
              flat
              :disabled="!isRunning"
              @click="stop"
            >
              <v-icon>fa-stop</v-icon>
              <span class="hidden md:inline ml-2">Stop</span>
            </v-btn>
            <v-btn
              flat
              title="Toggle Console"
              :input-loading="inputLoading"
              @click="toggleConsole">
              <v-icon>fa-terminal</v-icon>
              <span class="hidden lg:inline ml-2">Terminal</span>
            </v-btn>
          </v-toolbar>
        </v-layout>
      </v-container>
      <v-dialog
        v-model="ideConfigDialog"
        fullscreen
      >
        <v-card>
          <v-toolbar
            dark
            color="accent">
            <v-btn
              icon
              dark
              @click.native="ideConfigDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                :loading="configSaveLoading"
                @click.native="ideConfigDialog = false">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list
            subheader
            two-line
          >
            <v-subheader>IDE Configuration</v-subheader>
            <v-list-tile>
              <v-list-tile-action>
                <v-checkbox v-model="options.useSoftTabs"/>
              </v-list-tile-action>
              <v-list-tile-content @click="options.useSoftTabs = !options.useSoftTabs">
                <v-list-tile-title>Soft Tabs</v-list-tile-title>
                <v-list-tile-sub-title>Use soft tabs</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
                <v-checkbox v-model="options.useWrapMode"/>
              </v-list-tile-action>
              <v-list-tile-content @click="options.useWrapMode = !options.useWrapMode">
                <v-list-tile-title>Wrap Lines</v-list-tile-title>
                <v-list-tile-sub-title>Wrap long lines</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>
<script>

import Editor from './components/ide/editor.vue';
import Console from './components/ide/console.vue';
import FilesPanel from './components/app-interface/files-panel.vue';
import fileManagement from './mixins/files-management';
// eslint-disable-next-line prefer-destructuring

export default {
  name: 'App',
  props: {
    userOptions: {
      type: Object,
      required: false,
      default() {
        return {
          useSoftTabs: true,
          useWrapMode: true,
          lineHighlight: true,
          useDarkTheme: false,
          editorTheme: 'crimson_editor',
          layoutStacked: false,
        };
      },
    },
  },
  data() {
    return {
      drawerOpen: true,
      availableThemes: [
        { label: 'Tomorrow Night', value: 'tomorrow_night' },
        { label: 'twilight', value: 'twilight' },
        { label: 'clouds', value: 'clouds' },
        { label: 'Crimson', value: 'crimson_editor' },
        { label: 'Ambiance', value: 'ambiance' },
      ],
      // Console
      consoleBuffer: '',
      showConsole: true,
      isRunning: false,
      isRunningLoading: false,
      stopLoading: false,
      inputLoading: false,
      consoleSide: true,
      // Configuration
      options: JSON.parse(JSON.stringify(this.userOptions)),
      ideConfigDialog: false,
      configSaveLoading: false,
      drawerSideActive: 'files',
    };
  },
  mounted() {
  },
  computed: {
    showConsolePrompt() {
      return !this.isRunning;
    },
  },
  methods: {
    submitNewFile({ name, content }) {
      this.addFile(name, content);
    },
    appendLineToBuffer(append) {
      this.inputLoading = true;
      setTimeout(() => {
        this.consoleBuffer = this.consoleBuffer.concat(`\n${append}`);
        this.inputLoading = false;
      }, 1000);
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    toggleConsole() {
      this.showConsole = !this.showConsole;
    },
    run() {
      this.isRunningLoading = true;
      setTimeout(() => {
        this.isRunning = true;
        this.isRunningLoading = false;
        this.consoleBuffer = this.consoleBuffer.concat('\nNo program to run because this is just a demo  !');
        setTimeout(() => {
          this.isRunning = false;
          this.consoleBuffer = this.consoleBuffer.concat('\nDemo done !');
        }, 500);
      }, 500);
      // TODO API
    },
    stop() {
      this.stopLoading = true;
      setTimeout(() => {
        this.isRunning = false;
        this.stopLoading = false;
      }, 750);
      // TODO API
    },
    openIDEConfiguration() {
      this.ideConfigDialog = true;
    },
    onImportFileButtonClick() {
      this.$refs.importFileInput.click();
    },
  },
  watch: {
    // activeFile(value) {
    // },
    // eslint-disable-next-line object-shorthand
    'options.useSoftTabs'(value) {
      this.sessions.forEach((session) => {
        session.sessionObject.setUseSoftTabs(value);
      });
    },
    // eslint-disable-next-line object-shorthand
    'options.useWrapMode'(value) {
      this.sessions.forEach((session) => {
        session.sessionObject.setUseWrapMode(value);
      });
    },
  },
  mixins: [fileManagement],
  components: {
    FilesPanel,
    Console,
    Editor,
  },
};
</script>


<style scoped>
    .container {
        padding: 0 0 0 0
    }

    .v-tabs__div{
      text-transform: none;
    }

    .drawerSideActive::before {
      background-color: currentColor;
    }
</style>
