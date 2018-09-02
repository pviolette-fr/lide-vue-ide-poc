import ExtensionAceModeMap from '../config/extension-ace-mode';

const { EditSession } = require('brace');

export default {
  props: {
    originalFiles: {
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
    const files = Object.keys(this.originalFiles).map((name) => {
      const session = new EditSession(
        this.originalFiles[name].content,
        this.modeForFile(name),
      );
      session.setUseSoftTabs(this.userOptions.useSoftTabs);
      session.setUseWrapMode(this.userOptions.useWrapMode);
      return {
        name,
        session,
      };
    });

    return {
      files,
      activeFileIndex: 0,
    };
  },
  computed: {
    fileNameList() {
      return this.files.map(file => file.name);
    },
    activeFile() {
      return this.files[this.activeFileIndex];
    },
    activeFileEditSession() {
      return this.activeFile ? this.activeFile.session : undefined;
    },
  },
  methods: {
    /**
     *
     * @param {Number} index
     */
    selectFile(index) {
      this.activeFileIndex = index;
    },
    /**
     * @param {String} name
     * @param {String} content
     */
    addFile(name, content) {
      const session = new EditSession(
        content,
        this.modeForFile(name),
      );
      session.setUseSoftTabs(this.userOptions.useSoftTabs);
      session.setUseWrapMode(this.userOptions.useWrapMode);
      this.files.push({
        name,
        session,
      });
    },
    /**
     * @param {index} index of the file to duplicate
     */
    duplicateFileAtIndex(index) {
      const file = this.files[index];
      if (file) {
        const session = new EditSession(
          this.files[index].session.getValue(),
          this.modeForFile(this.files[index].name),
        );
        const { baseName, ext } = this.splitFileName(this.files[index].name);
        // Put the duplicata after the original
        this.files.splice(index + 1, 0, {
          session,
          name: `${this.generateNewFileName(baseName)}.${ext}`,
        });
      } else {
        console.error('Duplicate file : index not in range', index);
      }
    },
    removeFileAtIndex(index) {
      this.$nextTick(() => {
        this.files.splice(index, 1);
        if (this.activeFileIndex >= this.files.length) {
          this.activeFileIndex = this.files.length - 1;
        }
      });
    },

    // Helpers --------------------------------------------------------------------------
    generateNewFileName(base = 'New File') {
      let tryCount = 1;
      const callback = file => base + tryCount === file.name;
      while (this.files.find(callback)) {
        tryCount += 1;
      }
      return base + tryCount;
    },
    languageFromFile(fileName) {
      if (fileName) {
        const regex = /\.[0-9a-z]+$/i;
        const extensionMatch = fileName.match(regex);
        if (extensionMatch === null) {
          return 'text';
        }
        const extension = extensionMatch[0].slice(1); // Remove the `.`
        return ExtensionAceModeMap[extension] || 'text';
      }
      return 'text';
    },
    modeForFile(fileName) {
      const lang = this.languageFromFile(fileName);
      return `ace/mode/${lang}`;
    },
  },
};
