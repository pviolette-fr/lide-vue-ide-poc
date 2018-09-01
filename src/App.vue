<template>
  <v-app
    class="h-screen"
    :dark="options.useDarkTheme"
  >
    <v-toolbar
    >
      <v-toolbar-side-icon @click="openDrawer"/>
      <v-toolbar-title>LIDE - Université d'Angers</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items class="hidden-sm-and-down"/>
    </v-toolbar>

    <v-navigation-drawer
      temporary
      absolute
      v-model="drawerOpen"
    >
      <v-toolbar
        flat
        class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>John Smith</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list
        class="pt-0"
        dense>
        <v-divider/>

        <v-list-tile
          v-for="(files, key) in files"
          :key="key"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ key }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-container
      fill-height
      fluid
    >
      <v-layout column>
        <v-layout
          :row="consoleSide"
          :column="!consoleSide"
          xs12>
          <!-- Editor -->
          <v-flex
            d-flex
            fill-height>
            <v-layout
              column
              fill-height>
              <v-tabs
                v-model="activeFile"
                show-arrows
              >
                <v-tab
                  v-for="(session, index) in sessions"
                  :key="index"
                >
                  {{ session.name }}
                </v-tab>
              </v-tabs>
              <editor
                ref="editor"
                class="text-lg"
                :session="activeSession"
                :line-highlight="options.lineHighlight"
              />
            </v-layout>
          </v-flex>
          <v-flex
            xs6
            d-flex
            v-if="showConsole"
          >
            <v-layout
              column
            >
              <console
                :show-prompt="showConsolePrompt"
                :buffer="consoleBuffer"
                :input-loading="inputLoading"
                @input="appendLineToBuffer"/>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-toolbar
          dense
        >
          <v-dialog
            v-model="newFile.dialog"
            max-width="500px">
            <v-btn
              slot="activator"
              flat
            >
              <v-icon>fa-file</v-icon>
              <span class="hidden md:inline ml-2">New File</span>
            </v-btn>
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
  </v-app>
</template>
<script>

import Editor from './components/editor.vue';
import fileTypeDetection from './mixins/file-type-detection';
import Console from './components/console.vue';

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
      options: JSON.parse(JSON.stringify(this.userOptions)), // Copy the object
      activeFile: 0,
      sessions,
      console: Object,
      consoleBuffer: '',
      drawerOpen: false,
      showConsole: true,
      isRunning: false,
      isRunningLoading: false,
      stopLoading: false,
      inputLoading: false,
      consoleSide: true,
      newFile: {
        dialog: false,
        formValid: true,
        name: '',
      },
    };
  },
  mounted() {
  },
  computed: {
    activeSession() {
      return this.sessions[this.activeFile] ?
        this.sessions[this.activeFile].sessionObject : undefined;
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
  },
  methods: {
    modeForFile(fileName) {
      const lang = this.languageFromFile(fileName);
      return `ace/mode/${lang}`;
    },
    extensionAceModeMatch() {
      return {
        cpp: 'c_cpp',
        c: 'c_cpp',
        h: 'c_cpp',
      };
    },
    appendLineToBuffer(append) {
      this.inputLoading = true;
      setTimeout(() => {
        this.consoleBuffer = this.consoleBuffer.concat(`\n${append}`);
        this.inputLoading = false;
      }, 1000);
    },
    openDrawer() {
      this.drawerOpen = true;
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
    createNewFile() {
      const session = new EditSession(
        '',
        this.modeForFile(this.newFile.name),
      );
      session.setUseSoftTabs(this.userOptions.useSoftTabs);
      session.setUseWrapMode(this.userOptions.useWrapMode);
      this.sessions.push({
        name: this.newFile.name,
        sessionObject: session,
      });
      this.resetNewFileForm();
      this.newFile.dialog = false;
    },
    resetNewFileForm() {
      this.newFile.name = '';
    },
  },
  watch: {
    activeFile(value) {
      console.log(value);
    },
    'options.useSoftTabs': (value) => {
      this.sessions.forEach((session) => {
        session.setUseSoftTabs(value);
      });
    },
    'options.useWrapMode': (value) => {
      this.sessions.forEach((session) => {
        session.setUseWrapMode(value);
      });
    },
  },
  mixins: [fileTypeDetection],
  components: {
    Console,
    Editor,
  },
};
</script>


<style scoped>
    .container {
        padding: 0 0 0 0
    }
</style>
