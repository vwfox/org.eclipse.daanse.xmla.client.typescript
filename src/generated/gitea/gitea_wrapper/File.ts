import type {FileI} from "@/generated/gitea/gitea_wrapper/RepoT";
import {FileParseError, FileState} from "@/generated/gitea/gitea_wrapper/RepoT";

export default class File implements FileI{
    constructor(name,path,contentProvider:Function,exsists=false) {
        this.name = name;
        this.path = path;
        this.contentProvider = contentProvider;
        if(!exsists){
            this.file_state = FileState.NEW;
        }
    }

    content: any;
    name: string;
    path:string;
    contentProvider:Function;
    file_state:FileState = FileState.UNLOADED;

    async fetchContent() {
        try{
            this.content = (await this.contentProvider(this.path))
            this.file_state = FileState.UNTOUCHED;
        }catch (e){
            console.log(e)
            throw new FileParseError('File not get parsed')
        }

    }
    getContent(): any {
        try{
            const content_as_string = atob(this.content);
            return JSON.parse(content_as_string);
        }catch (e){
            //throw new FileParseError('File not get parsed')
            return {};
        }
    }

    setContent(content:any){
        try{
            const content_as_String = JSON.stringify(content)
            const content_as_base = btoa(content_as_String);
            this.content = content_as_base;
            if(this.file_state!=FileState.NEW)this.file_state = FileState.MODIFIED
        }catch (e){
            throw new FileParseError('File not get parsed')
        }
    }
    delete(){
        this.file_state = FileState.DELETED
    }

}
