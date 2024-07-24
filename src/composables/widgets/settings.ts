/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/
import  {isRef, ref, type Ref, watch} from "vue";

export function useSettings<Type>(props: any) {
    const settings = ref({}) as Ref<Type>;

    Object.keys(props).forEach((key) => {
        settings.value[key] = props[key];
    });

    const setSetting = (key, value) => {
        const keyArr = key.split(".");
        let iter:any = settings.value;


        keyArr.forEach((akey,index,array) => {

            if (!(akey in iter)){
                iter[akey]={}
            }
            if (typeof iter[akey] === "object" && index!=(array.length-1)) {

                iter = iter[akey];

            } else {
                iter[akey] = value;
            }
        });

        settings.value = {...settings.value};
    };

    watch(props, () => {
        Object.keys(props).forEach((key) => {
            settings.value[key] = props[key];
        });
    });

    return {
        settings,
        setSetting,
    };
}
