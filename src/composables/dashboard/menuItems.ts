import {ref} from "vue";

export interface MenuItem{
     label: string;
     preset: string;
     action: () => void;
     icon: string ,
     condition:string,
     priority:number,
}
const menuItems = ref<MenuItem[]>([]);

export function useMenuItems() {


    const addMenuItem = (mi:MenuItem) => {
        const postoInsert = menuItems.value.findIndex(i=>i.priority<=mi.priority)
        if(postoInsert==-1){
            menuItems.value.push(mi)
        }else {
            menuItems.value.splice(postoInsert,0,mi);
        }

    };

    const removeMenuItem = (mi:MenuItem) => {
        const pos = menuItems.value.indexOf(mi);
        if(pos>-1){
            menuItems.value.splice(pos);
        }
    };

    return {
        removeMenuItem,
        addMenuItem,
        menuItems
    };
}
