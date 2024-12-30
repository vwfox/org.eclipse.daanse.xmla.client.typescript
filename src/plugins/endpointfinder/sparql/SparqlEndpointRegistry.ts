import type {SparqlEndpointRegistryI} from "@/plugins/endpointfinder/sparql/SparqlEndpointRegistry.api";
import type RESTDatasource from "@/dataSources/RestDatasource";


const connections:RESTDatasource[] = [];
const activeConnectionIds:string[] = [];

export function useSparQLEndPointManager() {

    const registerEndpoint = (connection:RESTDatasource)=>{
       connections.push(connection);
        activeConnectionIds.push(connection.id);
    }
    const getEndpointsByName = (name:string)=>{
       return connections.filter(d=>d.caption == name);
    }
    const getAllActiveEndpoints = ()=>{
        return connections.filter(d=>activeConnectionIds.includes(d.id));
    }
    const getActiveEndpoints = (id:string)=>{
        if(activeConnectionIds.includes(id)){
            return connections.find(d=>d.id == id);
        }else{
            return undefined
        }
    }
    const setActive = (id:string)=>{
        if(activeConnectionIds.includes(id))return
        if(!connections.find(d=>d.id==id))return;
        activeConnectionIds.push(id);
    }
    const setInActive = (id)=>{
        const pos = activeConnectionIds.findIndex(id);
        if(pos != -1) activeConnectionIds.splice(pos);
    }
    return {
        registerEndpoint,
        getEndpointsByName,
        getActiveEndpoints,
        setActive,
        setInActive,
        getAllActiveEndpoints
    }as SparqlEndpointRegistryI
}
