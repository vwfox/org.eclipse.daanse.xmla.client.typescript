<template>
  <NavBarDash></NavBarDash>
  <div class="app-container" id="plane">
    <div
      class="app-layout-container bg grey padd"
      :class="{ editDisabled: !editEnabled }"
    >
      <div>
        <va-button preset="primary" class="ml-2" @click="toggleEdit">
          Toggle edit
        </va-button>
        <va-button preset="primary" class="ml-2" @click="saveLayout">
          Save layout
        </va-button>
        <va-button preset="primary" class="ml-2" @click="loadLayout">
          Load layout
        </va-button>
        <va-button preset="primary" class="ml-2" @click="openStoreList">
          Open Store List
        </va-button>
        <va-button preset="primary" class="ml-2" @click="addPlainTextWidget">
          Add test component
        </va-button>
        <va-button preset="primary" class="ml-2" @click="addPlainListWidget">
          Add test list component
        </va-button>
        <va-button preset="primary" class="ml-2" @click="addImageWidget">
          Add image
        </va-button>
        <va-button preset="primary" class="ml-2" @click="addTextWidget">
          Add text
        </va-button>
        <va-button preset="primary" class="ml-2" @click="addSvgWidget">
          Add SVG
        </va-button>
        <va-button
          preset="primary"
          class="ml-2"
          @click="addRepeatableSvgWidget"
        >
          Add Repeatable SVG
        </va-button>
        <va-button preset="primary" class="ml-2" @click="loadDemo">
          Load demo
        </va-button>
      </div>
      <div class="main-section">
        <template v-for="widget in customWidgets" :key="widget.id">
          <div
            :class="`${widget.id} dashboard-item-container`"
            :style="getInitialStyle(widget.id)"
            :ref="widget.id"
          >
            <va-dropdown
              :trigger="editEnabled ? 'right-click' : 'none'"
              :auto-placement="false"
              placement="right-start"
              cursor
            >
              <template #anchor>
                <div class="dashboard-item">
                  <!-- <smart-widget
                    title="Kinder pro Jahr"
                    fullscreen
                    class="widget-content"
                  > -->

                  <Suspense>
                    <template #fallback>
                      <div>Loading...</div>
                    </template>
                    <!-- :storeId="widget.storeId" -->

                    <!--<WidgetWrapper :ref="`${widget.id}_wrapper`">-->

                    <component
                      :is="enabledWidgets[widget.component]"
                      :ref="widgetRegistry.register"
                      :id="widget.id"
                      :component="widget.component"
                      :initialState="widget.state"
                      :children="widget.children"
                    ></component>
                    <!--</WidgetWrapper>-->
                  </Suspense>
                  <!-- </smart-widget> -->
                  <!--<DashboardControls
                    v-if="true||editEnabled"
                    @openSettings="openSettings(`${widget.id}`, 'Widget')"
                    @deleteWidget="deleteWidget(widget.id)"
                  />-->
                </div>
              </template>

              <va-dropdown-content>
                <div class="dropdown-buttons-container">
                  <va-button @click="moveUp(widget.id)">Move up</va-button>
                  <va-button @click="moveDown(widget.id)">Move down</va-button>
                  <va-button @click="moveToTop(widget.id)"
                    >Move to top</va-button
                  >
                  <va-button @click="moveToBottom(widget.id)">
                    Move to bottom
                  </va-button>
                </div>
              </va-dropdown-content>
            </va-dropdown>
          </div>
          <Moveable
            v-bind:target="[`.${widget.id}`]"
            v-bind:draggable="editEnabled"
            v-bind:resizable="editEnabled"
            v-bind:useResizeObserver="true"
            v-bind:useMutationObserver="true"
            :throttleDrag="throttleDrag"
            :edgeDraggable="edgeDraggable"
            :startDragRotate="startDragRotate"
            :throttleDragRotate="throttleDragRotate"
            :keepRatio="keepRatio"
            :throttleResize="throttleResize"
            :renderDirections="renderDirections"
            :rotatable="editEnabled"
            :throttleRotate="throttleRotate"
            :rotationPosition="rotationPosition"
            @drag="(e)=>{drag(widget.id,e)}"
            @resize="(e)=>{resize(widget.id,e)}"
            @rotate="(e)=>{rotate(widget.id,e)}"
            :snappable="true"
            :snapGridWidth="20"
            :snapGridHeight="20"
            :ref="
              (el) =>
                widgetRegistry.registerWithID(el as any, widget.id + '_control')
            "
            :style="getMovableControlStyles(widget.id)"
          />
        </template>
        <vue-selecto
          :ref="(el)=> widgetRegistry.registerWithID(el as any, 'selecto')"
          :selectableTargets="['.dashboard-item-container','.group']"
          :dragContainer="dragContainer"
          :hitRate="40"
          :selectFromInside="false"
          :selectByClick="true"
          :toggleContinueSelect="'shift'"
          :onSelect="onSelect"
        />

        <div
          class="d_3 dashboard-item-container"
          :style="getInitialStyle('d_3')"
          ref="d_3"
        >
          <va-dropdown
            :trigger="editEnabled ? 'right-click' : 'none'"
            :auto-placement="false"
            placement="right-start"
            cursor
          >
            <template #anchor>
              <div class="dashboard-item">
                <DashboardControls
                  @openSettings="openSettings('test', null)"
                  v-if="editEnabled"
                />
                <ButtonControl class="widget-content" ref="test" />
              </div>
            </template>

            <va-dropdown-content>
              <div class="dropdown-buttons-container">
                <va-button @click="moveUp('d_3')">Move up</va-button>
                <va-button @click="moveDown('d_3')">Move down</va-button>
                <va-button @click="moveToTop('d_3')">Move to top</va-button>
                <va-button @click="moveToBottom('d_3')">
                  Move to bottom
                </va-button>
              </div>
            </va-dropdown-content>
          </va-dropdown>
        </div>
        <Moveable
          v-bind:target="['.d_3']"
          v-bind:draggable="editEnabled"
          v-bind:resizable="editEnabled"
          v-bind:useResizeObserver="true"
          v-bind:useMutationObserver="true"
          @drag="drag('d_3', $event)"
          @resize="resize('d_3', $event)"
          :snappable="true"
          :snapGridWidth="20"
          :snapGridHeight="20"
          ref="d_3_control"
          :style="getMovableControlStyles('d_3')"
        >
        </Moveable>
      </div>
    </div>
    <Sidebar v-model:custom-widgets="customWidgets" :selection="selection" @innerSelect="onSelect"></Sidebar>
  </div>
