<script lang="ts" setup>
import StoreList from "@/components/Sidebar/StoreList.vue";
import SidebarControl from "@/components/Sidebar/SidebarControl.vue";
import SidebarWidget from "@/components/Sidebar/SidebarWidget.vue";

const props = defineProps(["modelValue", "settingsSection"]);
console.log(props.settingsSection);
defineEmits(["update:modelValue"]);
</script>

<template>
  <va-sidebar  color="#ffffff" :modelValue="modelValue" animated="right" width="500px">

    <div class="settings-sidebar">

      <div class="settings-sidebar-content">

        <template v-if="props.settingsSection?.type === 'Stores'">
          <StoreList></StoreList>
        </template>
        <template v-if="props.settingsSection?.type === 'Control'">
          <SidebarControl
            :component="props.settingsSection.component"
            :key="props.settingsSection.id"
          />
        </template>
        <template v-if="props.settingsSection?.type === 'Widget'">
          <div class="sidebar-settings-title">
            <h2 class="mb-2">Widget settings</h2>
          </div>
          <div class="sidebar-settings">
          <SidebarWidget
            :component="props.settingsSection.component"
            :key="props.settingsSection.id"
          />
          </div>
        </template>

      </div>


      <div class="settings-sidebar-actions">
        <va-button @click="$emit('update:modelValue', !modelValue)">
          Close
        </va-button>
      </div>
    </div>

  </va-sidebar>
</template>

<style lang="css">

.settings-sidebar {

  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

  padding-bottom: 20px;
}

.settings-sidebar-content {
  flex-grow: 1;
  width: 100%;
}

.settings-sidebar-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
<style scoped>
.sidebar{
  background-color: white;
}
</style>
