/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import {Comperator, type IDSRenderer, type IRenderer} from "@/plugins/OGCSTA/widgets/api/Renderer";
import type {Datastream, Thing} from "@/plugins/OGCSTA/dataSources/STAClient";
import {resolve, resolveObj} from "@/utils/helpers";

export function useComparator() {

    const compareThing = (th: Thing, renderer: IRenderer) => {

        if (!renderer.thing || renderer.thing.length == 0) {
            return false;
        }
        if (!th) return false;
        const red = renderer.thing.map((condition) => {
                if (condition.value == '*') {
                    return true;
                } else {
                    let prop = resolveObj(th,condition.prop)
                    if (!prop) {
                        return false
                    }
                    return compateCondition(condition.comperator,prop,condition.value)
                }
            }
        ).reduce((accumulator, currentValue) => accumulator && currentValue,
            true,
        )
        return red;
    };

    const compareDatastream = (ds: Datastream, renderer: IDSRenderer) => {

        if (!renderer.datastream || renderer.datastream.length == 0) {
            return false
        }
        if (!ds) return false;

        const red = renderer.datastream.map((condition) => {
                if (condition.value == '*') {
                    return true;
                } else {
                    let prop = resolveObj(ds,condition.prop)
                    if (!prop) {
                        return false
                    }

                    return  compateCondition(condition.comperator,prop,condition.value);
                }
            }
        ).reduce((accumulator, currentValue) => accumulator && currentValue,
            true,
        )
        return red;
    }

    const compateCondition = (comperator,prop,value)=>{
        switch (comperator) {
            case Comperator.equals:
                return String(prop) === value;
            case Comperator.notEQuals:
                return String(prop) !== value;
            case Comperator.greaterThen:
                return Number(prop) > Number(value);
            case Comperator.greaterThenEquals:
                return Number(prop) >= Number(value);
            case Comperator.lessThen:
                return Number(prop) < Number(value);
            case Comperator.lessThenEquals:
                return Number(prop) <= Number(value);
            default:
                return false;
        }
    }
    return {
        compareThing,
        compareDatastream
    }

}
