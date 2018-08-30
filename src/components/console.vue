<template>
  <div
    class="flex-col no-wrap overflow-auto p-2 bg-black h-full w-full font-mono text-white"
    @click="giveFocus">
    <span
      class="block"
      v-for="(line, index) in lines"
      :key="index"
    >{{ line }}</span>
    <div class="console-input flex flex-row">
      <div class="font-bold mr-2">{{ prompt }}</div>
      <div>
        <div class="flex flex-row flex-grow h-full">
          <span class="user-input">{{ input }}</span>
          <span
            v-if="hasFocus"
            class="input-cursor bg-white ml-1 h-full"
            style="width: 10px"/>
        </div>
      </div>
    </div>
    <input
      v-model="input"
      ref="consoleInput"
      type="text"
      style="position: absolute; top: -168464px;"
      @keyup.enter="validateInput"
      @focus="hasFocus=true"
      @blur="hasFocus=false"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      hasFocus: false,
    };
  },
  props: {
    prompt: {
      type: String,
      default() {
        return '>';
      },
    },
    buffer: {
      type: String,
      default() {
        return 'some data' +
          '\nsome other data';
      },
    },
  },
  computed: {
    lines() {
      return this.buffer.split(/\n/);
    },
  },
  methods: {
    giveFocus() {
      console.log('focus');
      this.$refs.consoleInput.focus();
    },
    validateInput() {
      this.$emit('input', this.input);
      // this.buffer = this.buffer.concat(`\n${this.input}`);
      this.input = '';
    },
  },
  name: 'Console',
};
</script>

<style scoped>
    .input-cursor {
        animation: colorblink 1s infinite;
    }
    @keyframes colorblink {
        0% {background-color: rgba(0,0,0,0)}
        50% {background-color: white}
    }
</style>
