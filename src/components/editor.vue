<template>
  <div class="w-full h-full"/>
</template>

<script>
import ace from 'brace';
import 'brace/mode/c_cpp';
import 'brace/theme/twilight';
import 'brace/theme/clouds';
import 'brace/theme/clouds_midnight';
import 'brace/theme/cobalt';
import 'brace/theme/dracula';
import 'brace/theme/tomorrow_night';
import 'brace/theme/crimson_editor';
import 'brace/theme/ambiance';

export default {
  props: {
    session: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default() {
        return null;
      },
    },
    lineHighlight: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      editor: Object,
      beforeContent: '',
    };
  },
  watch: {
    session(value) {
      this.editor.setSession(value);
    },
    lineHighlight(value) {
      this.editor.setHighlightActiveLine(value);
    },
    theme(value) {
      this.editor.setTheme(`ace/theme/${value}`);
    },
  },
  mounted() {
    this.editor = ace.edit(this.$el);
    this.editor.setSession(this.session);
    if (this.theme) {
      this.editor.setTheme(`ace/theme/${this.theme}`);
    }
  },
  name: 'Editor',
};
</script>

<style scoped>

</style>
