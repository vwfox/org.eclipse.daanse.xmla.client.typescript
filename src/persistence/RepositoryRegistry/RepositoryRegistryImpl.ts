import type {RepositoryRegistry,Repository} from "@/persistence/api/persistance";
import {ref} from "vue";
import * as URl from "url";

const availableRepos = ref(new Map<string, Repository>());


export function useRepositoryRegistry():RepositoryRegistry{
    const findRepositoryByName = async (name: string):Promise<Repository|undefined>=>{
        return await Array.from(availableRepos.value.values()).find(repo=>repo.name == name);
    }

    const findRepositoryByUri= async (uri: URL): Promise<Repository|undefined> =>{
        return await availableRepos.value.get(uri.toString());
    }
    const getAvailableReposetories= async () : Promise<Repository[]>=>{
        return await Array.from(availableRepos.value.values())
    }
    const register = (repo: Repository): void=>{
        availableRepos.value.set(repo.uri.toString(),repo);
    }
    const unregister=(url: URL):void =>{
        availableRepos.value.delete(url.toString());
    }
    return {
        findRepositoryByName,
        findRepositoryByUri,
        getAvailableReposetories,
        register,
        unregister
    }
}