</template>

<script setup lang="ts">

import NavBarDash from "./NavBarDash.vue";
import ChartWidget from "@/components/Charts/ChartWidgetModule.vue";
import ChartPolarWidget from "@/components/Charts/ChartPolarWidgetModule.vue";
import DashboardControls from "@/components/Dashboard/DashboardControls.vue";
import {
  ref,
  markRaw,
  getCurrentInstance,
  onMounted,
  inject,
  nextTick,
  type Ref,
} from "vue";
import ButtonControl from "@/components/Controls/Button/ButtonControl.vue";
import InputControl from "@/components/Controls/Input/InputControl.vue";
import PlainTextWidget from "@/components/Widgets/PlainText/PlainTextWidget.vue";
import ImageWidget from "@/components/Widgets/Image/ImageWidget.vue";
import TextWidget from "@/components/Widgets/Text/TextWidget.vue";
import ListWidget from "@/components/Widgets/List/ListWidget.vue";
import SvgWidget from "@/components/Widgets/Svg/SvgWidget.vue";
import Group from "@/components/Widgets/Group/GroupWidget.vue";
import RepeatableSvgWidget from "@/components/Widgets/RepeatableSvg/RepeatableSvgWidget.vue";
import { useStoreManager } from "@/composables/storeManager";
import Moveable from "vue3-moveable";
import SidebarSettings from "@/components/Sidebar/SidebarSettings.vue";
import { useDatasourceManager } from "@/composables/datasourceManager";
import Extended, {
  type Widget,
} from "@/components/Widgets/Extended/ExtendedWidget.vue";
import { useWidgetRegistry } from "@/composables/WidgetRegistry";

