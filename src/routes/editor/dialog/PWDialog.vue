<template>
  <va-modal
      v-model="showModalintern"
      hide-default-actions
  >
    <div class="flex flex-col items-start gap-2">
      <va-input
          v-model="user"
          label="user"
          outline
      />
    </div>
    <div class="flex flex-col items-start gap-2">
      <va-input
          v-model="password"
          label="Password"
          type="password"
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
const password = ref('')
const user = ref('')

watch(()=>props.modelValue,()=>{
  showModalintern.value = props.modelValue;
},{immediate:true})
const hide = ()=>{
  showModalintern.value = false;
  emit('update:modelValue',false)
}
const ok=()=>{
  emit('user',[user.value,password.value])
  hide();
}


</script>

<style scoped>

</style>
