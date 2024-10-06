import type {Entity, Repository, WritableRepository} from "@/persistence/api/persistance";
import ValidityCheck from "@/persistence/utils/ValidityCheck";

export default class LocalRepositoryImpl implements WritableRepository{
    public readonly name: string;
    public readonly uri: URL;

    constructor(url:URL,name:string){
        this.uri = url;
        this.name = name;
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

    findByFragment(pathname: string): Promise<Entity[]> {
        let ret:Entity[] = [];
        Object.keys(localStorage).forEach((e, key) => {
            let content = JSON.parse(localStorage.getItem(e) ?? '');
            if(ValidityCheck.checkContent(content) && e == pathname){
               let copyBaseUri = new URL(this.uri);
               copyBaseUri.pathname = e + '.json';
               ret.push({
                   name: e,
                   uri: copyBaseUri,
                   data: content,
               } as Entity);
           }
        });
        return Promise.resolve(ret);
    }

    findByName(name: string): Promise<Entity[]> {
       return this.findByFragment(name);
    }

    findByUri(uri: URL): Promise<Entity[]> {
        let path = uri.pathname.replace('.json','');
        return this.findByFragment(path);
    }

    getEntityByUri(uri: URL): Promise<Entity | null> {
        if(uri.protocol != this.uri.protocol || uri.hostname != this.uri.hostname){
            return Promise.resolve(null);
        }
        let path = uri.pathname.replace('.json','');
        return this.findByFragment(path)[0]??null;
    }

    create(e:Entity): Promise<any> {
        if(this.checkURI(e)){
            return Promise.reject('Entity Uri not set or in Repo');
        }
        const name = e.uri.pathname.replace('.json','');
        if(Object.keys(localStorage).includes(name)){
            return Promise.reject('Entity allready exists! use update!');
        }
        if(e.name == undefined || e.name ==''){
            return Promise.reject('name not set in entity');
        }
        if(!e.name.includes('.json')){
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
        if(!e.name.includes('.json')){
            return Promise.reject('name not contains a .json file type');
        }
        const name = e.uri.pathname.replace('.json','');
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
        if(!e.name.includes('.json')){
            return Promise.reject('name not contains a .json file type');
        }
        const name = e.uri.pathname.replace('.json','');
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
