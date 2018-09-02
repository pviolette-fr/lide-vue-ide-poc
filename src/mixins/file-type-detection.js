export default {
  methods: {
    languageFromFile(fileName) {
      if (fileName) {
        const regex = /\.[0-9a-z]+$/i;
        const extensionMatch = fileName.match(regex);
        if (extensionMatch === null) {
          return 'text';
        }
        const extension = extensionMatch[0].slice(1); // Remove the `.`
        return this.extensionAceModeMatch()[extension] || 'text';
      }
      return 'text';
    },
  },
};
