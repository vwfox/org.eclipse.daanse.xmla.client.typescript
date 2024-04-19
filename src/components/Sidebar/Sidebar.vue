<script setup lang="ts">


import WidgetTree from "@/components/Sidebar/WidgetTree.vue";
import SidebarSettings from "@/components/Sidebar/SidebarSettings.vue";
import { markRaw, ref } from "vue";
import { useWidgetRegistry } from "@/composables/WidgetRegistry";
import StoreList from "@/components/Sidebar/StoreList.vue";
import type VueSelecto from "vue3-selecto";
import type VueMoveable from "vue3-moveable/dist/Moveable.vue";


const value = ref("Widget");
const subvalue = ref("Tree");
const showSidebar = ref(true);
const settingsSection = ref(null as any);

const emits = defineEmits(['innerSelect']);
const props = defineProps(['selection']);
const customWidgets  = defineModel('customWidgets');
const widgetRegistry = useWidgetRegistry();
const openSettings = (id, type = "Control") => {
  console.log('opensettings')
  console.log(id)
  //const refArr = refs.ctx.$refs[id];
  //const ref1 = ref(Array.isArray(refArr) ? refArr[0] : refArr);

  const ref1 = widgetRegistry.getById(id);
  settingsSection.value = {
    type,
    component: ref1,
    id,
  };

};
const selectMovable = (id:string)=>{
  for (let key of widgetRegistry.getAllParentIds(id)){
    console.log(key)
    let potentiallyMovable = (widgetRegistry.getById(key+'_control'));
      if(potentiallyMovable!=undefined){
        let elem = document.querySelector('.'+key);
        console.log(elem);
        let selecto = widgetRegistry.getById('selecto') as VueSelecto|undefined;
        if(selecto && elem){

          let result:any  = (selecto as VueSelecto).setSelectedTargets([elem as HTMLElement]);
          //emits('innerSelect',{selected:[elem as HTMLElement]});
          potentiallyMovable.setState({ "draggable": true, "resizable": true, rotatable:true});
          for (let _ref in result.removed) {
            let id = [...result.removed[_ref].classList].find((e) => e.startsWith("id"));
            let movinst = widgetRegistry.getById(id + "_control")as unknown as VueMoveable;
            if(movinst) {
              movinst.setState({ "draggable": false, "resizable": false, rotatable:false });
            }


            //movinst.forceUpdate();
          }
        }
        break;
      }
    }
};
</script>

<template>
  <va-sidebar  color="#ffffff"  animated="right" width="500px" class="sidebar" id="right_sidebar">
    <VaTabs
      v-model="value"
    >
      <template #tabs>


        <VaTab
          icon="flip_to_front"
          label="Widgets"
          name="widgets"
        >

        </VaTab>
        <VaTab
          icon="books"
          label="Stores"
          name="stores"
        ></VaTab>
      </template>

      <template v-if="value=='widgets'">
      <div id="sidbar_widgets" class="grid abs">
        <div class="overflow_h">
          <VaScrollContainer
            class="max-h-52"
            vertical
          >
            <SidebarSettings

              :settingsSection="settingsSection"

            ></SidebarSettings>
          </VaScrollContainer>
        </div>
        <VaDivider />
        <VaTabs
          v-model="subvalue"
          class="overflow_h rel"
        >
          <template #tabs>


            <VaTab
              icon="flip_to_front"
              label="Tree"
              name="tree"
            >

            </VaTab>

          </template>
        <div  class="overflow_h">
          <VaScrollContainer
            class="max-h-52"
            vertical
          >
            <WidgetTree v-model="customWidgets" :selection="selection" @setup="(id)=>{openSettings(id,'Widget');selectMovable(id);}" ></WidgetTree>
          </VaScrollContainer>
        </div>
        </VaTabs>
      </div>

      </template>
      <template v-else>
        <VaScrollContainer
          class="max-h-52"
          vertical
        >
          <StoreList></StoreList>
        </VaScrollContainer>
      </template>


    </VaTabs>

  </va-sidebar>
</template>

<style scoped lang="scss">
.sidebar {
  z-index: 1000000;
  position:relative;

}
.overflow_h{
  overflow:hidden;
}
.abs{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.rel{
  position:relative;
}
.grid{
  grid-template-rows: 1fr 5px 250px;
  display: grid;
}
</style>
<style lang="scss">
#right_sidebar {
  .va-tabs{
  .rel {
    position: relative;
  }
}
.va-sidebar__menu ,.va-tabs{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
  .va-tabs__content{
    position: absolute;
    top: 35px;
    left: 0;
    right: 0;
    bottom: 0;
  }

}
</style>

