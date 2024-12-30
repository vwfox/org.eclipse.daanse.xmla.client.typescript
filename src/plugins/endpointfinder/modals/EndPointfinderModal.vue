<script setup lang="ts">

import {usePromisifiedModal} from "@/composables/promisifiedModal";
import {computed, inject, reactive, ref, watch} from "vue";
import {VaStepper,VaBadge} from "vuestic-ui";
import FilterModal from "@/plugins/endpointfinder/modals/FilterModal.vue";
import QueryBuilder from "@/plugins/endpointfinder/queryBuilder/QueryBuilder";
import {useSparQLEndPointManager} from "@/plugins/endpointfinder/sparql/SparqlEndpointRegistry";
import StoreListItem from "@/components/Stores/ListItems/StoreListItem.vue";
import {useStoreManager} from "@/composables/storeManager";
import {useDatasourceManager} from "@/composables/datasourceManager";
import Ellipsis from "@/components/utils/Ellipsis/Ellipsis.vue";
import SearchResultCard from "@/plugins/endpointfinder/components/Searchcard/SearchResultCard.vue";
import TableWidget from "@/components/Widgets/Table/TableWidget.vue";
import {Formats} from "@/plugins/endpointfinder/queryBuilder/FilterAPI";
const {isOpened, run, close, ok} = usePromisifiedModal(()=>{});


const step = ref(0)

const stepsVailid = reactive({
    step0:false,
    step1:true,
    step2:true,
    step3:false
})
const steps = [
    {label: 'Search', icon: 'travel_explore', beforeLeave: (step) => {
            step.hasError = !stepsVailid.step0
        }},
    {label: 'Connection', icon: 'polyline',beforeLeave: (step) => {
            step.hasError = !stepsVailid.step1
        }},
    {label: 'Stores', icon: 'store',beforeLeave: (step) => {
            step.hasError = !stepsVailid.step2
        }},
    {label: 'Preview', icon: 'preview',beforeLeave: (step) => {
            step.hasError = !stepsVailid.step3
        }},
]

const form = reactive({
    searchString: '',
    loading:false
})
const loadModalref = ref(null);
const openFilterModal = async ()=> {
    return await loadModalref.value?.run(() => {
    });
}
const filterCount = ref('');
const filter = reactive([])
const results = ref({});

watch(filter,()=>{
    if (!filter) {
        filterCount.value = '';
        return;
    }
    const lengthOfNonUndefined = Object.keys(filter).reduce( (accumulator, currentValue,currentIndex) => (filter[currentValue]!=undefined)?accumulator+1:accumulator , 0);
    if(lengthOfNonUndefined==0) {
        filterCount.value = ''; return;
    }
    filterCount.value = lengthOfNonUndefined.toString();
},{immediate:true,deep:true})

const resultAsTable = computed(()=>{
    let reducedTable=[];
    for (let resultKey of Object.keys(results.value)){
        reducedTable = reducedTable.concat(results.value[resultKey].results?.bindings?.map(b=>{b['endpoint']={value:resultKey};return b}))
    }
    return reducedTable;
})
defineExpose({
    isOpened,
    run,
    close
})
const  search = async ()=>{
    form.loading = true;
    const val = form.searchString;
    const listOfEndPoints = useSparQLEndPointManager().getAllActiveEndpoints();
    if(listOfEndPoints){
        results.value = await new QueryBuilder().setEndpoints(listOfEndPoints).setFilter(filter).query(val);
        console.log(results);
    }
    form.loading = false;

}
const cols = [
    { key: "title", sortable: true },
    { key: "description", sortable: true },
    { key: "disttTitle", sortable: true },
    { key: "ServiceEndpountURI", sortable: true },
    { key: "formatId", sortable: true },

];

const selectedItemsEmitted = ref();

const dsManager = useDatasourceManager();
let ds = undefined;
let store = undefined;
const ds_notFountInfo = ref(false);

