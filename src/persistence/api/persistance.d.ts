import type {Component} from "vue";
import type {BaseRepository} from "@/persistence/api/BaseRepository";
import type {BranchI} from "@/git_api/api/Branch";
import type {CommitI} from "@/git_api/api/Commit";

export interface RepositoryRegistry {
    register(repo:Repository):void;
    getAvailableReposetories():Promise<Repository[]>;
    findRepositoryByName(name:string):Promise<Repository|undefined>;
    findRepositoryByUri(uri:URL):Promise<Repository|undefined>;
    unregister(url:URL):void;
    registerRepoType(aclass:typeof BaseRepository):void;
    registerViewForRepoType(aclass:typeof BaseRepository,component:typeof Component):void;
    getViewForRepoType(aclass:Repository):typeof Component;
    isViewForRepoType(aclass:Repository):boolean;
}
export interface Repository{
    readonly name:string;
    readonly uri:URL;
    getEntityByUri(uri: URL): Promise<Entity | null>;
    findAll(): Promise<Entity[]>;
    sync():Promise<Entity[]>
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
    auth(options:any):Promise<any>
}
export interface GitWritableRepository extends WritableRepository{
    getBranches():Promise<BranchI[]>;
    setBranch(branch:BranchI):void;
    getCurrentBranch():BranchI|undefined;
    getCommits():Promise<CommitI[]>;
    setCommit(commit:CommitI):void;
    getCurrentCommit():CommitI|undefined;

}
