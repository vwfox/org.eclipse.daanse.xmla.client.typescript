/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import ThingWidget from "@/plugins/TestPlugin/widgets/ThingWidget.vue";

import StaStore from "@/plugins/TestPlugin/stores/StaStore";

import useComposerManager from "@/plugins/charts/composables/ComposerManager";
import OGSTAComposer from "@/plugins/OGCSTAComposer/composer/OGCSTAComposer";
import type {Component} from "vue";
import OGCSTAComposerV from "@/plugins/OGCSTAComposer/composer/OGCSTAComposerV.vue";

export default {

    install: (app) => {


        useComposerManager().registerComposer(OGSTAComposer,OGCSTAComposerV as unknown as Component,StaStore.TYPE)

    }
};
