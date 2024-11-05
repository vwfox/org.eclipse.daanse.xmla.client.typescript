/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type {AxisData, Composer, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import type {Component, ComputedRef, Ref} from "vue";

declare interface ComposerRegistryMap {
    [key: string]: typeof Composer<any>;
}
declare interface ComposerRegistrySettingsMap {
    [key: string]: Component;
}

declare interface useChartDataComposerI{
    registerComposer(class_ref: typeof Composer<Selector>,settingComponent:Component,storetype:string):void;
    unRegisterDataSource(storetype:string):void;
    getComposerRegistry():ComposerRegistryMap;
    getComposerForStoreType(storetype:string):typeof Composer<Selector>|undefined;
    getSettingsComponentForType(storetype:string):Component;
    isRegistered(storetype:string):boolean
}