import VueSelecto from "vue3-selecto";
import draggable from "vuedraggable";
import type VueMoveable from "vue3-moveable/dist/Moveable.vue";
import WidgetTree from "@/components/Sidebar/WidgetTree.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
const storeManager = useStoreManager();
const dsManager = useDatasourceManager();
const widgetRegistry = useWidgetRegistry();

const customWidgets = ref([] as any[]);
const editEnabled = ref(false);
const timestamp = ref(Date.now());
const showSidebar = ref(false);
const settingsSection = ref(null as any);
const test = ref(null);
const test1 = ref(null);

const EventBus = inject("customEventBus") as any;

const enabledWidgets = {
  ImageWidget,
  TextWidget,
  PlainTextWidget,
  SvgWidget,
  RepeatableSvgWidget,
  Extended,
  Group,
};
const maxHeight = "auto";
const minWidth = "auto";
const minHeight = "auto";
const throttleDrag = 1;
const edgeDraggable = false;
const startDragRotate = 0;
const throttleDragRotate = 0;
const keepRatio = false;
const throttleResize = 1;
const renderDirections = ["nw","n","ne","w","e","sw","s","se"];
const throttleRotate = 0;
const rotationPosition = "top";
const targetRef = ref(null);
const selection = ref<string[]>([]);

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

let layout = {
  d_1: {
    x: 0,
    y: 0,
    width: 400,
    height: 400,
    z: 3001,
  },
  d_2: {
    x: 410,
    y: 0,
    width: 400,
    height: 400,
    z: 3000,
  },
  d_3: {
    x: 0,
    y: 430,
    width: 100,
    height: 40,
    z: 3000,
  },
  d_4: {
    x: 410,
    y: 410,
    width: 400,
    height: 400,
    z: 3000,
  },
  d_5: {
    x: 820,
    y: 0,
    width: 400,
    height: 400,
    z: 3000,
  },
  d_6: {
    x: 820,
    y: 410,
    width: 400,
    height: 400,
    z: 3002,
  },
  d_7: {
    x: 1230,
    y: 410,
    width: 200,
    height: 50,
    z: 3000,
  },
};

const addPlainTextWidget = async () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "PlainTextWidget",
    // storeId: store.id,
    caption: "Test",
  });
};

const addPlainListWidget = async () => {
  const stores = Array.from(
    storeManager.getStoreList().value,
    function (entry) {
      return entry[1];
    },
  );
  const store = stores[0];
  console.log(store.id);
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 900,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push(
    markRaw({
      id: id,
      component: ListWidget,
      storeId: store.id,
      caption: "Test",
    }),
  );

  console.log(customWidgets.value);
};

let refs;
onMounted(() => {
  refs = getCurrentInstance();
});

const getInitialStyle = (id) => {
  console.log('getinitioal')
  timestamp.value;
  if (!layout[id]) return {};
  return {
    width: `${layout[id].width}px`,
    height: `${layout[id].height}px`,
    transform: `translate(${layout[id].x}px, ${layout[id].y}px)`,
    "z-index": layout[id].z,
  };
};

const getMovableControlStyles = (id) => {
  timestamp.value;
  return {
    "z-index": layout[id].z,
  };
};

const drag = (id, e) => {
  console.log("drag", e.transform);

  layout[id]=e.target.style;

  e.target.style.transform = e.transform;
  console.log(e.transform);
};

const resize = (id, e) => {
  e.target.style.width = `${e.width}px`;
  e.target.style.height = `${e.height}px`;

  layout[id]=e.target.style;
  e.target.style.transform = e.drag.transform;
};
const rotate = (id, e) => {
  layout[id]=e.target.style;
  e.target.style.transform = e.drag.transform;
};

