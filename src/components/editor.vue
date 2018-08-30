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
