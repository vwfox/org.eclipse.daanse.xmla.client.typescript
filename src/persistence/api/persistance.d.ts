
export interface RepositoryRegistry {
    register(repo:Repository):void;
    getAvailableReposetories():Promise<Repository[]>;
    findRepositoryByName(name:string):Promise<Repository|undefined>;
    findRepositoryByUri(uri:URL):Promise<Repository|undefined>;
    unregister(url:URL):void;
    registerRepoType(aclass:typeof BaseRepository):void;
}
export interface Repository{
    readonly name:string;
    readonly uri:URL;
    getEntityByUri(uri: URL): Promise<Entity | null>;
    findAll(): Promise<Entity[]>;
    findByName(name:string): Promise<Entity[]>;
    findByFragment(pathname:string):Promise<Entity[]>;
    findByUri(uri: URL):Promise<Entity[]>;
}
export interface Entity{
    name?:string,
    uri:URL,
    data:any,
}

export interface WritableRepository extends Repository{
    create(e:Entity):Promise<any>
    update(e:Entity):Promise<any>
    delete(e:Entity):Promise<any>
}
