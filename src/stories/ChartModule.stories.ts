import type { Meta, StoryObj } from '@storybook/vue3';

import K1 from '../components/K1/K1.vue';
import {useChartStore} from "@/stores/Chart";


import {setup} from '@storybook/vue3';
import {createPinia} from "pinia";
import SOAPClient from "@/plugins/SOAPClient";
import {
    createVuesticEssential,
    createIconsConfig,
    VaButton,
    VaButtonToggle,
    VaSplit,
    VaImage,
    VaModal,
    VaCardTitle,
    VaCardContent,
    VaCardActions,
    VaInput,
    VaNavbar,
    VaNavbarItem,
    VaOptionList,
    VaSelect,
    VaTreeView,
    VaProgressCircle,
    VaChip,
    VaIcon,
    VaCheckbox,
    VaDropdown,
    VaDropdownContent,
    VaButtonGroup,
    VaDivider,
    VaButtonDropdown,
    VaDataTable,
    VaToast,
    VaSidebar,
    VaSidebarItem, VaSidebarItemContent, VaSidebarItemTitle, VaScrollContainer
} from "vuestic-ui";
import {BarElement, CategoryScale, Chart as ChartJS, Colors, Legend, LinearScale, Title, Tooltip,} from "chart.js";
import {useAppSettingsStore} from "@/stores/AppSettings";
import {Bar} from "vue-chartjs";


setup(async (app) => {
    const pinia = createPinia();
    pinia.use(SOAPClient);
    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
        Colors,
    );
    app.use(pinia);
    app.use(
        createVuesticEssential({
            components: {
                VaButton,
                VaButtonToggle,
                VaSplit,
                VaImage,
                VaModal,
                VaCardTitle,
                VaCardContent,
                VaCardActions,
                VaInput,
                VaNavbar,
                VaNavbarItem,
                VaOptionList,
                VaSelect,
                VaTreeView,
                VaProgressCircle,
                VaChip,
                VaIcon,
                VaCheckbox,
                VaDropdown,
                VaDropdownContent,
                VaButtonGroup,
                VaDivider,
                VaDataTable,
                VaToast,
                VaButtonDropdown,
                VaSidebar,
                VaSidebarItem,
                VaSidebarItemContent,
                VaSidebarItemTitle,
                VaScrollContainer
            },
            config: {
                colors: {
                    variables: {
                        primary: "#133370"
                    },
                },
                //icons: createIconsConfig({ fonts }),
            },
        }));
    //app.mount("#app");
    const store = useAppSettingsStore();
    await store.initXmlaApi('https://datacube-stage.nomad-dmz.jena.de/cube/xmla');
});


// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
    title: 'Bar Chart',
    component: Bar,
    /*render: (args: any) => ({
        components:  Bar ,
        setup() {
            //const chartStore = useChartStore('chartStore','');
            return { args };
        },
        template: ' <Bar\n' +
            '        id="chartWidget2"\n' +
            '        ref="chartRef"' +
            '    /> '
    }),*/
    // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
    tags: ['autodocs'],
    argTypes: {
        /*size: { control: 'select', options: ['small', 'medium', 'large'] },
        backgroundColor: { control: 'color' },
        onClick: { action: 'clicked' },*/

        //data:{}
        options: {
            responsive:  { control: 'select', options: ['true', 'false'] },
        }
    },
    args: {
        data:{
            /**
             * The label of the button
             */
            labels: [ 'January', 'February', 'March' ],
            datasets: [ { data: [40, 20, 12] } ]
        },
        options: {
            responsive: true
        }
    }, // default value
} as Meta<typeof Bar>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
    args: {

    },
};


