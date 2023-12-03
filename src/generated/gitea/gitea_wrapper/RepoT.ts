export interface WrapperI{
    getRepos():Promise<RepoI[]>

}
export class CastError extends Error {
    // . declare any additional properties or methods .
}
export class FileParseError extends Error {
    // . declare any additional properties or methods .
}

export interface RepoI {
    constructor(fileProvider:FileProviderI):void;
    name: string;
    owner: string;
    id: number;
    files:FileI[];
    branches:string[],
    branch:string,
    has_changes:boolean,
    getFiles()
    getCommits()
    addFile(file:FileI)
    fetchBranches()
    setBranch(branch:string)
}
export enum FileState{
    'NEW',
    'MODIFIED',
    'DELETED',
    'UNTOUCHED',
    'UNLOADED',
}

export interface DashboardI {
    name:string
    path:string
    url:string
    last_change:number
    content:string
}
export interface FileProviderI{
    owner:string,
    reponame:string,
    setBranch(branch:string)
    constructor(owner:string ,reponame:string):void
    getFiles(branch:string):Promise<FileI[]>
}
export interface FileI{
    name:string
    content:any
    path:string
    file_state:FileState
    fetchContent():void
    getContent():any
    setContent(content:any):void
    delete():void
}
export interface CommitI{
    name:string
    hash:string
    message:string
    files: FileI[]
    creation_date:string;
    getFiles():void
    commit()
}
export interface UserI{
    id:string,
    name:string,
    mail:string
}
