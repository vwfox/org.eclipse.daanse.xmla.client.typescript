/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors:

*/
import { createApp } from "vue";
import { createPinia } from "pinia";
import SOAPClient from "./plugins/SOAPClient";
import EventBus from "./plugins/EventBus";

import App from "./App.vue";
// import router from './router'

import "./assets/main.css";

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
  VaList,
  VaListLabel,
  VaListItem,
  VaListItemSection,
  VaSidebarItem,
  VaSidebarItemContent,
  VaSidebarItemTitle,
  VaScrollContainer,
  VaListItemLabel,
  VaRadio,
  VaCollapse,
  VaColorInput,
  VaCounter,
  VaSlider, VaTabs, VaTab
} from "vuestic-ui";
import "vuestic-ui/css";

import "./scss/main.scss";
import { router } from "@/router/router";

import VueSmartWidget from "vue-smart-widget";

const app = createApp(App);

const pinia = createPinia();
pinia.use(SOAPClient);
app.use(pinia);
console.log(router);
app.use(router);
app.use(VueSmartWidget);

app.use(EventBus);
const fonts = [
  {
    name: "mdi-{icon}",
    resolve: ({ icon }) => ({
      class: "material-icons-outlined",
      content: icon,
      tag: "span",
    }),
  },
];

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
      VaScrollContainer,
      VaList,
      VaListLabel,
      VaListItem,
      VaListItemSection,
      VaListItemLabel,
      VaRadio,
      VaCollapse,
      VaColorInput,
      VaCounter,
      VaSlider,
      VaTabs,
      VaTab
    },
    config: {
      colors: {
        variables: {
          primary: "#133370",
        },
      },
      icons: createIconsConfig({ fonts }),
    },
  }),
);

app.mount("#app");
export default app;
