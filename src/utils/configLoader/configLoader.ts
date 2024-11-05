/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors:

*/
export default class ConfigLoader{
    static async init(){
        if(window['__env'] && window['__env'].settings){
            const settings = window['__env'].settings;
            if(settings.remoteSettings && settings.remoteSettings.enabled && settings.remoteSettings.url){
                console.info('retriving remote config from:'+settings.remoteSettings.url)
                try {
                    const response = await fetch(settings.remoteSettings.url);
                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }
                    const json = await response.json();
                    if(!json.configId || json.configId.trim() ===""){
                        throw new Error(`configId missing`);
                    }
                    if(settings.remoteSettings.role === 'REPLACE'){
                        window['__env'].settings = {};
                        window['__env'].settings = json;

                    }else{
                        window['__env'].settings = {...settings,...json}
                    }
                    console.info('config that is used:');
                    console.info(window['__env'].settings);
                } catch (error) {
                    console.warn('couldnt retrive remote config',error);
                }

            }
        }
    }
}
