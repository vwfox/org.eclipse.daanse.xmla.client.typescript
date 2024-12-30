export interface QueryResults{
    head:{
        vars:string[]
    },
    results:{
        bindings:QueryResult[]
    }
}
export interface QueryResult{
    [key:string]: {
        value: string,
        type: string
    }
}