const storeManager = useStoreManager();
const types = storeManager.getStoreTypes();
const EventBus = inject("customEventBus") as any;
//const CSVStoreID = storeManager.initStore("CSVStore", EventBus, "CSV");
//const CSVStore = storeManager.getStore(CSVStoreID);
//CSVStore.setDatasource(dsid);


watch(selectedItemsEmitted,()=>{
    ds_notFountInfo.value =false;
    ds = createDataSourceFromFormat(selectedItemsEmitted.value?.format?.value);
    if(!ds) {
        ds = dsManager.getDatasource(dsManager.initDatasource('REST', "", ""));
        ds_notFountInfo.value = true;
    }

    let uri = null;
    try {
        uri = new URL(selectedItemsEmitted.value?.accessUrl?.value);
    }catch (e){

    }
    if(uri){
        ds.url =  uri.origin;
        ds.caption = uri.hostname ??'new Endpoint';

        stepsVailid['step0']=true;
    }else{
        stepsVailid['step0']=false;
    }

})

watch(step,(val)=>{
    if(val == 2){
        store = createStoreFromFormat(selectedItemsEmitted.value?.format?.value);
        if(!store) {}// show pickup list
        let uri = null;
        try {
            uri = new URL(selectedItemsEmitted.value?.accessUrl?.value);
        }catch (e){

        }
        store.caption = selectedItemsEmitted.value?.title?.value??'new Store';
        store.requestTemplate = uri.pathname;
        store.setDatasource(ds.id);

    }

})

const createDataSourceFromFormat = (format:string)=>{
    let ds  = undefined;

    const availableTypes = dsManager.getRegisteredTypes();
    switch ('<'+format+'>'){
        case Formats.CSV:
        case Formats.JSON:
        case Formats.REST:
        case Formats.OGCSTA:
            if(availableTypes.includes('REST')){
                ds = dsManager.getDatasource(dsManager.initDatasource('REST', "", ""));
            }
            break;
        case Formats.XMLA:
            if(availableTypes.includes('XMLA')) {
                ds = dsManager.getDatasource(dsManager.initDatasource('XMLA', "", ""));
            }
            break;

    }
    return ds;
};

const createStoreFromFormat = (format:string)=>{
    let store = undefined;
    switch ('<'+format+'>'){
        case Formats.CSV:
            store = storeManager.getStore(storeManager.initStore('newStore',EventBus, 'CSV'));
            break;
        case Formats.JSON:
            store = storeManager.getStore(storeManager.initStore('newStore',EventBus, 'REST'));
            break;
        case Formats.REST:
            store = storeManager.getStore(storeManager.initStore('newStore',EventBus, 'REST'));
            break;
        case Formats.OGCSTA:
            store = storeManager.getStore(storeManager.initStore('newStore',EventBus, 'OGCSTA'));
            break;
        case Formats.XMLA:
            store = storeManager.getStore(storeManager.initStore('newStore',EventBus, 'XMLA'));
            break;
    }
    return store;
}

</script>



