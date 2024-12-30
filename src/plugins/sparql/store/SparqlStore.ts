/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import {useDatasourceManager} from "@/composables/datasourceManager";
import type {IOGCSTA} from "@/plugins/OGCSTA/dataSources/STADataSource";
import type {Datastream} from "@/plugins/OGCSTA/dataSources/STAClient";
import BaseStore from "@/stores/Widgets/BaseStore";
import {EResourceSetImpl,URI} from "org.eclipse.daanse.endpointfinder.core/src/ecore"
import type {DocumentRoot} from "org.eclipse.daanse.endpointfinder.core/src/models/results/src";
import {ResultsPackageImpl} from "org.eclipse.daanse.endpointfinder.core/src/models/results/src/ResultsPackageImpl";
import {Parser} from 'sparqljs'

export type ISparqlStoreOptions = {
    query:string
}

export default class SparqlStore extends BaseStore implements IStore, ISerializable {
    public static TYPE = 'SPARQL';

    datasourceId: string | null = null;
    events: IStoreEvents[] = [];
    type = SparqlStore.TYPE;
    data:DocumentRoot|undefined;

    public params: IStoreParams = {
        query:undefined
    };


    private datasourceManager = useDatasourceManager();


    constructor(id, caption, eventBus: EventBus) {
        super(id, caption, eventBus);
    }

    setOptions(options: any) {
        throw new Error("Method not implemented.");
    };

    getDatasource() {
        return this.datasourceManager.getDatasource(this.datasourceId);
    };


    updateParam(paramName: string, value: string) {
        if(paramName=='query'){
            this.params.query = value;
        }
    };

    updateEvents(events: IStoreEvents[]) {

    };

    addDatasource(datasourceId: string): void {
        this.datasourceId = datasourceId;
    }

    setDatasource(datasourceId: string): void {
        this.datasourceId = datasourceId;
        this.eventBus.emit(`UPDATE:${this.id}`);
    }

    async getData(options = undefined): Promise<any> {
        try{
            //const parser = new Parser();

            const datasource = this.datasourceManager.getDatasource(this.datasourceId);

            //const res = new EResourceSetImpl();
            // @ts-ignore
            //const rsp = new ResultsPackageImpl();
            //res.getPackageRegistry().registerPackage(rsp);




            let encodedValue = 'query='+encodeURIComponent(this.params.query);




            const newData = await datasource.getData('',false,{method:'POST',body:encodedValue,headers:
                    { 'User-Agent': 'org.eclipse.daanse.datafinder.sparql/1.0','Accept': 'application/json','Content-Type': 'application/x-www-form-urlencoded'}});
            //const instance =res.createResource(new URI('instance.xml'));
            //const stringResponse = newData.replace("<?xml version='1.0' encoding='UTF-8'?>",'');
            //console.log(parser.parse(newData));

            //instance.loadFromString(stringResponse)
            //console.log()
            //const data  = instance.eContents().get(0) as DocumentRoot// res.eContents();
            this.data = newData;
        }catch (e){
            this.data = undefined;
        }

        return  this.data;
    }


    getState(): any {
        return {
            caption: this.caption,
            id: this.id,
            events: this.events,
            params: this.params,
            datasourceId: this.datasourceId,
            type: this.type,
        };
    }

    loadState(state: any, eventBus: any): void {
        this.caption = state.caption;
        this.id = state.id;
        this.events = state.events;
        this.datasourceId = state.datasourceId;
        this.params = (state.params)?state.params:{query:undefined};
    }
}
