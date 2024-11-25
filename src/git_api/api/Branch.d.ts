/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
                   This program and the accompanying materials are made
                   available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/
import type {FileI} from "@/git_api/api/File";
import type {FolderI} from "@/git_api/api/Folder";
import type {CommitI} from "@/git_api/api/Commit";

export interface BranchI{
    repo:string;
    owner:string;
    name:string;
    sha:string;
    fetchCommits():Promise<CommitI[]>
    getCommits():CommitI[]
    addCommit(files:Array<FileI|FolderI>,msg:string):Promise<void>
}
