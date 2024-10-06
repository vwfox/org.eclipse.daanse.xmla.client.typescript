export default class ValidityCheck{
    static checkContent(json:any):boolean{
        const keys = Object.keys(json);
        if (keys.includes('layout') && keys.includes('stores') && keys.includes('datasources') && keys.includes('widgets')) {
            return true
        }
        return false
    }
}
