<script setup lang="ts">

import {LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import {reactive, ref, watch} from "vue";
import {usePromisifiedModal} from "@/composables/promisifiedModal";
import {type Filter, type Format, Formats, type MapSection} from "@/plugins/endpointfinder/queryBuilder/FilterAPI";
import {useFormat} from "@/plugins/endpointfinder/composeables/FormatComposeable";

const {isOpened, run, close, ok} = usePromisifiedModal(()=>{});

defineExpose({
    isOpened,
    run,
    close
})
const getColor = useFormat().getColorForFormat;

const model = defineModel<Filter[]>({ default: reactive([
    {formats:undefined} as Format, {mapSection:undefined} as MapSection])})

const formats  = ref([
    {name:'OGC',key: Formats.WMS ,color:getColor(Formats.WMS),active:true},
    {name:'SensorThings',key:Formats.OGCSTA,color:getColor(Formats.OGCSTA),active:true},
    {name:'XMLA',key:Formats.XMLA,color:getColor(Formats.XMLA),active:true},
    {name:'CSV',key:Formats.CSV,color:getColor(Formats.CSV),active:true},
    {name:'JSON',key:Formats.JSON,color:getColor(Formats.JSON),active:true},
]);

const formatFilter  = ref<boolean>(false);

const map = ref(null);

const mapSettings =  reactive({
    baseMapUrl:"https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    zoom: 14,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    center: [50.93115286, 11.60392726],
    map_filter_on: false
});


const init = ()=>   {

        const mapSection:MapSection|undefined  = model.value?.find(f=>f['mapSection']);
        const formats:Format|undefined  = model.value?.find(f=>f['formats']);
        if(mapSection){
            mapSettings.map_filter_on = true;
            try {
                map.value.leafletObject.fitBounds(mapSection.mapSection)
            }catch (e){

            }
        }
        if(formats){

            formatFilter.value = true;
        }

}
const move = ()=>{
    let mapSection:MapSection|undefined  = model.value?.find(f=>f['mapSection']);
    if(!mapSection){
        mapSection = {mapSection:[]} as MapSection;
        model.value.push(mapSection)
    }

    mapSection.mapSection = map.value.leafletObject.getBounds();

}
watch(()=>mapSettings.map_filter_on,(val)=>{
    const mapSection:MapSection|undefined  = model.value?.find(f=>f['mapSection']);
    if(!val) {
        if (mapSection) {
            const pos = model.value.indexOf(mapSection);
            if (pos != -1) model.value.splice(pos);
            //mapSection.mapSection = undefined;
        }
    }
})

const prevented = ref(false);
watch(formatFilter,(val)=>{
    const formatsInModel:Format|undefined  = model.value?.find(f=>f['formats']);
    if(prevented.value) {
        prevented.value = false;
        return;
    }
    if(formatsInModel?.formats){
    if(val) {
        //model.value!.formats = formats.value.map(e=>e.key);
        formats.value.forEach(e => e.active = false)

        formatsInModel.formats.forEach(e => {
            formats.value.findLast(f => f.key == e)!.active = true
        });
    }
    else
        {
            //formatsInModel.formats = undefined;
            const pos = model.value.indexOf(formatsInModel);
            if (pos != -1) model.value.splice(pos);

            formats.value.forEach(e => e.active = true)
        }
    }
});

const toogleFormat = (format)=>{
    let formatsInModel:Format|undefined  = model.value?.find(f=>f['formats']);
    if(!formatsInModel){
        formatsInModel = {formats:[]} as Format;
        model.value.push(formatsInModel);
    }
    if(formatFilter.value){

        format.active = !format.active

        const index = formatsInModel.formats!.indexOf(format.key);
        if(index == -1){
            formatsInModel.formats?.push(format.key)
        }else {
            formatsInModel.formats?.splice(index)
        }
        if(formatsInModel.formats.length == 0){
            formatFilter.value = false;
        }

    }else{
        prevented.value = true;
        formats.value.forEach(e=>e.active=false);
        format.active = true;
        formatsInModel!.formats = [format.key]
        formatFilter.value=true;
    }
}


</script>

<template>
    <va-modal @open="init" :modelValue="isOpened" no-padding class="infobox" @ok="ok" hide-default-actions >


        <template #default="{ ok }">
            <h3 class="title">Filter</h3>
            <va-button
                preset="secondary"
                class="mr-1 mb-1 close"
                @click="close"
            >
                x
            </va-button>
            <va-card-content>
            <div class="spacer" style="height:25px"></div>
            <div class="line">
                <div class="va-collapse__header__text left">Format</div>
                <div class="right">
                    <VaSwitch
                        v-model="formatFilter"
                        true-inner-label="Selection"
                        false-inner-label="all"
                    />
                </div>
            </div>

            <va-divider></va-divider>

            <div class="content">
                <div class="list_of_formats">
                    <template v-for="format in formats" :key="format.key">
                        <VaChip   size="small" :color="(format.active)?format.color:'#ccc'" :disabled="!format.active" @click="toogleFormat(format)" class="pointer">
                            {{format.name}}
                        </VaChip>
                    </template>
                </div>
            </div>


            <div class="line">
                <div class="va-collapse__header__text left">Region</div>
                <div class="right">
                    <VaSwitch
                        v-model="mapSettings.map_filter_on"
                        true-inner-label="within map section"
                        false-inner-label="anywhere"
                    />
                </div>
            </div>
            <va-divider></va-divider>
            <div class="content">


                <div class="map">
                    <l-map id="map" ref="map" :center="mapSettings.center" :max-zoom="21" :useGlobalLeaflet="true" :zoom="mapSettings.zoom"
                           style="height: 100%"
                           @move="()=>{move();mapSettings.map_filter_on = true}">
                        <l-tile-layer :attribution="mapSettings.attribution" :options="{maxNativeZoom:19,
                                                maxZoom:25}" :url="mapSettings.baseMapUrl">
                        </l-tile-layer>
                    </l-map>
                </div>
            </div>
            </va-card-content>
        </template>
    </va-modal>
</template>

<style scoped lang="scss">
.list_of_formats{
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: flex-start;
}


.map {
    width: 100%;
    height: 250px;
    position: relative;
}
.content{
    margin-top: 25px;
    margin-bottom: 35px;
    padding-left: 10px;
}
.line{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: flex-end;
    div{
        display:block;
        width: auto;
    }
}
.title{
    font-size: 24px;
    padding: 23px 10px 0px 15px;
}
.pointer{
    cursor:pointer;
}
</style>
