<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps(["component"]) as any;
const opened = ref(false);
console.log(props)
</script>

<template>
  <va-collapse v-model="opened" header="Widget wrapper settings">
    <div class="settings-container">
      <VaDivider class="pad_bottom" orientation="left">
        <span class="px-2">Title</span>
      </VaDivider>
      <va-input v-model="props.component.title" label="Title" />
      <va-input v-model="props.component.titleFontSize" label="Title Font Size" />
      <va-color-input v-model="props.component.titleColor" label="Title Font Color" />

      <VaDivider class="pad_bottom" orientation="center">
        <span class="px-2">Background</span>
      </VaDivider>

      <va-color-input
          autofocus
          label="Background Color"
          class="color-fill"
          v-model="props.component.backgroundColor"
      />
      <VaSlider v-model="props.component.backgroundColor_transparence"
                label="Shadow Color Transparency"
                :min="0"
                :max="255">
        <template #append>
          <VaCounter
              v-model="props.component.backgroundColor_transparence"
              :min="0"
              :max="255"
              class="w-[110px]"
          />
        </template>
      </VaSlider>
      <VaDivider class="pad_bottom" orientation="center">
        <span class="px-2">Border</span>
      </VaDivider>
      <va-input v-model="props.component.borderSize" label="Border Size" />
      <va-color-input
          autofocus
          label="Border Color"
          class="color-fill"
          v-model="props.component.borderColor"
      />
      <va-input v-model="props.component.borderRadius" label="Border Radius" />

      <VaDivider class="pad_bottom" orientation="left">
        <span class="px-2">FullScreen</span>
      </VaDivider>
      <va-checkbox
        v-model="props.component.fullscreen"
        label="Show fullscreen button"
      />
      <VaDivider class="pad_bottom" orientation="left">
        <span class="px-2">Shaddow</span>
      </VaDivider>
    <va-input v-model="props.component.shadow_x" label="Shadow x" />
    <va-input v-model="props.component.shadow_y" label="Shadow y" />
    <va-input v-model="props.component.shadow_blur" label="Shadow Blur" />
    <va-color-input
        autofocus
        label="Shadow Color"
        class="color-fill"
        v-model="props.component.shadow_color"
    />
      <VaSlider v-model="props.component.shadow_transparence"
                label="Shadow Color Transparency"
                :min="0"
                :max="255">
        <template #append>
          <VaCounter
              v-model="props.component.shadow_transparence"
              :min="0"
              :max="255"
              class="w-[110px]"
          />
        </template>
      </VaSlider>
      <VaDivider class="pad_bottom" orientation="left">
        <span class="px-2">Transparence</span>
      </VaDivider>
      <VaSlider v-model="props.component.transparency"
                label="Transparency"
                :min="0"
                :max="1"
                :step="0.1">
        <template #append>
          <VaCounter
              v-model="props.component.transparency"
              :min="0"
              :max="255"
              class="w-[110px]"
          />
        </template>
      </VaSlider>
    </div>


  </va-collapse>
</template>
<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}
.pad_bottom{
  padding-top: 30px;
  padding-bottom: 10px;
}
</style>
