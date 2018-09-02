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
              :active-file-index="activeFile"
              @file-selected="selectFile"
              @submit-new-file="submitNewFile"
              @duplicate-file="duplicateFile"
              @remove-file="removeSession"
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
                    {{ currentFile.name }}
                  </v-chip>
                </div>
                <div class="flex-grow flex-1">
                  <editor
                    ref="editor"
                    class="text-lg"
                    :session="activeSession"
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
        v-model="newFile.dialog"
        max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">New File</span>
          </v-card-title>
          <v-card-text>
            <v-form
              v-model="newFile.formValid"
              @submit.prevent="createNewFile"
            >
              <v-text-field
                v-model="newFile.name"
                label="Name"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="blue darken-1"
              flat
              @click.native="newFile.dialog = false">Cancel</v-btn>
            <v-btn
              color="blue darken-1"
              flat
              @click.native="createNewFile">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import fileTypeDetection from './mixins/file-type-detection';
import Console from './components/ide/console.vue';
import FilesPanel from './components/app-interface/files-panel';

// eslint-disable-next-line prefer-destructuring
const EditSession = require('brace').EditSession;

export default {
  name: 'App',
  props: {
    files: {
      type: Object,
      required: false,
      default() {
        return {
          'main.cpp': {
            content: '#include <iostream>\n' +
              'using namespace std;\n' +
              '\n' +
              'int main() \n' +
              '{\n' +
              '    cout << "Hello, World!";\n' +
              '    return 0;\n' +
              '}',
          },
          'header.h': {
            content: '#define VAR 3',
          },
        };
      },
    },
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
    const sessions = Object.keys(this.files).map((fileName) => {
      const session = new EditSession(
        this.files[fileName].content,
        this.modeForFile(fileName),
      );
      session.setUseSoftTabs(this.userOptions.useSoftTabs);
      session.setUseWrapMode(this.userOptions.useWrapMode);
      return {
        name: fileName,
        sessionObject: session,
      };
    });
    return {
      drawerOpen: true,
      availableThemes: [
        { label: 'Tomorrow Night', value: 'tomorrow_night' },
        { label: 'twilight', value: 'twilight' },
        { label: 'clouds', value: 'clouds' },
        { label: 'Crimson', value: 'crimson_editor' },
        { label: 'Ambiance', value: 'ambiance' },
      ],
      activeFile: 0,
      sessions,
      // Console
      consoleBuffer: '',
      showConsole: true,
      isRunning: false,
      isRunningLoading: false,
      stopLoading: false,
      inputLoading: false,
      consoleSide: true,
      // New file form
      newFile: {
        dialog: false,
        formValid: true,
        name: '',
      },
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
    activeSession() {
      return this.sessions[this.activeFile] ?
        this.sessions[this.activeFile].sessionObject : undefined;
    },
    currentFile() {
      return this.sessions[this.activeFile];
    },
    toggleConsoleText() {
      if (this.showConsole) {
        return 'Hide Console';
      }
      return 'Show Console';
      // return 'Console';
    },
    showConsolePrompt() {
      return !this.isRunning;
    },
    fileNameList() {
      return this.sessions.map(session => session.name);
    },
  },
  methods: {
    selectFile(index) {
      this.activeFile = index;
    },
    submitNewFile({ name, content }) {
      this.addFile(name, content);
    },
    modeForFile(fileName) {
      const lang = this.languageFromFile(fileName);
      return `ace/mode/${lang}`;
    },
    extensionAceModeMatch() {
      return {
        cpp: 'c_cpp',
        c: 'c_cpp',
        h: 'c_cpp',
        js: 'javascript',
      };
    },
    splitFileName(fileName) {
      const regex = /(.*)\.([0-9a-z]+)$/gi;
      const matches = regex.exec(fileName);
      let baseName = fileName;
      let ext = '';
      if (matches !== null) {
        // eslint-disable-next-line prefer-destructuring
        baseName = matches[1];
        // eslint-disable-next-line prefer-destructuring
        ext = matches[2];
      }
      return { baseName, ext };
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
    addFile(name, content) {
      const session = new EditSession(
        content,
        this.modeForFile(name),
      );
      session.setUseSoftTabs(this.userOptions.useSoftTabs);
      session.setUseWrapMode(this.userOptions.useWrapMode);
      this.sessions.push({
        name,
        sessionObject: session,
      });
    },
    createNewFile() {
      this.addFile(this.newFile.name, ''); // TODO content from template
      this.activeFile = this.sessions.length - 1;
      this.resetNewFileForm();
      this.newFile.dialog = false;
    },
    resetNewFileForm() {
      this.newFile.name = '';
    },
    duplicateFile(index) {
      const newEditSession = new EditSession(
        this.sessions[index].sessionObject.getValue(),
        this.modeForFile(this.sessions[index].name),
      );
      const { baseName, ext } = this.splitFileName(this.sessions[index].name);
      this.sessions.splice(index + 1, 0, {
        sessionObject: newEditSession,
        name: `${this.generateNewFileName(baseName)}.${ext}`,
      });
    },
    generateNewFileName(base = 'New File') {
      let tryCount = 1;
      const callback = session => base + tryCount === session.name;
      while (this.sessions.find(callback)) {
        tryCount += 1;
      }
      return base + tryCount;
    },
    removeSession(index) {
      this.$nextTick(() => {
        this.sessions.splice(index, 1);
        if (this.activeFile >= this.sessions.length) {
          this.activeFile = this.sessions.length - 1;
        }
      });
    },
    openIDEConfiguration() {
      this.ideConfigDialog = true;
    },
    openFileForm() {
      this.newFile.dialog = true;
    },
    onImportFileButtonClick() {
      this.$refs.importFileInput.click();
    },
    onImportFileChange($event) {
      const files = $event.target.files || $event.dataTransfer.files;
      if (files) {
        if (files.length > 0) {
          this.addImportedFile(files[0]);
        }
      }
    },
    /**
     * @param {File} file
     */
    addImportedFile(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.addFile(file.name, reader.result);
        this.activeFile = this.sessions.length - 1;
      };
      reader.readAsText(file);
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
  mixins: [fileTypeDetection],
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

    .drawer-active-file .v-list__tile__title {
      font-weight: bold;
    }

    .drawerSideActive::before {
      background-color: currentColor;
    }
</style>
