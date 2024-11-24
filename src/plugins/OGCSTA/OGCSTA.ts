/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import ThingWidget from './widgets/ThingWidget.vue';

import {enabledWidgets, widgetNames} from "@/components/Widgets";
import {type StoreManagerI, useStoreManager} from "@/composables/storeManager";
import {useDatasourceManager} from "@/composables/datasourceManager";
import {useDataPointRegistry} from "@/plugins/OGCSTA/composables/datapointRegistry";
import STADataSource from "@/plugins/OGCSTA/dataSources/STADataSource";
import StaStore from "@/plugins/OGCSTA/stores/StaStore";
import TLCDataLabelRendererDescription
    from "@/plugins/OGCSTA/widgets/parts/dataLabelRenderer/TLCDataLabelRendererDescription";
import ValueUnitDataLabelRendererDescription
    from "@/plugins/OGCSTA/widgets/parts/dataLabelRenderer/ValueUnitDataLabelRendererDescription";
import OGCSTAStoreItem from "@/components/Stores/ListItems/OGCSTAStoreItem.vue";

export default {

    install: (app) => {
        app.component('OGCSTAStoreItem', OGCSTAStoreItem);
        app.component(ThingWidget);
        enabledWidgets['ThingWidget'] = ThingWidget;  //ToDo add register Method on widget registery
        widgetNames.push({name: "ThingWidget", label: "ThingWidget"});

        const storeMgr = useStoreManager();
        const dataSourceMgr = useDatasourceManager();

        dataSourceMgr.registerDataSource(STADataSource);
        storeMgr.registerStoreType(StaStore);
        useDataPointRegistry().registerDataPointRenderer(new TLCDataLabelRendererDescription())
        useDataPointRegistry().registerDataPointRenderer(new ValueUnitDataLabelRendererDescription())
    }
};
