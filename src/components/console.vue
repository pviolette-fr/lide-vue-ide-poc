<template>
  <div
    class="bg-black h-full px-2 py-1 font-mono text-white"
    @click="giveFocus">
    <p
      v-for="(line, index) in lines"
      :key="index"
      class=""
      v-text="line"/>
    <div class="relative m-w-full">
      <!--<div-->
      <!--class="font-bold mr-2 "-->
      <!--v-if="showPrompt">-->
      <!--{{ prompt }}-->
      <!--</div>-->
      <input
        v-model="input"
        ref="consoleInput"
        type="text"
        class="w-full bg-grey-darkest p-2"
        @keyup.enter="validateInput"
        @focus="hasFocus=true"
        @blur="hasFocus=false"
        title="console-input">

      <div
        v-if="inputLoading"
        class="absolute mx-2"
        style="right: 0px; top:0px">
        <i class="fas fa-sync fa-spin"/>
      </div>
    </div>

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
    showPrompt: {
      type: Boolean,
      default() {
        return true;
      },
    },
    inputLoading: {
      type: Boolean,
      default() {
        return false;
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
