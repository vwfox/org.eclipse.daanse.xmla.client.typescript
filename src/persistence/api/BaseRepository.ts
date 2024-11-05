/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

export class BaseRepository{
    public readonly name:string;
    public readonly uri:URL;
    static readonly type:string;
    constructor(url:URL,name:string){
        this.uri = url;
        this.name = name;
    }
}
