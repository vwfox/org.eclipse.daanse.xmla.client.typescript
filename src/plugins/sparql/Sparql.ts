import {useStoreManager} from "@/composables/storeManager";
import SparqlStoreListItem from "@/plugins/sparql/store/SparqlStoreListItem.vue";
import SparqlStore from "@/plugins/sparql/store/SparqlStore";
import type {Component} from "vue";

export default {
    install: (app) => {
        //app.component(BarChartWidget);
        app.component("SparqlStoreListItem", SparqlStoreListItem);

        useStoreManager().registerStoreType(SparqlStore,SparqlStoreListItem as unknown as Component);

    }
};
