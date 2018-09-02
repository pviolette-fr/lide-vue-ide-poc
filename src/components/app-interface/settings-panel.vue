<template>
  <div>
    <v-list
      subheader
      two-line
      dense
    >
      <v-subheader>IDE Configuration</v-subheader>
      <v-list-tile>
        <v-list-tile-action>
          <v-switch
            v-model="options.useSoftTabs"
            @change="optionsChange"/>
        </v-list-tile-action>
        <v-list-tile-content @click="options.useSoftTabs = !options.useSoftTabs">
          <v-list-tile-title>Indent With Space</v-list-tile-title>
          <v-list-tile-sub-title>Use soft tabs</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-switch
            v-model="options.useWrapMode"
            @change="optionsChange"/>
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
          @change="optionsChange"
          label="Layout"
          item-text="label"
          item-value="value"
        />
      </v-list-tile>
      <v-divider/>
      <v-subheader>Theme</v-subheader>
      <v-list-tile>
        <v-select
          dense
          :items="availableThemes"
          v-model="options.editorTheme"
          @change="optionsChange"
          label="Editor Theme"
          item-text="label"
          item-value="value"
        />
      </v-list-tile>
    </v-list>
    <div class="px-2 w-full">
      <v-btn
        @click="save"
        color="primary"
        round
        block
        :loading="loading"
      >
        Save
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      options: {
        useSoftTabs: this.value.useSoftTabs,
        useWrapMode: this.value.useWrapMode,
        layoutStacked: this.value.layoutStacked,
        editorTheme: this.value.editorTheme,
      },
      availableThemes: [
        { label: 'Tomorrow Night', value: 'tomorrow_night' },
        { label: 'twilight', value: 'twilight' },
        { label: 'clouds', value: 'clouds' },
        { label: 'Crimson', value: 'crimson_editor' },
        { label: 'Ambiance', value: 'ambiance' },
      ],
    };
  },
  methods: {
    optionsChange() {
      this.$emit('input', this.options);
    },
    save() {
      this.$emit('save', this.options);
    },
  },
  name: 'SettingsPanel',
};
</script>

<style scoped>

</style>
