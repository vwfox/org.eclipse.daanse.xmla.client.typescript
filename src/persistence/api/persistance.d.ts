export interface RepositoryRegistry {
    register(repo:Repository):void;
    getAvailableReposetories():Promise<Repository[]>;
    findRepositoryByName(name:string):Promise<Repository[]>;
    findRepositoryByUri(uri:URL):Promise<Repository>
}

export interface Repository{
    name:string
    uri:URL

    getentityByUri(uri: URL): Promise<Entity | null>;
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
    create(Entity):Promise
    update(Entity):Promise
    delete():Promise
}
