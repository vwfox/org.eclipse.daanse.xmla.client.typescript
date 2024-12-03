<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useStoreManager } from "../../../composables/storeManager";
import { useDatasourceManager } from "../../../composables/datasourceManager";
import { type Ref, onMounted, ref, watch, computed } from "vue";
import type CSVStore from "@/plugins/charts/stores/CSVStore";
import type SparqlStore from "@/plugins/sparql/store/SparqlStore";
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import type Tab from "@triply/yasgui/build/ts/src/Tab";



const { t } = useI18n();
const storeManager = useStoreManager();
const dslist: Ref<IDatasource[]> = ref([]);
const yasgui = ref(null);
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const item = ref(props.item);
const isExpanded = ref(false);

const dsManager = useDatasourceManager();
const dsmap = dsManager.getDatasourceList();

const clickHeader = () => {
    isExpanded.value = !isExpanded.value;
};
let yasgui2:Yasgui;
let tab:Tab;
const loadingQuery= ref(false);
watch(
    dsmap,
    () => {
        dslist.value = Object.entries(dsmap.value).map(([, ds]) => {
            return { ...ds };
        });
    },
    { deep: true },
);

onMounted(() => {
    dslist.value = Object.entries(dsmap.value).map(([, ds]) => {
        return { ...ds };
    });

    yasgui2 = new Yasgui(yasgui.value,{
        requestConfig: { endpoint: "http://example.com/sparql" },
        copyEndpointOnNewTab: false,
        persistencyExpire:-1,
        autoAddOnInit:false,
        persistenceId:'-1',

        yasqe:{
            showQueryButton:false,
            consumeShareLink:false,
            pluginButtons:()=>undefined,
            persistencyExpire:1,
            tabMode:'sa'
        },
        yasr:{
            plugins:{

            }
        }
    });
     tab=yasgui2.addTab(
        true, // set as active tab
        { /*...Yasgui.Tab.getDefaults()*/...{}, name: "my new tab" }
    );
     if((item.value as SparqlStore).params && (item.value as SparqlStore).params.query){
         tab.setQuery((item.value as SparqlStore).params.query)
     }

    yasgui2.on('query',()=>{
        loadingQuery.value=true;
    })
    yasgui2.on('queryAbort',()=>{
        loadingQuery.value=false;
    })
    yasgui2.on('queryResponse',()=>{
        loadingQuery.value=false;
    })
    tab.on('change',(ev,content)=>{

        (item.value as SparqlStore).updateParam('query',content.yasqe.value)
    });

    updateDataEndpointforQuery();

});


const saveStore = (item) => {
    const store = storeManager.getStore(item.id);
    store.setOptions({
        caption: item.caption,
        requestTemplate: item.requestTemplate,
    });
};

const createDatasource = () => {
    dsManager.initDatasource("REST", "", "");
    updateDataEndpointforQuery();
};

const updateDatasource = (index) => {
    const datasourceToUpdate = dslist.value[index];
    const ds = dsManager.getDatasource(datasourceToUpdate.id);
    if (ds) {
        ds.caption = datasourceToUpdate.caption;
        ds.url = datasourceToUpdate.url;

        if (ds.type !== datasourceToUpdate.type) {
            dsManager.updateDatasource(
                datasourceToUpdate.id,
                datasourceToUpdate.type,
                datasourceToUpdate.caption,
                datasourceToUpdate.url
            );
        }
    }
    updateDataEndpointforQuery();
};



const setSelectedDatasources = (id, currentSelectedItems) => {
    console.log(currentSelectedItems);
    const dsId = currentSelectedItems.map((e) => e.id)[0];
    const store = storeManager.getStore(id);
    store.setDatasource(dsId);
    updateDataEndpointforQuery();
};

const updateEvents = (item) => {
    const store = storeManager.getStore(item.id);
    store.updateEvents(item.events);
};

const getParams = (item) => {
    const params = Object.entries(item.params as { [s: string]: string }).map(
        (e: [string, string]) => ({
            name: e[0],
            value: e[1],
        }),
    );

    return params;
};

const setParamValue = (item, index, value) => {
    const store = storeManager.getStore(item.id);
    const paramName = getParams(item)[index].name;

    store.updateParam(paramName, value);
    console.log(paramName, value);
};

const getSelectedDatasource = (item) => {
    const store = storeManager.getStore(item.id);
    const selectedDatasource = store.datasourceId;

    return dslist.value.filter((e: { id: string }) => {
        return e.id === selectedDatasource;
    });
};

const selection = ref("|");
const headers = ref(false);

const updateDataEndpointforQuery=()=>{

    const ds = (item.value as SparqlStore).getDatasource();

    if(ds){
        tab.setEndpoint(ds.url);
    }else{
        tab.setEndpoint("");
    }


}
const runQuery =()=>{
    tab.query();
}
</script>

<template>
    <div class="store-item-header" @click="clickHeader">
        <va-list-item-label class="store-item-header-text">
            {{ item.caption }}
            <!-- {{ item.id }} -->
        </va-list-item-label>
        <va-icon v-if="!isExpanded" class="material-icons">
            expand_more
        </va-icon>
        <va-icon v-else class="material-icons"> expand_less </va-icon>
    </div>
    <div v-show="isExpanded" class="store-item-content">
        <va-input
            :label="t('SidebarStoreList.caption')"
            v-model="item.caption"
            @blur="saveStore(item)"
        ></va-input>


        <div class="datasource-list">
            <h2>{{ t("SidebarStoreList.dataSourcesTitle") }}</h2>
            <va-button
                class="datasource-list-add-button"
                @click="createDatasource"
            >
                {{ t("SidebarStoreList.addDatasourceButton") }}
            </va-button>
            <va-data-table
                class="table-crud"
                :items="dslist"
                :columns="[{ key: 'caption' }, { key: 'type' }, { key: 'url' }]"
                :model-value="getSelectedDatasource(item)"
                selectable
                select-mode="single"
                @update:model-value="setSelectedDatasources(item.id, $event)"
            >
                <template #cell(caption)="{ rowIndex }">
                    <va-input
                        class="caption-input"
                        @blur="updateDatasource(rowIndex)"
                        v-model="dslist[rowIndex].caption"
                    ></va-input>
                </template>
                <template #cell(type)="{ rowIndex }">
                    <va-select
                        class="type-input"
                        v-model="dslist[rowIndex].type"
                        @update:modelValue="updateDatasource(rowIndex)"
                        :options="
                            Object.keys(dsManager.getDataSourceRegistry())
                        "
                    />
                </template>
                <template #cell(url)="{ rowIndex }">
                    <va-input
                        class="url-input"
                        @blur="updateDatasource(rowIndex)"
                        v-model="dslist[rowIndex].url"
                    ></va-input>
                </template>
            </va-data-table>
        </div>

        <div class="datasource-list">
            <h2>{{ t("SidebarStoreList.storeListItem.params") }}</h2>
            <VaButton
            class="mr-6 mb-2"
            :loading="loadingQuery"
            @click="runQuery"
        >Test

        </VaButton>
            <div ref="yasgui" id="yasgui"> </div>
        </div>



    </div>
</template>
<style lang="scss">
.store-item {
    .flex {
        ul {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
        }
    }
}
.pad {
    padding: 15px 0 25px;
}
.yasgui{
    .autocompleteWrapper {
        display: none !important;
    }
    .tabsList,.controlbar,.errorHeader,.tableControls,.yasr_btn.yasr_external_ref_btn {
        display: none;
    }
}
</style>
