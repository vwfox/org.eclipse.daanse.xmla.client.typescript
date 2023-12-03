import type {WrapperI} from "./RepoT";
import {Configuration, RepositoryApi, UserApi} from "@/generated/gitea";
import {Repo} from "./Repo";
import GitteaFileProvider from "@/generated/gitea/gitea_wrapper/GitteaFileProvider";

export default class GiteaWrapper implements WrapperI{


    async getRepos(): Promise<Repo[]> {
        let git_tea_repos = (await new RepositoryApi().repoSearch()).data;
        let ret:Repo[] = [];

        for (let repo of git_tea_repos.data){
            try{
                ret.push(new Repo(new GitteaFileProvider(repo.owner.login,repo.name)))
            }catch (e){

            }
        }
        return ret;
    }
    async getToken(username,password){
       return  (await new UserApi({password:password, username: username} as Configuration).userCreateToken(username,
           {name:new Date().getTime().toString(),scopes:['write:repository']})).data.sha1;
    }




}
