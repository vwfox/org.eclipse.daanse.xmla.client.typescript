<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script setup lang="ts">
import {usePromisifiedModal} from "@/composables/promisifiedModal";
import {computed, ref, watch} from "vue";
import IconWidget from "@/components/Widgets/Icon/IconWidget.vue";
import {controlOrMetaSymbol} from "@storybook/manager-api";
import {useToast} from "vuestic-ui";
import {useRepositoryRegistry} from "@/persistence/RepositoryRegistry/RepositoryRegistryImpl";
import {computedAsync} from "@vueuse/core";
import type {Entity, Repository} from "@/persistence/api/persistance";
import Default from "@/components/Modals/LoadSave/Default.vue";
import type {BaseRepository} from "@/persistence/api/BaseRepository";

const releaseEndPointUrl = ref<String>('');
if (window && window['__env'] && window['__env'].settings && window['__env'].settings.releaseEndPointUrl) {
    releaseEndPointUrl.value = window['__env'].settings.releaseEndPointUrl;
}
const {init, notify, closeAll} = useToast()
const repoManager = useRepositoryRegistry();
const data = ref<undefined|{context:string,state?:any}>(undefined);
const deleteFile = ref(undefined);
const uploadFile = ref(undefined);
const sureuploadFile = ref(false)
const url_name = ref("https://");
const loadingUrl = ref(false);
const errorMessage = ref("");
const error = ref(false);
const date = ref(new Date());

const opened = (_data:{context:string,state?:any}) => {
    data.value = _data;
    selectedRepo.value = undefined;
}
const {isOpened, run, close} = usePromisifiedModal(() => {
    console.log('reset')
    data.value = undefined;
}, opened);

defineExpose({
    isOpened,
    run,
    close
})

const ok = () => {
    close(null);
}

const selectedRepo = ref<Repository | undefined>(undefined);



const RepoClick = async (row) => {
    selectedRepo.value = (await useRepositoryRegistry().findRepositoryByUri(new URL(row.id)))
}

const upload = ref(undefined);
const isOpenedName = ref(false);
const save_Ename = ref("");
const content = ref<any>(undefined);

watch(upload, (newVal) => {
    if (newVal) {
        let name = newVal[0].name;
        let reader = new FileReader();
        reader.addEventListener('load', (result) => {
            save_Ename.value = name.split('.')[0];
            isOpenedName.value = true;
            content.value = result.target.result ?? undefined;

        });
        reader.readAsText(newVal[0]);
    }
})


const cancel = () => {
    isOpenedName.value = false;
    content.value = undefined;
    save_Ename.value = '';
    upload.value = undefined;
    deleteFile.value = undefined;
    //date.value = new Date();
}

