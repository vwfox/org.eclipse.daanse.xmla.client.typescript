<script setup lang="ts" xmlns="http://www.w3.org/1999/html">

import {computed, ref} from "vue";

const props = withDefaults(defineProps<{lines:number}>(),{lines:3});
const maxlines = computed(()=>{
   return (props.lines * 23)+'px';
})
const expanded = ref(false);

</script>

<template>
    <div class="aellipsis" :class="{expanded:expanded}">
        <slot></slot>
    </div>
    <VaButton
    class="mr-6 mb-2"
    preset="secondary"
    hover-behavior="opacity"
    :hover-opacity="0.4"
    size="small"
    @click="expanded=!expanded"
>
    <template v-if="expanded">less </template>
        <template v-else>more</template>
</VaButton>
</template>

<style scoped lang="scss">
 .aellipsis{
     line-height:23px;
     max-height: v-bind(maxlines);
     text-overflow:ellipsis;
     overflow:hidden;
     color: #777777;
     &.expanded{
         max-height:100%;
     }
 }
</style>
