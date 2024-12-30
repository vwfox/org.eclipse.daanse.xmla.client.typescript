import {useStoreManager} from "@/composables/storeManager";
import SparqlStoreListItem from "@/plugins/sparql/store/SparqlStoreListItem.vue";
import SparqlStore from "@/plugins/sparql/store/SparqlStore";
import type {Component} from "vue";
import useComposerManager from "@/plugins/charts/composables/ComposerManager";
import OGSTAComposer from "@/plugins/OGCSTAComposer/composer/OGCSTAComposer";
import OGCSTAComposerV from "@/plugins/OGCSTAComposer/composer/OGCSTAComposerV.vue";
import SparqlComposer from "@/plugins/sparql/composer/SparqlComposer";
import SparqlComposerV from "@/plugins/sparql/composer/SparqlComposerV.vue";

export default {
    install: (app) => {
        //app.component(BarChartWidget);
        app.component("SparqlStoreListItem", SparqlStoreListItem);

        useStoreManager().registerStoreType(SparqlStore,SparqlStoreListItem as unknown as Component);

        useComposerManager().registerComposer(SparqlComposer,SparqlComposerV as unknown as Component,SparqlStore.TYPE)
    }
};