const release = () => {
    if (uploadFile.value) {
        fetch(releaseEndPointUrl.value + '/' + uploadFile.value, {
            method: 'POST',
            body: localStorage.getItem(uploadFile.value),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(result => {
                notify({message: 'Upload successfull', color: 'success'});
            }).catch(e => {
            console.log(e);
            notify({message: 'Upload failed', color: 'danger'});
        }).finally(() => {

        })
    }
}

const sameName = computed(() => {
    return Object.keys(localStorage).includes(save_Ename.value)
})
const save = ()=>{


}
const urlDialog = ref(false);

const load = () => {
    error.value = false;
    errorMessage.value = "";

    loadingUrl.value = true;
    fetch(url_name.value)
        .then((response) => response.json())
        .then(result => {

            const keys = Object.keys(result);
            if (keys.includes('layout') && keys.includes('stores') && keys.includes('datasources') && keys.includes('widgets')) {
                urlDialog.value = false;
                isOpenedName.value = true;
                content.value = JSON.stringify(result);
            } else {
                throw new Error('Format not suported')
            }

        }).catch(e => {
        console.log(e);
        error.value = true;
        errorMessage.value = e.toString();
    }).finally(() => {
        loadingUrl.value = false;
    })
}

const nodes = computedAsync(async () => {
    return (await useRepositoryRegistry().getAvailableReposetories()).map(repo => {
        return {
            id: repo.uri.toString(),
            label: repo.name,
            icon: "inventory"
        }
    })
})

</script>

<template>
    <va-modal
        blur
        :modelValue="isOpened"
        no-padding
        hide-default-actions
        size="auto"
        class="save-modal"

    >
        <template #footer class="footer">
            <div class="flexbox footer" id="loadSaveModalFooterLeft">
                <VaFileUpload preset="secondary" v-model="upload" v-if="data && data.context == 'SAVE' && selectedRepo" class="marginr"/>
                <VaButton preset="secondary" @click="urlDialog=true" v-if="data && data.context != 'SAVE'"> get from URL</VaButton>
            </div>
            <div id="loadSaveModalFooter">
                <VaButton preset="secondary" @click="ok"> cancel</VaButton>
            </div>

        </template>
        <template #default="{ ok }">
            <div class="save-modal-content">
                <div class="m-4">
                    <h6 v-if="data && data.context == 'SAVE'" class="va-h6">Save</h6>
                    <h6 v-else class="va-h6">Load ...</h6>
                    <va-divider/>
                    <div class="masterDetail">
                        <div class="repos">
                            <VaSidebar
                                minimized-width="64px"
                                width="300px"
                                activeColor="#dee5f2"
                                color="#fff">
                                <template
                                    v-for="item in nodes"
                                    :key="item.label">
                                    <VaSidebarItem :active="item.id == ((selectedRepo)?(selectedRepo as Repository).uri.toString():'')"
                                                   @click="RepoClick(item)">
                                        <VaSidebarItemContent>
                                            <VaIcon :name="item.icon"/>
                                            <VaSidebarItemTitle>
                                                {{ item.label }}
                                            </VaSidebarItemTitle>
                                        </VaSidebarItemContent>
                                    </VaSidebarItem>
                                </template>
                            </VaSidebar>
                        </div>
                        <div class="keys">
                            <template v-if="selectedRepo">
                                <component :is="repoManager.getViewForRepoType(selectedRepo)" v-if="repoManager.isViewForRepoType(selectedRepo)"
                                           :repo="selectedRepo" @close="evt=>close(evt)" :context="data"></component>
                                <Default v-else :repo="selectedRepo" @close="evt=>close(evt)" :context="data"></Default>
                            </template>
                            <div v-else class="full-height">
                                <div class="full-height flexit">
                                    <div class="norepo"> &#60;/> </div>
                                    <div> Please  select a  Repo</div></div>
                                </div>

                        </div>
                    </div>
                </div>


            </div>
        </template>
    </va-modal>
    <va-modal
        :modelValue="isOpenedName"
        size="auto"
        hide-default-actions>
        <template #default="{ ok }">
            <h1 class="mb-4">Save As</h1>
            <va-divider/>
            <VaInput
                class="full"
                v-model="save_Ename"

                placeholder="save as"
            />
        </template>
        <template #footer class="footer">
            <VaButton preset="secondary" @click="cancel"> cancel</VaButton>
            <VaButton color="danger" @click="()=>{save()}" v-if="sameName"> override</VaButton>
            <VaButton @click="()=>{save()}" v-else> save</VaButton>
        </template>
    </va-modal>

    <VaModal
        size="auto"
        hide-default-actions
        v-model="sureuploadFile">
        <div class="deleteDailog">
            <h5 class="va-h5">
                Upload Config {{ uploadFile }} ?
            </h5>
        </div>
        <template #footer class="footer">
            <VaButton preset="secondary" @click="()=>{cancel(),sureuploadFile=false}"> cancel</VaButton>
            <VaButton @click="()=>{release(),sureuploadFile=false}"> Upload</VaButton>
        </template>
    </VaModal>
    <va-modal
        :modelValue="urlDialog"
        size="auto"
        hide-default-actions>
        <template #default="{ ok }">
            <h1 class="mb-4">Enter URL:</h1>
            <va-divider/>
            <VaInput
                class="full"
                v-model="url_name"
                :error-messages="errorMessage"
                :error="error"
                placeholder="url"
            />
        </template>
        <template #footer class="footer">
            <VaButton preset="secondary" @click="()=>{urlDialog = false}"> cancel</VaButton>
            <VaButton :loading="loadingUrl" @click="()=>{load()}"> load</VaButton>
        </template>
    </va-modal>
</template>

<style lang="scss" scoped>
.marginr {
    margin-right: 15px;
}

.flexbox {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
}

.deleteDailog {
    min-width: 250px;
}

.save-modal-content {

    padding: 10px;
    width: 100%;
    min-width: 1000px;

    button {
        align-self: flex-start;
    }

    .dt {
        height: 250px;
    }

    .full {
        width: 100%;
    }
    .full-height{
        height: 100%;
    }

    .masterDetail {
        display: flex;
        flex-direction: row;

        .repos {
            width: 310px;
            padding: 0 5px;
            min-height: 500px;
        }

        .keys {
            width: 100%;
        }
    }
    .flexit{
        display: flex;
        align-content: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .norepo{
            font-size: 50px;
            color: #c6c0c0;
        }
    }


}
</style>
<style>
.save-modal {
    .va-data-table__table-tr.active {
        .va-data-table__table-td {
            background: #d95050 !important;
        }

    }

    .va-modal__footer ,#loadSaveModalFooter {

        background: #f7f7f7;
        padding: 10px 16px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
    }
}
.va-menu-item{
    a{
        color:#000;
    }
}
</style>
