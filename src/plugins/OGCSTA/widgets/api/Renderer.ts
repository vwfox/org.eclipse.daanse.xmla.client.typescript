/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type {IMapProps} from "@/plugins/OGCSTA/widgets/api/MapPreview";
// @ts-ignore
import type {IIconSettings} from "@/components/Widgets/Icon/IconWidgetSettings.vue";

export interface IPointPin {
    color: string;
}

export interface IDSRenderer {
    name:string,
    datastream: ICondition[],
    placement: ERefType,
    observation: {
        setting: any,
        component: string,
    },
    renderer: {
        point_render_as: string,
        point_prop?: string,
        point: IIconSettings;
        pointPin: IPointPin
        area: IMapProps,
        label: any
    },
    id: string;

}
export interface ICondition {

        prop: string,
        comperator: Comperator
        value: string,

}


export interface IRenderer {
    name:string,
    thing: ICondition[],
    renderer: {
        show_SubElements: boolean,
        point_render_as: string,
        point_prop?: string,
        point: IIconSettings
        pointPin: IPointPin
        area: IMapProps,
        label: any
    }
    ds_renderer: IDSRenderer[],
    ObservationrefreshTime?:number|undefined,
    lastUpdate?:number|undefined,
    id: string;

}

interface ICompare {
    (loaction: Location): boolean;
}

export enum ERefType {
    Thing = 'Thing',
    OberservedArea = 'OberservedArea',
}
export enum Comperator {
    equals = 'eq',
    lessThen = 'lt',
    greaterThen = 'gt',
    lessThenEquals = 'lte',
    greaterThenEquals = 'gte',
    notEQuals = "neq"
}
