<script setup lang="ts">

import type {QueryResult} from "@/plugins/endpointfinder/queryBuilder/QueryBuilderAPI";
import Ellipsis from "@/plugins/endpointfinder/components/utils/Ellipsis/Ellipsis.vue";
import {useFormat} from "@/plugins/endpointfinder/composeables/FormatComposeable";
import {Formats} from "@/plugins/endpointfinder/queryBuilder/FilterAPI";

const prop = withDefaults(defineProps<{result:QueryResult}>(),{})
const color = useFormat().getColorForFormat('<'+prop.result.format.value+'>');
const getName = (name)=>{
    const result = Object.entries(Formats).filter((val,index)=>val[1] == '<'+name+'>')
    if(result && result[0] )return result[0][0];
    return name;
}
</script>

<template>
    <VaCard class="card">
        <VaCardTitle><VaChip   size="small" :color="color" class="pointer">
            {{getName(prop.result.format.value)}}
        </VaChip>
            {{prop.result.title.value}}
        </VaCardTitle>
        <VaCardContent>
            <Ellipsis>
                {{prop.result.description.value}}
            </Ellipsis>
            <br>
            <div class="aflex small light" >
                <div class="right">
                    {{prop.result.creator_name? prop.result.creator_name.value:''}}
                </div>
                <div class="left" >
                     {{prop.result.date? prop.result.date.value:''}}
                </div>
            </div>

        </VaCardContent>
    </VaCard>
</template>

<style scoped lang="scss">

 .pointer{
     cursor:pointer;
     align-self: start;
     margin-right: 5px;
 }
 .card{
     box-shadow: none;
     border-bottom: 1px solid #e1e1e1;
     border-radius: 0;
     cursor:pointer;
     &:hover, &.active{
         background: #f5f8ff!important;
     }
  .va-card-title{
      font-size: 1.25rem;
  }
 .aflex {
     display: flex;
     margin-top: 15px;
     flex-direction: row;
     justify-content: space-between;
     align-content: center;
     /* align-items: flex-start; */
     flex-wrap: nowrap;
 }

     .light{
         color: #6c6a6add;
     }

 }
</style>
