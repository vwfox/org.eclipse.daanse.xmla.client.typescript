/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import BarChartWidget from "./widgets/BarChartWidget.vue";

import { enabledWidgets, widgetNames } from "@/components/Widgets";
import { useStoreManager } from "@/composables/storeManager";
import CSVStore from "@/plugins/charts/stores/CSVStore";
import CSVStoreListItem from "@/plugins/charts/stores/CSVStoreListItem.vue";
import useComposerManager from "@/plugins/charts/composables/ComposerManager";
import {CSVComposer} from "@/plugins/charts/impl/CSVComposer";
import CSVComposerV from "@/plugins/charts/widgets/parts/CSVComposerV.vue";
import type {Component} from "vue";
import XMLAComposerV from "@/plugins/charts/widgets/parts/XMLAComposerV.vue";
import {XMLAComposer} from "@/plugins/charts/impl/XMLAComposer";
import {XMLAStore} from "@/stores/Widgets/XMLAStore";



export default {
    install: (app) => {
        app.component(BarChartWidget);
        app.component("CSVStoreListItem", CSVStoreListItem);
        enabledWidgets["BarChartWidget"] = BarChartWidget; //ToDo add register Method on widget registery
        widgetNames.push({ name: "BarChartWidget", label: "BarChartWidget" });

        //const storemanger = container.get<StoreManagerI>(cid.UseStoreManager); // injection via inverserify
        //console.log(storemanger.register(...)) //register Store
        useStoreManager().registerStoreType(CSVStore);
        useComposerManager().registerComposer(CSVComposer,CSVComposerV as unknown as Component,CSVStore.TYPE);
        useComposerManager().registerComposer(XMLAComposer,XMLAComposerV as unknown as Component, XMLAStore.TYPE);


    }
};
