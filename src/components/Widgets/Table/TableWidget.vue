<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { parse } from "csv-parse/browser/esm/sync";
import {onMounted, ref, computed, inject, watch} from "vue";
import TableWidgetSettings, {type ITableSettings} from "@/components/Widgets/Table/TableWidgetSettings.vue";
import type {TinyEmitter} from "tiny-emitter";
import {useSettings} from "@/composables/widgets/settings";
import {useStore} from "@/composables/widgets/store";
import type {Store} from "@/stores/Widgets/Store";
import {useSerialization} from "@/composables/widgets/serialization";
import type {Composer, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import useChartDataComposer from "@/plugins/charts/composables/ChartDataComposer";
import useComposerManager from "@/plugins/charts/composables/ComposerManager";
import {useStoreManager} from "@/composables/storeManager";

const data2 = ref([]);
const headers = ref([]);

const filter = ref("");
const filterByFields = ref([]);

const currentPage = ref(0);
const perPage = ref(10);

const filteredItemsAmount = ref(0);

const dataComposer = useChartDataComposer();

const props = withDefaults(defineProps<ITableSettings>(), {
    pagesize:20,
   composer:[] as Composer<any>[],
    axes: {
        x: {
            text: "X",
            position: "bottom",
            type: "timeseries",
            offsetAfterAutoskip: true,
            backgroundColor: "#fff",
            stacked: false,
            weight: 2,
            reverse: false,
            display: true,
            grid: {
                display: true,
                color: "#ccc",
                thickness: 1,
                tickMarksColor: "#ccc",
            },
            ticks: {
                color: "#000",
                source: "data",
            }
        },
        y: {
            text: "Y",
            position: "left",
            type: "linear",
            backgroundColor: "#fff",
            stacked: false,
            weight: 2,
            reverse: false,
            display: true,
            grid: {
                display: true,
                color: "#ccc",
                thickness: 1,
                tickMarksColor: "#ccc",
            },
            ticks: {
                color: "#000",
            }
        },
    },
}as any);

onMounted(async () => {
  const request = await fetch(
    "https://raw.githubusercontent.com/dsindy/kaggle-titanic/master/data/test.csv",
  );
  const csvContent = await request.text();

  headers.value = parse(csvContent)[0];
  columns.value = headers.value.map((header) => {
    return {
      key: header,
      sortable: true,
    };
  });

  data2.value = [...parse(csvContent, { columns: true })];
  currentPage.value = 1;
  perPage.value = 10;
});

const pagesAmount = computed(() => {
  if (!perPage.value) return 1;
  return Math.ceil(filteredItemsAmount.value / perPage.value);
});

const customFilteringFn = (source, cellData) => {
  if (!filter.value) {
    return true;
  }

  if (filterByFields.value.length >= 1) {
    const searchInCurrentRow = filterByFields.value.some(
      (field) => cellData.column.key === field,
    );
    if (!searchInCurrentRow) return false;
  }

  const filterRegex = new RegExp(filter.value, "i");

  return filterRegex.test(source);
};
const eventbus = inject("customEventBus") as TinyEmitter;
const { settings, setSetting } = useSettings<typeof props>(props);
const { store, data } = useStore<Store>(eventbus);
const { getState } = useSerialization(settings);
const settingsComponent = TableWidgetSettings;
const stores = ref([]);
const setStore =(store:Store)=>{
    console.log('setStore')
    const storeData = useStore<Store>(eventbus,undefined,undefined);
    storeData.setStore(store)
    stores.value.push(storeData)
    return storeData;
};
defineExpose({
    setSetting,
    settings,
    settingsComponent,
    getState,
    store,
    setStore,
});

dataComposer.setComposers(settings.value.composer);
watch(()=>settings.value.composer,(composers)=>{
        if(composers && composers.length>0){
            let InitializedComposerds =[];
            composers.forEach((composer)=>{
                let composerClass = null;
                if((composer as any).store.type){ //not instanciated
                    composerClass = useComposerManager().getComposerForStoreType((composer as any).store.type)
                }
                if (composer instanceof composerClass) {
                    return;
                } else {
                    let composerObj = composer as any;
                    let aCo = new composerClass();

                    let store = useStoreManager().getStore(
                        composerObj.store.id,
                    );
                    let configuredStore = setStore(store as Store);
                    aCo.setStore(configuredStore.store.value);
                    aCo.setData(configuredStore.data);
                    aCo.restoreState(composerObj);

                    InitializedComposerds.push(aCo);
                }

            });

            if (InitializedComposerds.length > 0) {
                setSetting("composer", InitializedComposerds);
            }
            //@ts-ignore
            /* props.composer = InitializedComposerds;

                             let store = useStoreManager().getStore(
                                 composerObj.store.id,
                             );
                             let store2 = setStore(store as Store);
                             csvCo.setStore(store2.store as IStore);
                             csvCo.setData(store2.data);
                             InitializedComposerds.push(csvCo);
                         }
                     }
                 });

                 if (InitializedComposerds.length > 0) {
                     setSetting("composer", InitializedComposerds);
                 }
                 //@ts-ignore
                 /* props.composer = InitializedComposerds;

             settings.value.composer = InitializedComposerds;
             settings.value = settings.value;*/
        }
        dataComposer.setComposers(settings.value.composer);
    },
);
const getTableFromY = computed(()=>{

    const data = dataComposer.getDataForAxesY().value;

    if(data.length === 0) return [];
    let arrOfResults=[];
    const lengthofTable = data[0].data.length;
    let pointer = 0;

    while(pointer<lengthofTable){
        let linebject = {};

        data.forEach(axis=>{
            linebject[axis.title] = axis.data[pointer].y;
        });
        arrOfResults.push(linebject);
        pointer++;
    }
    return arrOfResults;

})
const columns = computed(()=>{
    return dataComposer.getDataForAxesY().value.map(e=>e.title);
})
</script>

<template>
  <div class="table_container">
    <div class="filters">
      <VaInput v-model="filter" placeholder="Filter..." />
      <VaSelect
        v-model="filterByFields"
        placeholder="Select filter fields"
        :options="headers"
        value-by="value"
        multiple
      />
    </div>
    <Suspense>
      <va-data-table
        class="table"
        :items="getTableFromY"
        sticky-header
        :per-page="-(-perPage)"
        :current-page="currentPage"
        :filter="filter"
        :filter-method="customFilteringFn"
        @filtered="
          filteredItemsAmount = $event.items.length;
          currentPage = 1;
        "
      />
    </Suspense>
    <div class="pagination">
      <VaInput
        v-model="perPage"
        label="Items per page"
        class="page_input"
        type="number"
      />
      <VaPagination
        v-model="currentPage"
        :pages="pagesAmount"
        :visible-pages="5"
      />
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  flex-grow: 0;
}

.table_container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table_container .pagination {
  flex-grow: 0;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: end;
}

.table_container .pagination .page_input {
  justify-self: start;
}

.table_container .table {
  flex-grow: 1;
  flex-shrink: 1;
}
</style>
