<template>
  <div>
    <v-list
      dense>
      <v-subheader>Files</v-subheader>
      <v-list-tile
        v-for="(fileName, index) in filesName"
        :key="index"
        :class="{ 'drawer-active-file' : activeFileIndex === index}"
        @click="selectActiveFile(index)"
      >
        <v-list-tile-action><v-icon size="12px">fa-file</v-icon></v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ fileName }}</v-list-tile-title>
        </v-list-tile-content>
        <v-menu
          offset-y
        >
          <v-btn
            slot="activator"
            fab
            flat
            small
          ><v-icon>more_vert</v-icon></v-btn>
          <v-list dense>
            <v-list-tile
              @click="removeFile(index)"
            >
              <v-list-tile-title>Delete</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click="duplicateFile(index)"
            >
              <v-list-tile-title>Duplicate</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-list-tile>
    </v-list>
    <v-list dense>
      <v-divider/>
      <v-list-tile @click="openFileForm">
        <v-list-tile-action><v-icon>fa-plus</v-icon></v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>New File</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="onImportFileButtonClick">
        <v-list-tile-action><v-icon>fas fa-file-import</v-icon></v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Import</v-list-tile-title>
        </v-list-tile-content>
        <input
          class="absolute"
          style="top: -999999px"
          type="file"
          accept="*"
          :multiple="false"
          ref="importFileInput"
          @change="onImportFileChange">
      </v-list-tile>
    </v-list>
    <!-- New File Form Dialog -->
    <v-dialog
      v-model="newFileForm.show"
      max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">New File</span>
        </v-card-title>
        <v-card-text>
          <v-form
            v-model="newFileForm.formValid"
            @submit.prevent="submitCreateNewFile"
          >
            <v-text-field
              v-model="newFileForm.name"
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
            @click.native="newFileForm.show = false">Cancel</v-btn>
          <v-btn
            color="blue darken-1"
            flat
            @click.native="submitCreateNewFile">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    filesName: {
      type: Array,
      required: true,
    },
    activeFileIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newFileForm: {
        show: false,
        name: '',
        formValid: false,
      },
    };
  },
  methods: {
    selectActiveFile(index) {
      this.$emit('file-selected', index);
    },
    removeFile(index) {
      this.$emit('remove-file', index);
    },
    duplicateFile(index) {
      this.$emit('duplicate-file', index);
    },
    submitCreateNewFile() {
      // TODO validation
      this.$emit('submit-new-file', { name: this.newFileForm.name, content: '' });
      this.newFileForm.show = false;
      this.resetNewFileForm();
    },
    onImportFileButtonClick() {
      this.$refs.importFileInput.click();
    },
    onImportFileChange($event) {
      const files = $event.target.files || $event.dataTransfer.files;
      if (files) {
        if (files.length > 0) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = () => {
            this.$emit('sumbmit-new-file', { name: file.name, content: reader.result });
          };
          reader.readAsText(file);
        }
      }
    },
    openFileForm() {
      this.newFileForm.show = true;
    },
    resetNewFileForm() {
      this.newFileForm.name = '';
    },

  },
  name: 'FilesPanel',
};
</script>

<style scoped>
    .drawer-active-file .v-list__tile__title {
        font-weight: bold;
    }
</style>
