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


const widgetRegister = ref(new Map<string,Widget>());
const tree = ref(new Map<string,string[]>);



export function useWidgetRegistry() {
    const register=(el:Widget):string|null=>{

        console.log(el);
        if(!el || ! el.props || !el.props.id) return null
        addFamilyTree(el);
        widgetRegister.value.set(el.props.id,el);
        console.log('registed:'+el.props.id)
        return el.props.id; // this is to use in Component :ref=()=>useWidgetRegistery.register
    }
    const registerWithID = (el:Widget,id:string):string|null=>{
        addFamilyTree(el);
        widgetRegister.value.set(id,el);
        console.log('registed:'+id)
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
        return widgetRegister.value
    }
    const getAllParentIds = (id:string):string[]=>{
        let parents:string[] = [];
        for (const [key, value] of tree.value) {
            if(value.includes(id)){
                parents.push(key);
                const moreParents = getAllParentIds(key);
                if(moreParents!= undefined)
                    parents = parents.concat(...moreParents);
            }
        }
        return parents;
    }
    const getSiblingIds = (id:string):string[]=>{
        for (const [key, value] of tree.value) {
            if(value.includes(id)){
                return value;
            }
        }
        return [];
    }
    const addFamilyTree = (el:Widget)=>{
        if(el.props?.children && el.props?.children.length>0){
            const ids:string[]= [];
            el.props!.children.forEach(key=>{
                ids.push(key.id);
            })
            tree.value.set(el.props.id,ids);
        }
    }




    return {
        getById,
        register,
        getAll,
        getElementById,
        registerWithID,
        getAllParentIds,
        getSiblingIds
    };
}
