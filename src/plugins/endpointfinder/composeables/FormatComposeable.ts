
import {Formats} from "@/plugins/endpointfinder/queryBuilder/FilterAPI";

export function useFormat(){

    const colorMap:{ [key: string]:string} = {}
    colorMap[Formats.WMS]='#2c1f90';
    colorMap[Formats.OGCSTA]='#1f908c';
    colorMap[Formats.XMLA]='#45901f';
    colorMap[Formats.CSV]='#90301f';
    colorMap[Formats.JSON]='#7f1f90'


    const getColorForFormat  = (format:string)=>{
        if(!Object.keys(colorMap).includes(format)) return '#ccc';
        return colorMap[format]
    }

    return {
        getColorForFormat
    }
}
