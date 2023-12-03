import {defineStore} from "pinia";
import {ref} from "vue";

import GiteaWrapper from "@/generated/gitea/gitea_wrapper/gitea.wrapper";
import type {FileI, RepoI} from "@/generated/gitea/gitea_wrapper/RepoT";
import {FileState} from "@/generated/gitea/gitea_wrapper/RepoT";

export const useDashboardStore = defineStore("DashboardStore", () => {
    const state = ref({
        /** @type{RepoI[]}*/
        repos: [],
        inited: false,
        /** @type{FileI?}*/
        file:null
    });

    const fetchDashboardAllCategories = async ()=> {
        //let token = await new GiteaWrapper().getToken('mhochste','MwidH#53id3E!')
        //    console.log(token.sha1)
            let repos = (await new GiteaWrapper().getRepos())
            state.value.repos = repos;
            /*console.log(repos[1].files[0]);
            await repos[1].files[0].fetchContent();
            let content = repos[1].files[0].getContent();
            content[0]['x']=1
            console.log(content)
            repos[1].files[0].setContent(content);
            await repos[1].commit_draft(repos[1].files, 'karl-patch-1',token.sha1)*/
    }
    const loadRepoFiles = async (repo:RepoI)=>{
        repo.getFiles()
        repo.getCommits();
    }
    const loadFile = async (file:FileI)=>{
        if(file.file_state== FileState.UNLOADED)await file.fetchContent()
        state.value.file=file;
    }
    return {
        state,
        fetchDashboardAllCategories,
        loadRepoFiles,
        loadFile
    }
})
