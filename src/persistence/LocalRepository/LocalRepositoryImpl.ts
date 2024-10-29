import type {  Entity,  Repository,  WritableRepository} from "@/persistence/api/persistance";
import ValidityCheck from "@/persistence/utils/ValidityCheck";
import {BaseRepository} from "@/persistence/api/BaseRepository";

export default class LocalRepositoryImpl extends BaseRepository implements WritableRepository{
    public static readonly type  = 'localRepositories';
    constructor(url:URL,name:string){
        super(url,name);
    }

    sync(): Promise<Entity[]> {
        return Promise.resolve([]);
    }
    async findAll(): Promise<Entity[]> {
        let ret:Entity[] = [];
        Object.keys(localStorage).forEach((e, key) => {
            try {
                let content = JSON.parse(localStorage.getItem(e) ?? '');
                if(ValidityCheck.checkContent(content)){
                    let copyBaseUri = new URL(this.uri);
                    copyBaseUri.pathname = e + '.json';
                    ret.push({
                        name: e,
                        uri: copyBaseUri,
                        data: content,
                    } as Entity);
                }

            } catch (e) {
                console.log(e);
            }
        })
        return Promise.resolve(ret);
    }

    findByFragment(_pathname: string): Promise<Entity[]> {
        let pathname = (_pathname.charAt(0)=='/')?_pathname.slice(1):_pathname;
        let ret:Entity[] = [];
        if (Object.keys(localStorage).includes(pathname)){
                    let content = JSON.parse(localStorage.getItem(pathname) ?? '');
                if(ValidityCheck.checkContent(content)){
                    let copyBaseUri = new URL(this.uri);
                    copyBaseUri.pathname = pathname + '.json';
                    ret.push({
                        name: pathname,
                        uri: copyBaseUri,
                        data: content,
                    } as Entity);
                }
        }
        return Promise.resolve(ret);
    }

    findByName(name: string): Promise<Entity[]> {
       return this.findByFragment(name);
    }

    findByUri(uri: URL): Promise<Entity[]> {
        let path = uri.pathname.replace('.json','');
        return this.findByFragment(path);
    }

    async getEntityByUri(uri: URL): Promise<Entity | null> {
        if(uri.protocol != this.uri.protocol || uri.hostname != this.uri.hostname){
            return Promise.resolve(null);
        }
        let path = uri.pathname.replace('.json','');
        let entity =  await this.findByFragment(path);

        return Promise.resolve(entity[0]);
    }

    create(e:Entity): Promise<any> {
        if(this.checkURI(e)){
            return Promise.reject('Entity Uri not set or not in Repo');
        }
        const name = e.uri.pathname.replace('.json','').replace('/','');
        if(Object.keys(localStorage).includes(name)){
            return Promise.reject('Entity allready exists! use update!');
        }
        if(e.name == undefined || e.name ==''){
            return Promise.reject('name not set in entity');
        }
        if(!e.uri.pathname.includes('.json')){
            return Promise.reject('name not contains a .json file type');
        }
        localStorage.setItem(name,e.data)
        return Promise.resolve(true);
    }

    delete(e:Entity): Promise<any> {
        if(this.checkURI(e)){
            return Promise.reject('Entity Uri not set or in Repo');
        }
        if(e.name == undefined || e.name ==''){
            return Promise.reject('name not set in entity');
        }
        if(!e.uri.pathname.includes('.json')){
            return Promise.reject('name not contains a .json file type');
        }
        const name = e.uri.pathname.replace('.json','').replace('/','');;
        localStorage.removeItem(name);
        return Promise.resolve(true);
    }

    update(e:Entity): Promise<any> {
        if(this.checkURI(e)){
            return Promise.reject('Entity Uri not set or in Repo');
        }
        if(e.name == undefined || e.name ==''){
            return Promise.reject('name not set in entity');
        }
        if(!e.uri.pathname.includes('.json')){
            return Promise.reject('name not contains a .json file type');
        }
        const name = e.uri.pathname.replace('.json','').replace('/','');
        if(!Object.keys(localStorage).includes(name)){
            return Promise.reject('Entity not exists! use create!');
        }

        localStorage.setItem(name,e.data)
        return Promise.resolve(true);
    }

    private checkURI(e: Entity) {
        return !e.uri || e.uri.protocol != this.uri.protocol || e.uri.hostname != this.uri.hostname;
    }


}
