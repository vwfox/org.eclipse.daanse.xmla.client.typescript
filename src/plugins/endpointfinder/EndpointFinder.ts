
import {useMenuItems} from "@/composables/dashboard/menuItems";
import {type Component, type ComponentOptionsMixin, createApp, defineComponent} from "vue";
import EndPointfinderModal from "@/plugins/endpointfinder/modals/EndPointfinderModal.vue";
import {useI18n} from "vue-i18n";
import { mount } from 'mount-vue-component'
import {i18n} from "@/main";
import {useDatasourceManager} from "@/composables/datasourceManager";
import RESTDatasource from "@/dataSources/RestDatasource";
import {useSparQLEndPointManager} from "@/plugins/endpointfinder/sparql/SparqlEndpointRegistry";

export default {
    install: (app) => {
        const { vNode, destroy, el } = mount(EndPointfinderModal as unknown as Component, { props: {  } ,app:app})
        useMenuItems().addMenuItem({

            label: i18n.global.t("MultilevelDashboardNavigation.endpointFinder"),
            preset: "primary",
            condition:"hideEndpointFinder",
            action: async () => {
                    console.log(app)
                    return await vNode.component?.exposed?.run(()=>{});
                },
            icon: "travel_explore",
            priority:30
        })
        //const dsID =useDatasourceManager().initDatasource(RESTDatasource.TYPE,'https://data.europa.eu/sparql','Sparql DataEurope');

        const dsID =useDatasourceManager().initDatasource(RESTDatasource.TYPE,'https://www.govdata.de/sparql','Sparql DataEurope');
        const ds = useDatasourceManager().getDatasource(dsID);
        useSparQLEndPointManager().registerEndpoint(ds);
    }
};