const moveUp = (id) => {
  layout[id].z = layout[id].z + 1;

  const refArr = refs.ctx.$refs[id];
  const ref = Array.isArray(refArr) ? refArr[0] : refArr;

  ref.style["z-index"] = layout[id].z;
  refs.ctx.$refs[`${id}_control`].$el.style["z-index"] = layout[id].z;
};

const moveDown = (id) => {
  layout[id].z = layout[id].z - 1;

  const refArr = refs.ctx.$refs[id];
  const ref = Array.isArray(refArr) ? refArr[0] : refArr;

  ref.style["z-index"] = layout[id].z;
  refs.ctx.$refs[`${id}_control`].$el.style["z-index"] = layout[id].z;
};

const moveToBottom = (id) => {
  const obj = Object.entries(layout);
  const res = obj.reduce(function (p, v) {
    return p[1].z < v[1].z ? p : v;
  }, obj[0]);

  if (id !== res[0]) {
    layout[id].z = res[1].z - 1;

    const refArr = refs.ctx.$refs[id];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.style["z-index"] = layout[id].z;
    refs.ctx.$refs[`${id}_control`][0].$el.style["z-index"] = layout[id].z;
  }
};

const moveToTop = (id) => {
  const obj = Object.entries(layout);
  const res = obj.reduce(function (p, v) {
    return p[1].z > v[1].z ? p : v;
  }, obj[0]);

  if (id !== res[0]) {
    layout[id].z = res[1].z + 1;

    const refArr = refs.ctx.$refs[id];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.style["z-index"] = layout[id].z;
    refs.ctx.$refs[`${id}_control`].$el.style["z-index"] = layout[id].z;
  }
};

const toggleEdit = () => {
  editEnabled.value = !editEnabled.value;
  //manuallyUpdateLayout();
  //console.log(widgetRegistry.getById('id_122_group_wrapper_control'));
};

const manuallyUpdateLayout = () => {
  timestamp.value = Date.now();
};

const saveLayout = () => {
  localStorage.setItem("testLayout", JSON.stringify(layout));

  const storeState = storeManager.getSerializedState();
  const dsState = dsManager.getSerializedState();

  const widgetsState = {};
  customWidgets.value.forEach((e) => {
    const refArr = refs.ctx.$refs[`${e.id}_component`];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    const refArrWp = refs.ctx.$refs[`${e.id}_wrapper`];
    const refWp = Array.isArray(refArrWp) ? refArrWp[0] : refArrWp;

    const state = ref.getState();
    widgetsState[e.id] = {
      component: e.component,
      caption: e.caption,
      state,
    };
    if (refWp && refWp.getState) {
      const stateWp = refWp.getState();
      widgetsState[e.id + "_wrapper"] = {
        component: e.component,
        caption: e.caption,
        stateWp,
      };
    }
  });

  localStorage.setItem("dsState", dsState);
  localStorage.setItem("storeState", storeState);
  localStorage.setItem("widgetsState", JSON.stringify(widgetsState));

  const tempJson = {
    layout,
    storeState: JSON.parse(storeState),
    dsState: JSON.parse(dsState),
    widgetsState,
  };

  console.log(JSON.stringify(tempJson));
};

const loadDemo = async () => {
  const layoutReq = await fetch("/demo/layout.json");
  const layoutJson = await layoutReq.json();
  console.log(layout);

  layout = layoutJson.layout;

  manuallyUpdateLayout();

  Object.keys(layoutJson.widgetsState).forEach((key) => {
    const e = layoutJson.widgetsState[key];
    customWidgets.value.push({
      id: key,
      component: e.component,
      caption: e.caption,
      // state: e.state,
    });
  });

  dsManager.loadState(layoutJson.dsState);
  storeManager.loadState(layoutJson.storeState, EventBus);

  await nextTick();

  customWidgets.value.forEach((e) => {
    const refArr = refs.ctx.$refs[`${e.id}_component`];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.setState(layoutJson.widgetsState[e.id].state);
    console.log(ref);
  });
};

