import get from "lodash/get";

export function useApplicationSettingsManager(){
    const getSettings:any|null = (path:string[])=>{
        return get(window['__env'].settings.value,path)
    }
    return {
        getSettings
    }
}
