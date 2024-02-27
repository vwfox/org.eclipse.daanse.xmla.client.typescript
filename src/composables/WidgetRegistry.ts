/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

/* eslint-disable @typescript-eslint/no-unused-vars */
import {getCurrentInstance, reactive, type Ref, ref, watch} from "vue";
import type {Widget} from "@/components/Widgets/Extended/ExtendedWidget.vue";


const widgetRegister = ref(new Map<string, Ref<Widget>>());
export function useWidgetRegistry() {
    const register=(el:Ref<Widget>):string|null=>{
        console.log(el);
        if(!el || ! el.props || !el.props.id) return null
        widgetRegister.value.set(el.props.id,el);
        console.log('registed:'+el.props.id)
        return el.props.id; // this is to use in Component :ref=()=>useWidgetRegistery.register
    }
    const registerWithID = (el:Ref<Widget>,id:string):string|null=>{
        widgetRegister.value.set(id,el);
        return id
    }

    const getById=(id:string)=>{
        console.log(widgetRegister.value.get(id))
        return widgetRegister.value.get(id);
    }
    const getElementById=(id:string)=>{
        console.log(widgetRegister.value.get(id));
        return
    }
    const getAll = ()=>{
        return widgetRegister
    }



    return {
        getById,
        register,
        getAll,
        getElementById,registerWithID

    };
}