const loadLayout = async () => {
  const retrievedObject =
    localStorage.getItem("testLayout") || JSON.stringify(layout);
  layout = JSON.parse(retrievedObject);

  manuallyUpdateLayout();
  console.log(layout);

  const dsState = localStorage.getItem("dsState");
  const storeState = localStorage.getItem("storeState");
  const widgetsState = localStorage.getItem("widgetsState");

  const widgetsStateObj = JSON.parse(widgetsState);

  let wrappers = [];

  Object.keys(widgetsStateObj).forEach((key) => {
    const e = widgetsStateObj[key];
    if (key.includes("_wrapper")) {
      wrappers.push(key);
    } else {
      customWidgets.value.push({
        id: key,
        component: e.component,
        caption: e.caption,
        // state: e.state,
      });
    }
  });
  console.log(customWidgets.value);

  dsManager.loadState(JSON.parse(dsState));
  storeManager.loadState(JSON.parse(storeState), EventBus);

  await nextTick();

  customWidgets.value.forEach((e) => {
    const refArr = refs.ctx.$refs[`${e.id}_component`];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;

    ref.setState(widgetsStateObj[e.id].state);
    console.log(ref);
  });
  wrappers.forEach((key) => {
    const e = widgetsStateObj[key];
    const refArr = refs.ctx.$refs[key];
    const ref = Array.isArray(refArr) ? refArr[0] : refArr;
    console.log(e);
    ref.setState(e.stateWp);
  });
};

const openStoreList = () => {
  settingsSection.value = { type: "Stores" };
  showSidebar.value = true;
};



const deleteWidget = (id) => {
  if (
    settingsSection?.value &&
    `${id}_component` === settingsSection.value.id
  ) {
    showSidebar.value = false;
  }
  customWidgets.value = customWidgets.value.filter(
    (widget) => widget.id !== id,
  );
};

const addImageWidget = () => {
  const id = `id_${Date.now()}`;
  //const id = `id_122`;

  layout[id + "_group"] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };
  layout[id + "_group_wrapper"] = {
    x: 0,
    y: 700,
    width: 350,
    height: 250,
    z: 3005,
  };

  layout[id + "_wrapper"] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };
  layout[id + "_component"] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };
  layout[id + "_2_" + "_wrapper"] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };
  layout[id + "_2_" + "_component"] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push({
    id: id + "_group_wrapper",
    component: "Extended",
    children: [
      {
        id: id + "_group",
        component: "Group",
        children: [
          {
            id: id + "_wrapper",
            component: "Extended",
            children: [
              {
                id: id + "_component",
                component: "Image",
                // storeId: store.id,
                caption: "Test",
              },
            ],
          },
          {
            id: id + "_2_" + "_wrapper",
            component: "Extended",
            children: [
              {
                id: id + "_2_" + "_component",
                component: "Image",
                // storeId: store.id,
                caption: "Test",
              },
            ],
          },
        ],
      },
    ],
  });
};

const addGroupWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "Group",
    // storeId: store.id,
    caption: "Test",
  });
};

const addTextWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 150,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "TextWidget",
    caption: "Test",
  });
};

const addSvgWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 300,
    height: 300,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "SvgWidget",
    caption: "Test",
  });
};

