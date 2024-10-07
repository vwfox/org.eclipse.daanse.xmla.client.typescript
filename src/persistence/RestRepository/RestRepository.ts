import type{  Entity,  WritableRepository} from "@/persistence/api/persistance";
import {BaseRepository} from "@/persistence/api/BaseRepository";

export default class RestRepositoryImpl extends BaseRepository implements WritableRepository {

    public static readonly type  = 'restRepositories';
    private createEndpointPath:String;
    private updateEndpointPath:String;
    private deleteEndpointPath:String;
    private findEndpointPath:String;
    private findAllEndpointPath:String;


    constructor(url:URL,
                name:string,
                settings={
                        updateEndpointPath:':id',
                        deleteEndpointPath : ':id',
                        findAllEndpointPath : '',
                        createEndpointPath :  ':id',
                        findEndpointPath :  ':id',
                    }) {
        super(url,name);

        this.updateEndpointPath = settings.updateEndpointPath||':id';
        this.deleteEndpointPath = settings.deleteEndpointPath||':id';
        this.findAllEndpointPath = settings.findEndpointPath||'';
        this.createEndpointPath =  settings.createEndpointPath||':id';
        this.findEndpointPath =  settings.findEndpointPath||':id';

    }

    async create(e: Entity): Promise<any> {
       try{
           const createURL =  new URL(this.uri);
           const entityPath = e.uri.pathname;
           createURL.pathname = createURL.pathname + "/" +this.createEndpointPath.replace(':id',entityPath)
           const res = await fetch(createURL,{method:'GET',body:e.data});
           if(res.ok){
               return true;
           }else {
               throw new Error(res.statusText);
           }
       }catch (e){
           console.log(e);
           return new Error('Resource could not created');
       }
    }

    async delete(e: Entity): Promise<any> {
        try{
            const createURL =  new URL(this.uri);
            const entityPath = e.uri.pathname;
            createURL.pathname = createURL.pathname + "/" +this.deleteEndpointPath.replace(':id',entityPath)
            const res = await fetch(createURL,{method:'DELETE'});
            if(res.ok){
                return true;
            }else {
                throw new Error(res.statusText);
            }
        }catch (e){
            console.log(e);
            return new Error('Resource could not deleted');
        }
    }

    async findAll(): Promise<Entity[]> {
        try{
            const createURL =  new URL(this.uri);
            createURL.pathname = createURL.pathname + "/" +this.findAllEndpointPath;
            const res = await fetch(createURL,{method:'GET'});
            if(res.ok){
                const resArr : Entity[] = [];
                const data = await res.json();
                for(const entity of data){
                    resArr.push({
                        name:entity.name,
                        uri:new URL(entity.url),
                        data:null
                    })
                }
                return resArr;
            }else {
                throw new Error(res.statusText);
            }
        }catch (e){
            console.log(e);
            throw new Error('Resource could not find entities');
        }
    }

    findByFragment(pathname: string): Promise<Entity[]> {
        return Promise.resolve([]);
    }

    findByName(name: string): Promise<Entity[]> {
        return Promise.resolve([]);
    }

    findByUri(uri: URL): Promise<Entity[]> {
        return Promise.resolve([]);
    }

    async getEntityByUri(uri: URL): Promise<Entity | null> {
        try{
            const getURL =  new URL(this.uri);
            const entityPath = uri.pathname;
            getURL.pathname = getURL.pathname + "/" +this.findEndpointPath.replace(':id',entityPath)
            const res = await fetch(getURL,{method:'GET'});
            if(res.ok){
                const data = await res.json();
                const  resArr: Entity={
                        name:entityPath,
                        uri:getURL,
                        data:data
                    }
                return resArr;
            }else {
                throw new Error(res.statusText);
            }
        }catch (e){
            console.log(e);
            throw new Error('Resource could not find entities');
        }
    }

    async update(e: Entity): Promise<any> {
        try{
            const createURL =  new URL(this.uri);
            const entityPath = e.uri.pathname;
            createURL.pathname = createURL.pathname + "/" +this.updateEndpointPath.replace(':id',entityPath)
            const res = await fetch(createURL,{method:'DELETE'});
            if(res.ok){
                return true;
            }else {
                throw new Error(res.statusText);
            }
        }catch (e){
            console.log(e);
            return new Error('Resource could not deleted');
        }
    }

}
