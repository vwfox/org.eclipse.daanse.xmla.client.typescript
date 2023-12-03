import type {CommitI, FileI, FileProviderI, RepoI} from "./RepoT";
import {CastError, FileState} from "./RepoT";
import type {ChangeFileOperation, ChangeFilesOptions} from "@/generated/gitea";
import {ChangeFileOperationOperationEnum, Configuration, RepositoryApi} from "@/generated/gitea";
import Commit from "@/generated/gitea/gitea_wrapper/Commit";


export class Repo implements RepoI {

    id: number;
    name: string;
    owner: string;
    fileProvider:FileProviderI
    files: FileI[] = [];
    branches: string[];
    branch:string = 'main';
    has_changes:boolean = false;
    commits:CommitI[];
    constructor(fileProvider:FileProviderI) {
        try{
            this.name = fileProvider.reponame;
            this.owner = fileProvider.owner;
            this.fileProvider = fileProvider;

            this.fetchBranches();
        }catch(e){
            throw new CastError('Not castable')
        }
    }

    async getFiles(){

        this.has_changes = false;
        let files = await this.fileProvider.getFiles(this.branch);
        this.files = files;
    }
    async  getCommits(){
        let commits:CommitI[]= [];
        let commits_raw = (await new RepositoryApi().repoGetAllCommits(this.owner,this.name,this.branch)).data;
        for (let commit_raw of commits_raw){
            commits.push(new Commit(commit_raw))
        }
        this.commits = commits;
    }

    /*async branch(){
        let branches = (await new RepositoryApi().repoListBranches(this.owner,this.name)).data;
        branches= branches.filter(br=>br.commit.author.username == 'karl');
        console.log(branches)
    }*/
    async commit(token=''){

        let opt = new class implements ChangeFilesOptions{
            files: Array<ChangeFileOperation>;
        };
        if(this.branch) opt['branch'] = this.branch;

        let repo_files:Array<ChangeFileOperation> = [];
        let files = this.files.filter(f=>f.file_state==FileState.NEW||f.file_state==FileState.MODIFIED||f.file_state==FileState.DELETED)
        for (let file of files){
            let afile = (file as FileI);
            let state:ChangeFileOperationOperationEnum = ChangeFileOperationOperationEnum.update
            switch (afile.file_state){
                case FileState.DELETED:
                    state=ChangeFileOperationOperationEnum.delete
                    break;
                case FileState.NEW:
                    state=ChangeFileOperationOperationEnum.create
                    break;
            }
            repo_files.push({
                content: afile.content,
                operation:state,
                path: afile.path
            }as ChangeFileOperation)
            opt['files']=repo_files
        }
        await new RepositoryApi({accessToken:token} as Configuration).repoChangeFiles(this.owner,this.name,opt,{headers:{Authorization:'token '+token}})

    }



    async fetchBranches() {
        let branches = (await new RepositoryApi().repoListBranches(this.owner,this.name)).data;
        if(branches)this.branches = branches.map(br=>br.name)
    }

    setBranch(branch:string) {
        console.log(branch)
        this.fileProvider.setBranch(branch);
        this.branch = branch;
        this.getFiles()
    }
    addFile(file: FileI) {
        this.files.push(file)
        this.has_changes = true;
    }
    mark_changes(){
        this.has_changes = true;
    }


}
