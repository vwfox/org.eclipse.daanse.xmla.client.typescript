import type RESTDatasource from "@/dataSources/RestDatasource";

export interface SparqlEndpointRegistryI{
    registerEndpoint(connection:RESTDatasource):void
    getEndpointsByName(name:string):RESTDatasource[]|undefined
    getActiveEndpoints(id:string):RESTDatasource|undefined
    getAllActiveEndpoints():RESTDatasource[]|undefined
    setActive(id:string):void
    setInActive(id:string):void
}
