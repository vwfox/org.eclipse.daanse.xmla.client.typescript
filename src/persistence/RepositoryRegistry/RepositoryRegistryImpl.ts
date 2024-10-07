import type{ RepositoryRegistry,  Repository} from "@/persistence/api/persistance";
import {onMounted, ref} from "vue";
import {useApplicationSettingsManager} from "@/composables/applicationSettingsManager";
import type {BaseRepository} from "@/persistence/api/BaseRepository";



const availableRepos = ref(new Map<string, Repository>());
const availableRepoTypes = ref(new Map<string,typeof BaseRepository>());
let init = false;

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
        console.info('registered Repo from Type:'+Object.getPrototypeOf(repo).constructor.type+' under '+ repo.uri.toString());
    }
    const registerRepoType = (aclass:typeof BaseRepository)=>{
        availableRepoTypes.value.set(aclass.type,aclass);
    }
    const unregister=(url: URL):void =>{
        availableRepos.value.delete(url.toString());
    }
    onMounted(() => {
        if(!init){
            console.info('RepoRepository started');
            let persirepos = useApplicationSettingsManager().getSettings(['persistanceRepositories']);
            for (let [type,instances] of Object.entries(persirepos)){
                let baseclass = availableRepoTypes.value.get(type);
                if(baseclass){
                    for (let entitysetting of (instances as any[])){
                        if(entitysetting.name && entitysetting.url){
                            const instanceOfBaseRepo = new (baseclass as any)(new URL(entitysetting.url),entitysetting.name,entitysetting) as Repository;
                            register(instanceOfBaseRepo);
                        }
                    }
                }else {
                    console.warn('found no RepositoryType for:',type)
                }
            }
            init = true;
        }

    })
    return {
        findRepositoryByName,
        findRepositoryByUri,
        getAvailableReposetories,
        register,
        unregister,
        registerRepoType
    }
}
