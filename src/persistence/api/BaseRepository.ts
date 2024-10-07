export class BaseRepository{
    public readonly name:string;
    public readonly uri:URL;
    static readonly type:string;
    constructor(url:URL,name:string){
        this.uri = url;
        this.name = name;
    }
}
