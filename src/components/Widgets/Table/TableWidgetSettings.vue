<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->

<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import type StaStore from "@/plugins/OGCSTA/stores/StaStore";
import { useI18n } from "vue-i18n";
import {ref, type Ref, watch, onMounted, toRaw, unref, type Component} from "vue";
import { useStoreManager } from "@/composables/storeManager";
import type { Store } from "@/stores/Widgets/Store";
import type { XMLAStore } from "@/stores/Widgets/XMLAStore";
import type { CollapseState, StyleFields, Config } from "@/@types/widgets";
import type CSVStore from "@/stores/Widgets/CSVStore";
import useComposerManager from "@/plugins/charts/composables/ComposerManager";
import type {Composer, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import {XMLAComposer} from "@/plugins/charts/impl/XMLAComposer";
import XMLAComposerV from "@/plugins/charts/widgets/parts/XMLAComposerV.vue";
import CSVComposerV from "@/plugins/charts/widgets/parts/CSVComposerV.vue";
import Sparql from "@/plugins/sparql/Sparql";
import SparqlComposerV from "@/plugins/sparql/composer/SparqlComposerV.vue";
import type {AxisSettings} from "@/plugins/charts/widgets/BarChartWidgetSettings.vue";
import SparqlComposer from "@/plugins/sparql/composer/SparqlComposer";

export interface ITableSettings {
    pagesize:number,
    composer:Composer<Selector>[];
    axes:{
        x:AxisSettings,
        y:AxisSettings,
        //y2:AxisSettings,
        [key: string]:AxisSettings
    }
}

export interface ITableComponent {
    store: Store | StaStore | CSVStore;
    settings: ITableSettings;
    setSetting: (key: string, value: any) => void;
    setStore: (store: Store | XMLAStore | StaStore) => void;
}


const { t } = useI18n();
const { component } = defineProps<{ component: ITableComponent }>();

const opened: Ref<CollapseState> = ref({
    widgetSection: false,
    storeSection: false,
});

const storeManager = useStoreManager();
let stores: Ref<any[]> = ref([]) as Ref<any[]>;
const requestResult: Ref<string> = ref("");

const getStores = () => {
    const storeList = storeManager.getStoreList();

    stores.value = Array.from(storeList.value.values());
};

const getData = async () => {
    const store = component.store as Store;

    const data = await store.getData();
    requestResult.value = JSON.stringify(data, null, 2);
};

const updateStore = (storeId) => {
    const store = storeManager.getStore(storeId) as Store;
    component.setStore(store);
    getData();
};

onMounted(() => {
    getStores();
    if (component.store) {
        getData();
    }
});

const addComposer = (store: IStore) => {
    console.log("add ");
    const ComposerClass = useComposerManager().getComposerForStoreType(
        store.type,
    );
    const storeData = component.setStore(store as Store);
    if (ComposerClass) {
        const aComposer = new ComposerClass();
        aComposer.setStore(storeData.store);
        aComposer.setData(storeData.data);

        const val = [...toRaw(unref(component.settings.composer))];
        val.push(aComposer);
        component.setSetting("composer", val);
    }
};
</script>

<template>
    <va-collapse v-model="opened.widgetSection" :header="t('SvgWidget.title')">
        <div class="settings-container">


        </div>
    </va-collapse>
    <va-collapse
        v-model="opened.storeSection"
        :header="t('Widgets.storeSettingsTitle')"
    >
        <div class="settings-container">
            <div>
                <VaDropdown>
                    <template #anchor>
                        <VaButton> Add+ </VaButton>
                    </template>

                    <VaDropdownContent>

                        <VaList>
                            <template v-for="store in stores">

                                <VaListItem
                                    v-if="
                                        useComposerManager().isRegistered(
                                            store.type,
                                        )
                                    "
                                    @click="addComposer(store)"
                                >
                                    {{ store.caption }}
                                </VaListItem>
                            </template>
                        </VaList>
                    </VaDropdownContent>
                </VaDropdown>
                <br/>
                <br/>
                <div
                    class="composers"
                    v-for="(composer, i) in component.settings.composer"
                >
                    <template v-if="composer instanceof XMLAComposer">
                        <XMLAComposerV
                            :modelValue="component.settings.composer[i]"
                            :axes="component.settings.axes"
                            :component="component"
                        ></XMLAComposerV>
                    </template>
                    <template v-if="composer instanceof SparqlComposer">
                        <SparqlComposerV
                            :modelValue="component.settings.composer[i]"
                            :axes="component.settings.axes"
                            :component="component"
                        ></SparqlComposerV>
                    </template>
                    <template v-else>
                        <CSVComposerV
                            :modelValue="component.settings.composer[i]"
                            :axes="component.settings.axes"
                            :component="component"
                        ></CSVComposerV>
                    </template>
                </div>
            </div>
        </div>
    </va-collapse>
</template>
<style scoped>
.settings-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}

.input-class-name {
    width: 100px;
}

.color-fill {
    width: 100px;
}

.color-stroke {
    width: 100px;
}

.input-stroke-width {
    width: 50px;
}

.add-button {
    width: 33%;
}
</style>
