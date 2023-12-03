import type {CommitI, FileI, UserI} from "@/generated/gitea/gitea_wrapper/RepoT";

class User implements UserI {
    id: string;
    mail: string;
    name: string;

    constructor(raw) {
        this.id  = raw.id;
        this.mail = raw.email;
        this.name = raw.login;
    }



}

export default class Commit implements CommitI{
    files: FileI[];
    hash: string;
    message: string;
    name: string;
    author:UserI;
    creation_date:string;

    constructor(raw) {
        console.log(raw)
        this.name = raw.sha;
        this.hash = raw.sha;
        this.message = raw.commit.message;
        this.author = new User(raw.author);
        this.creation_date = raw.created;
    }
    commit() {
    }

    getFiles(): void {
    }

}
