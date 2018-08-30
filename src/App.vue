<template>
  <v-app
    class="h-screen"
    dark>
    <v-toolbar>
      <v-toolbar-side-icon @click="openDrawer"/>
      <v-toolbar-title>LIDE - Université d'Angers</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>Link One</v-btn>
        <v-btn flat>Link Two</v-btn>
        <v-btn flat>Link Three</v-btn>
      </v-toolbar-items>
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
              <v-list-tile-title>John Leider</v-list-tile-title>
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
          <v-list-tile-action>
            <v-icon>{{ dashboard }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ key }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <div class="flex flex-col md:flex-row h-full">
      <div style="flex: 1.2">
        <div class="flex flex-row">
          <v-tabs
            class="flex-grow"
            v-model="activeFile"
            show-arrows
          >
            <v-tab
              v-for="(file, key) in files"
              :key="key"
            >
              {{ key }}
            </v-tab>
          </v-tabs>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </div>

        <editor
          ref="editor"
          :session="activeSession"
        />
      </div>
      <div
        style="flex: 1">
        <console
          :buffer="consoleBuffer"
          @input="appendLineToBuffer"/>
      </div>
    </div>
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
  },
  data() {
    const sessions = Object.keys(this.files).map(fileName => new EditSession(
      this.files[fileName].content,
      this.modeForFile(fileName),
    ));
    const data = {
      activeFile: 0,
      toggleConsole: true,
      sessions,
      console: Object,
      consoleBuffer: '',
      drawerOpen: false,
    };
    console.log(data);
    return data;
  },
  mounted() {
  },
  computed: {
    activeSession() {
      return this.sessions[this.activeFile];
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
      this.consoleBuffer = this.consoleBuffer.concat(`\n${append}`);
    },
    openDrawer() {
      this.drawerOpen = true;
    },
  },
  watch: {
    activeFile(value) {
      console.log(value);
    },
  },
  mixins: [fileTypeDetection],
  components: { Console, Editor },
};
</script>


<style>
</style>
