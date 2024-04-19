<script setup lang="ts">
import { useWidgetRegistry } from "@/composables/WidgetRegistry";
import { computed, unref, watch } from "vue";
import draggable from "vuedraggable";

const widgetRegistry = useWidgetRegistry();
const model = defineModel();
const emits = defineEmits(['setup']);
const props  = defineProps<{
  selection?: string[];
}>();
const getIcon = (type: string) => {
  switch (type) {
    case "Extended":
      return "flip_to_front";
    case "Group":
      return "dashboard_customize";
    default:
      return "account_box";
  }
};
const checkMove = function(evt,data) {


  if(evt.added){

    let transferstate = new Map<string,any>();
    widgetRegistry.getAll().forEach((component,key)=>{
      console.log(key);
      console.log(component);

      try{
        transferstate.set(key, component.getState());
      }catch(e){
        console.log(e);
      }

    });
    console.log(transferstate);

    let state = widgetRegistry.getById(evt.added.element)!.getState();
    console.log(state);
   let component = findIdinModel(model.value,evt.added.element,true);
   let target = findIdinModel(model.value,data.id);


    target.children.unshift(component);
    setTimeout(()=>{
      console.log('redefineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
      transferstate.forEach((state, key) => {
        try{
          widgetRegistry.getById(key)?.setState(state);
        }catch(e){
          console.log(e)
        }
      });
    },100)


  }
  }

  const mark = (e)=>{
    document.querySelectorAll('*').forEach(e=>{
      e.classList.remove('select');
    })
    if(e.target){

      let el = e.target.closest('.va-tree-node-root');
        if (el)el.classList.add('select');
    }
  }

const findIdinModel=(_model:any,id:string,extract = false)=>{
  let ret = null;
  for (let key in _model){
    let el = _model[key];
    if(el.id === id){
      if(extract) {
        return _model.splice(key, 1)[0];
      }else {
        return el;
      }

    }
    if(el.children && el.children.length>0){
      ret = findIdinModel(el.children,id,extract);
      if(ret) return ret;
    }
  };
  return null;

};

watch(()=>props.selection, (new_selection,oldValue) => {

  if(new_selection && new_selection.length>0)
  emits('setup',new_selection[0]);
  let el ={target: document.querySelector('#'+new_selection![0])};
  mark(el);
},{deep:true});


</script>

<template>
  <va-tree-view
    :nodes="model"
    :expandAll="true"
    class="tree-view"
  >

    <template #content="node" >
      <draggable
        class="me"
        group="people"
        @change="(evt)=>checkMove(evt,node)"
        :modelValue="[node.id]"

                  :item-key="node.id">
        <template #item="{ element }">
      <div class="item" :id="node.id" :class="{'selected':props.selection!.includes(node.id)}" @click="(e)=>{$emit('setup',node.id);mark(e)}">
        <div>
        <VaIcon class="material-icons">
         {{getIcon(node.component)}}
      </VaIcon>
        {{ node.id }}
      </div>


      </div>
        </template>
      </draggable>
    </template>

  </va-tree-view>
</template>

<style scoped lang="scss">
.item {
  display: flex;
  cursor:pointer;
  &.selected{
    /*background: #a6c4ff;*/
    color: #133370;
    font-weight: bold;
    font-style: italic;
  /*background: #ececec;
  border-radius: 6px;*/
  }
}

</style>
<style lang="scss">
.select{
  background-color: #1333700a;
  border-radius: var(--va-tree-node-border-radius);
  color: #133370;
}
</style>