<template>

    <va-modal :modelValue="isOpened" no-padding class="infobox" @ok="ok" hide-default-actions >
        <template #footer class="footer">
            <VaButton :disabled="!stepsVailid['step'+step]" @click="step++">next</VaButton>
        </template>
        <template #default="{ ok }">
            <va-button
                preset="secondary"
                class="mr-1 mb-1 close"
                @click="close"
            >
                x
            </va-button>
            <va-card-content class="no-padding">

                <VaStepper
                    v-model="step"
                    :steps="steps"
                    controlsHidden
                    linear
                >

                    <template #step-content-0>
                        <VaForm ref="formRef" class="flex flex-col items-baseline gap-6">
                            <div class="flex padd15" >
                           <VaInput class="flex"
                                    @keyup="(e)=>{if(e.key=='Enter')search()}"
                               v-model="form.searchString"
                               label="Search String"
                                :loading="form.loading"
                           >
                               <template #prependInner>
                                   <VaIcon
                                       name="search"
                                       color="secondary"
                                   />
                               </template>
                           </VaInput>
                                <div class="buttonbar">
                                    <VaBadge
                                        :text="filterCount"
                                        overlap
                                        class="mr-6"
                                        :offset="[-5,5]"
                                        style="--va-badge-text-wrapper-border-radius: 50%;"

                                    >
                                    <VaButton preset="secondary"   round icon="filter_alt" @click="openFilterModal"></VaButton>
                                    </VaBadge>
                                </div>

                            </div>
                       </VaForm>


                        <VaScrollContainer v-if="resultAsTable.length>0"
                            class="padd"
                            vertical
                        >
                            <template v-for="result in resultAsTable">
                                <SearchResultCard :result="result"  @click="selectedItemsEmitted = result" :class="{active:result==selectedItemsEmitted}"></SearchResultCard>
                                <br>
                            </template>
                        </VaScrollContainer>

                    </template>
                    <template #step-content-1>
                        <div class="padd">
                            <VaForm ref="connectionForm" v-model="stepsVailid['step1']" immediate>
                        <h2 class="title"  v-if="!ds_notFountInfo"> The following Connection will be created:</h2>
                                <div class="aflex" v-else>
                                <VaIcon
                                    class="mr-2"
                                    name="warning"
                                    color="#ec9c1d"
                                    size="2rem"
                                />
                        <h2 class="title" > The Connection cant be automatic detected, this happens if the Type of Dataset is not known or not supported. Never the less you can try to configure the connection manualy:</h2>
                                </div>
                            <br>
                            <br>
                        <div class="aflex">

                            <va-input
                                label="Name"
                                v-model="ds.caption"
                                :rules="[(v) => !!v || 'Required',]"
                            ></va-input>


                            <va-select
                                label="Type"
                                class="type-input"
                                v-model="ds.type"
                                :options="
                            Object.keys(dsManager.getDataSourceRegistry())
                        "
                            />

                            <va-input
                                label="URL"
                                v-model="ds.url"
                                :rules="[(v) => !!v || 'Required',]"
                            ></va-input>
                        </div>
                            <br>
                            </VaForm>
                        </div>
                    </template>
                    <template #step-content-2>

                        <VaScrollContainer
                            class="padd"
                            vertical
                        >
                            <h2 class="title"> The following Store will be created:</h2>
                            <br>
                        <component v-if="useStoreManager().getComponentForStoreType(store.type)"
                                   :is="useStoreManager().getComponentForStoreType(store.type)!"
                                   :item="store"
                                   :isExpanded="true"></component>
                            <br>
                        </VaScrollContainer>
                    </template>
                    <template #step-content-3>
                        <!--<TableWidget ref="tableWidget" composer="" pagesize="50" axes=""></TableWidget>-->
                    </template>
                </VaStepper>
            </va-card-content>
        </template>

    </va-modal>
    <FilterModal ref="loadModalref" v-model="filter"></FilterModal>

</template>

<style lang="scss">
.infobox {
    .footer, .va-modal__footer{

        background: #f7f7f7;
        padding: 10px 16px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
    }
    .va-stepper__navigation{
        padding: 30px 30px 0px 15px;
        /* border-bottom: 1px solid #ccc; */
        background: #f7f7f7;
        margin-bottom: 10px;
    }
    .va-stepper__step-content-wrapper,.va-stepper__step-content{
        padding: 0;
        margin:0;
    }
    .va-modal__message{
        margin:0;
    }
    .aflex{
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 9px;
    }
    .store-item-header{
        display:none;
    }
    .store-item-content{
        border:none;
        padding: 0;
    }
    .datasource-list{
        .datasource-list-add-button{
            display:none;
        }
    }
}
.flex{
    width:100%;
}
</style>
<style lang="scss" scoped>
.flex{
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;

}
.buttonbar{
     margin-top: 15px;
 }
.padd{
    max-height:400px;
    padding: 15px 25px;
}
.padd15{
    padding: 10px 25px 30px;
    border-bottom: 1px solid #e5e5e5;

}

.no-padding{
    padding: 0;
}


</style>