const addRepeatableSvgWidget = () => {
  const id = `id_${Date.now()}`;
  layout[id] = {
    x: 0,
    y: 700,
    width: 400,
    height: 400,
    z: 3005,
  };

  customWidgets.value.push({
    id: id,
    component: "RepeatableSvgWidget",
    caption: "Test",
  });
};
const targets = ref([]);
const moveableRef = ref(null);
const selectoRef = ref(null);
const onDragStart = (e) => {
  console.log("dragstart");
  const target = e.inputEvent.target;
  if (
    moveableRef.value!.isMoveableElement(target) ||
    targets.value.some((t) => t === target || t.contains(target))
  ) {
    e.stop();
  }
};
const onSelect = (e) => {
  console.log(e);
  for (let _ref in e.selected) {
    let id = [...e.selected[_ref].classList].find((e) => e.startsWith("id"));
    let movinst = widgetRegistry.getById(id + "_control")as unknown as VueMoveable;
    if(movinst){
      movinst.setState({ "draggable": true, "resizable": true, rotatable:true});
    }
    selection.value.push(id);
    //movinst.forceUpdate();
  }
  for (let _ref in e.removed) {
    let id = [...e.removed[_ref].classList].find((e) => e.startsWith("id"));
    let movinst = widgetRegistry.getById(id + "_control")as unknown as VueMoveable;
    if(movinst) {
      movinst.setState({ "draggable": false, "resizable": false, rotatable:false });
    }
    let pos = selection.value.indexOf(id);
    selection.value.splice(pos,1);

    //movinst.forceUpdate();
  }
  const setup = (e)=>{
    console.log(e);
  };

};
const onSelectEnd = (e) => {
  if (e.isDragStartEnd) {
    e.inputEvent.preventDefault();
    moveableRef.value!.waitToChangeTarget().then(() => {
      moveableRef.value!.dragStart(e.inputEvent);
    });
  }
  targets.value = e.selected;
};
</script>

<style>
.vue-grid-item {
  transition: all 0.2s ease;
  transition-property: left, top, right;
}

.vue-grid-item.no-touch {
  -ms-touch-action: none;
  touch-action: none;
}

.vue-grid-item.cssTransforms {
  transition-property: transform;
  left: 0;
  right: auto;
}

.vue-grid-item.cssTransforms.render-rtl {
  left: auto;
  right: 0;
}

.vue-grid-item.resizing {
  opacity: 0.6;
  z-index: 3;
}

.vue-grid-item.vue-draggable-dragging {
  transition: none;
  z-index: 3;
}

.vue-grid-item.vue-grid-placeholder {
  background: red;
  opacity: 0.2;
  transition-duration: 0.1s;
  z-index: 2;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=);
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
}

.vue-grid-item > .vue-rtl-resizable-handle {
  bottom: 0;
  left: 0;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+);
  background-position: bottom left;
  padding-left: 3px;
  background-repeat: no-repeat;
  background-origin: content-box;
  cursor: sw-resize;
  right: auto;
}

.vue-grid-item.disable-userselect {
  user-select: none;
}

.vue-grid-layout {
  position: relative;
  transition: height 0.2s ease;
}

.vue-grid-layout {
  background: transparent;
}

.vue-grid-layout .smartwidget {
  height: inherit;
  width: inherit;
}

.vue-grid-layout .smartwidget.smartwidget-fullscreen {
  height: 100%;
  width: 100%;
}

.smart-widget__loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: #ffffffe6;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.smart-widget__loading-mask .loading-spinner {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
}

.smart-widget__loading-mask .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
}

.smart-widget__loading-mask .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #5282e4;
  stroke-linecap: round;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  to {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}

.collapse-transition[data-v-5f8fde58] {
  transition:
    0.3s height ease-in-out,
    0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}

.vue-grid-item {
  touch-action: none;
  box-sizing: border-box;
}

.vue-grid-item.vue-grid-placeholder {
  background: #7cbeff;
  opacity: 0.2;
  transition-duration: 0.1s;
  z-index: 2;
  user-select: none;
}

body.no-overflow[data-v-059e0ffc] {
  overflow: hidden;
  position: fixed;
  width: 100%;
}

.smartwidget[data-v-059e0ffc] {
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 2px #0000000d;
  border: 1px solid #ebeef5;
  width: 100%;
  transition: 0.3s;
}

.smartwidget.is-always-shadow[data-v-059e0ffc] {
  box-shadow: 0 0 10px #e9e9e9;
}

