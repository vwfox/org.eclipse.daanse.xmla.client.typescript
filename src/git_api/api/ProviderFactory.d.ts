import type {BranchProviderI} from "@/git_api/api/BranchProvider";

interface ProviderFactoryI{
    get(name:string,owner:string,options?:any):BranchProviderI;
}
