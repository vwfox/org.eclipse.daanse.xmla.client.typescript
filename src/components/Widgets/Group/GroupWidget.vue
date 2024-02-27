<script setup lang="ts">
import type {Widget} from "@/components/Widgets/Extended/ExtendedWidget.vue";
import {computed, defineAsyncComponent, onMounted, ref, type Ref} from "vue";
import {useWidgetRegistry} from "@/composables/WidgetRegistry";
import Moveable, {type MoveableRefTargetType} from "vue3-moveable"
const widgetRegistry = useWidgetRegistry();

const props = defineProps({
      component: String
    ,
    id: String,
    children:{
  type:Array<Widget>}
});
const is =
    (child) => {
      console.log('child')
      const part = child.component;
      return defineAsyncComponent<any>(() => import(`@/components/Widgets/${part}/${part}Widget.vue`))
    };

defineExpose({props});
onMounted(()=>{
  console.log('Mounted')
})


const maxWidth = "auto";
        const maxHeight = "auto";
        const minWidth = "auto";
        const minHeight = "auto";
        const draggable = true;
        const throttleDrag = 1;
        const edgeDraggable = false;
        const startDragRotate = 0;
        const throttleDragRotate = 0;
        const resizable = true;
        const keepRatio = false;
        const throttleResize = 1;
        const renderDirections = ["nw","n","ne","w","e","sw","s","se"];
        const rotatable = true;
        const throttleRotate = 0;
        const rotationPosition = "top";
        const targetRef = ref(null);
        const moveableRef = ref(null);
        const onDrag = e => {
            e.target.style.transform = e.transform;
        };
        const onResize = e => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
        };
        const onRotate = e => {
            e.target.style.transform = e.drag.transform;
        };
</script>

<template>
  <div>
    <h1>TEST</h1>



    <div  v-for="child in props.children" class="mov" :key="child.id">
      <div :class="[child.id]" class="mov">
      <component

          :is="is(child)"
          :ref="(el)=>widgetRegistry.registerWithID(el,child.id)"
          :id="child.id"
          :component="child.component"
          :initialState="child.state"

          :children="child.children"
      ></component>
      </div>
    <Moveable
                   :ref="child.id+'_control'"
                  :target="'.'+child.id"
                   :draggable="draggable"
                                   :throttleDrag="throttleDrag"
                                   :edgeDraggable="edgeDraggable"
                                   :startDragRotate="startDragRotate"
                                   :throttleDragRotate="throttleDragRotate"
                                   :resizable="resizable"
                                   :keepRatio="keepRatio"
                                   :throttleResize="throttleResize"
                                   :renderDirections="renderDirections"
                                   :rotatable="rotatable"
                                   :throttleRotate="throttleRotate"
                                   :rotationPosition="rotationPosition"
                                   @drag="onDrag"
                                 @resize="onResize"
                                   @rotate="onRotate"/>
    </div>
  </div>

</template>

<style scoped>

</style>
