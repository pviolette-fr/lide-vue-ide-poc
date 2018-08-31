<template>
  <div class="w-full h-full"/>
</template>

<script>
import ace from 'brace';
import 'brace/mode/c_cpp';

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
  },
  mounted() {
    this.editor = ace.edit(this.$el);
    this.editor.setSession(this.session);
  },
  name: 'Editor',
};
</script>

<style scoped>

</style>