.smartwidget.is-hover-shadow[data-v-059e0ffc]:hover {
  box-shadow: 0 0 10px #e9e9e9;
}

.smartwidget.is-never-shadow[data-v-059e0ffc] {
  box-shadow: 0 1px 2px #0000000d;
}

.smartwidget .widget-header[data-v-059e0ffc] {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.smartwidget .widget-header .widget-header__title[data-v-059e0ffc] {
  display: inline-block;
  position: relative;
  width: auto;
  margin: 0;
  font-weight: normal;
  letter-spacing: 0;
  align-items: center;
  font-size: 16px;
}

.smartwidget .widget-header .widget-header__subtitle[data-v-059e0ffc] {
  font-size: 12px;
  color: #777;
  margin-left: 10px;
}

.smartwidget .widget-header .ellis[data-v-059e0ffc] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.smartwidget .widget-header .widget-header__prefix[data-v-059e0ffc] {
  background: #0076db;
  width: 2px;
  height: 16px;
  margin-left: 10px;
}

.smartwidget .widget-header .widget-header__toolbar[data-v-059e0ffc] {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  padding: 0;
  margin: 0;
}

.smartwidget .widget-header .widget-header__toolbar a[data-v-059e0ffc] {
  display: inline-block;
  text-decoration: none;
  text-align: center;
  height: 24px;
  line-height: 28px;
  padding: 0;
  margin: 0;
  color: #333;
  min-width: 35px;
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
  border-left: 1px solid rgba(0, 0, 0, 0.09);
}

.smartwidget .widget-body-simple[data-v-059e0ffc] {
  display: flex;
  height: inherit;
  width: inherit;
}

.smartwidget .widget-body-simple .widget-body__content {
  width: 100%;
  height: 100%;
}

.smartwidget .widget-body[data-v-059e0ffc] {
  display: flex;
  flex-direction: column;
  will-change: height;
  position: relative;
  overflow: hidden;
}

.smartwidget .widget-body .widget-body__content {
  flex: 1;
}

.smartwidget .widget-body .widget-body__content.fixed-height[data-v-059e0ffc] {
  overflow-y: scroll;
}

.smartwidget .widget-body .widget-body__footer[data-v-059e0ffc] {
  position: relative;
}

.smartwidget .widget-body .widget-body__footer.has-group[data-v-059e0ffc] {
  left: 0;
  bottom: 0;
  width: 100%;
}

.smartwidget .widget-body.is-collapse[data-v-059e0ffc] {
  transition:
    0.3s height ease-in-out,
    0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}

.smartwidget.smartwidget-fullscreen[data-v-059e0ffc] {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 6666;
}

.smartwidget.smartwidget-fullscreen .widget-header[data-v-059e0ffc] {
  cursor: default;
}

.smartwidget svg.sw-loading[data-v-059e0ffc] {
  animation: rotating 2s linear infinite;
  cursor: not-allowed;
}

.moveable-control.moveable-origin {
  display: none;
}

.va-dropdown__content {
  z-index: 10000000;
}

.app-layout-container.editDisabled .moveable-line {
  /*display: none;*/
}

.va-dropdown__content.va-select-dropdown__content.va-dropdown__content-wrapper {
  z-index: 20000000;
}
</style>
<style scoped lang="scss">
.padd {
  padding: 15px;
}

.app-layout-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 65px;
  gap: 1rem;
}

.main-section {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: 1rem;
  overflow: auto;
}

.dashboard-container {
  flex-grow: 1;
  width: 100%;
  min-height: 100%;
  position: relative;
}

.dashboard-item {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dashboard-item-container {
  position: absolute;
}

.dropdown-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.widget-content {
  position: absolute;
  width: 100%;
  height: 100%;
}

.target {
  width: 100%;
  height: 100%;
}

.layout-center {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  height: 100%;

  h1 {
    font-size: 45px;
    font-weight: 300;
  }
}

.app-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
}

</style>
