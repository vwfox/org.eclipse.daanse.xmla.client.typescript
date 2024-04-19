<script lang="ts" setup>
import {computed, defineAsyncComponent, getCurrentInstance, type Ref, ref} from "vue";
import {useWidgetRegistry} from "@/composables/WidgetRegistry";

const props = defineProps(["component"]);
const widgetRegistry = useWidgetRegistry();

const is = computed(
    () => {
      if (!props.component.props || !props.component.props.component) return null;
      const part = props.component.props.component;
      console.log(part)
      return defineAsyncComponent<any>(() => import(`@/components/Widgets/${part}/${part}WidgetSettings.vue`))
    }
);
const aref = (id)=>{
  const refArr  = getCurrentInstance()?.vnode.key as string;
  //console.log(widgetRegistry.getAll())
  const wr = widgetRegistry.getById(id);


  console.log(refArr)
  const ref = Array.isArray(refArr) ? refArr[0] : refArr;
  return wr;
};

</script>

<template>


    <div class="sidebar-settings-content">
      <component
        :is="is"
        :component="aref(props.component.props.id)"
      ></component>
      <!--<SidebarWidget
      v-for="sprops in props.component.props.children"
      :component="aref(sprops.id)"
      :key = "sprops.id"
      ></SidebarWidget>-->
    </div>

</template>

<style lang="css">
.sidebar-settings {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 10px;
  width: 100%;
}

.sidebar-settings-title {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.sidebar-settings-title > h2 {
  font-size: 24px;
  flex-grow: 1;
}

.sidebar-settings-content {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}
</style>
