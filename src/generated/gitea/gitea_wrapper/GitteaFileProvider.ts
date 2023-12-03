import type {FileI, FileProviderI} from "@/generated/gitea/gitea_wrapper/RepoT";
import type {ContentsResponse} from "@/generated/gitea";
import {RepositoryApi} from "@/generated/gitea";
import File from "@/generated/gitea/gitea_wrapper/File";

export default class GitteaFileProvider implements FileProviderI{
    public owner: string;
    public reponame: string;
    public branch: string = 'main';

    constructor(owner:string ,reponame:string) {
        this.owner = owner;
        this.reponame = reponame;
    }

    setBranch(branch:string){
        this.branch = branch;
    }
    async getFiles(): Promise<FileI[]> {
        let files:FileI[] = [];
        try{
            let files_raw = (await new RepositoryApi().repoGetContents(this.owner,this.reponame,'dashboards', this.branch)).data;
            files_raw = (files_raw as any).filter(e=>e.name.includes('.json'))

            const local_t = this;
            for(let file  of files_raw){
                files.push(
                    new File(
                        file.name,
                        (file as ContentsResponse).path,
                        this.getFileContent.bind(this),
                        true))
            }

        }catch (e){

        }



        return files;
    }
    async getFileContent(path:string){
        try {
            return (await new RepositoryApi().repoGetContents(this.owner, this.reponame, path, this.branch)).data.content
        }catch (e){
            console.log(e)
            return null;
        }

    }

}
