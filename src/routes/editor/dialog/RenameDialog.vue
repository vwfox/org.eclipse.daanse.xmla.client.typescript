<template>
  <va-modal
      v-model="showModalintern"
      hide-default-actions
  >
    <div class="flex flex-col items-start gap-2">
      <h5 class="va-h5">
        New File:
      </h5>

      <va-input
          v-model="path"
          outline
      />
    </div>

    <div class="flex justify-end mt-2 gap-2">
      <va-button
          preset="secondary"
          color="secondary"
          @click="hide()"
      >
        Cancel
      </va-button>

      <va-button
          @click="ok"
      >
        Ok
      </va-button>
    </div>
  </va-modal>
</template>

<script lang="ts" setup>
import { ref, watch} from "vue";

interface Props {
  modelValue: boolean
}
const showModalintern = ref(false);
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue','name'])
const path = ref('')

watch(()=>props.modelValue,()=>{
  console.log('change');
  console.log(props.modelValue);

  showModalintern.value = props.modelValue;
},{immediate:true})
const hide = ()=>{
  showModalintern.value = false;
  emit('update:modelValue',false)
}
const ok=()=>{
  emit('name',path)
  hide();
}


</script>

<style scoped>

</style>
