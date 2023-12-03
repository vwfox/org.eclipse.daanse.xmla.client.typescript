<template>
  <div class="timeline">
    <template v-for="stops in timeline">
<div class="left">
  <slot name="left" :stop="stops"></slot>
</div>
<div class="line">
  <div class="iline"></div>
  <div class="point"></div>
</div>
  <div class="right">
    <slot name="right" :stop="stops"></slot>
  </div>
  </template>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['timeline'])

</script>

<style scoped lang="scss">
.timeline{
  display: grid;
  grid-template-columns: 1fr 25px 1fr;
  align-items: center;
 .line {
   display: grid;
   justify-content: center;
   align-self: stretch;

    .iline{
      width:2px;
      height:100%;
      background-color: #ccc;
    }
   .point {
     width: 8px;
     height: 8px;
     position: absolute;
     left: calc(50% - 4px);
     top: calc(50% - 4px);
     background: #7f7f7f;
     border-radius: 4px;
   }
 }
}
</style>
