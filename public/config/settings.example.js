/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

(function(window) {
    window.__env = window.__env || {};

    window.__env.settings = {
        "configId":"local~1",
        "remoteSettings":{
            enabled: true,
            /**
             * Endpoint where remote Settings kann be retrived
             */
            url:"/config/settings.json",
            /**
             * Sets how local and remote config become merged.
             * @param {string} ADD - (default) additional props gets merged, if same remote wins.
             * @param {string} REPLACE - only remote is active
             */
            role:"ADD"
        },
        "initWithConfigurationURI": {
            enabled:false,
            url:""
        },
        "viewmodeByDefault":false,
        "releaseEndPointUrl": "https://",
        "visuals":{
            "hideHeader":true,
            "hideMenu":true,
            "hideEdit":true,
            "hideSaveLoad":true,
            "hideComponentsSettings":true,
            "hideAppSettings":true
        },
        "appSettings":{
            "backgroundColor":"",
            "language":"de"
        },
        "persistanceRepositories":{
            "localRepositories":[{
                name:'BrowserFileRepo',
                url:"file://localhost"
            }],
            "restRepositories":[{
                name:"DIM-Repository",
                url:"https://"
            }],
            "gitRepositories":[
                {
                    name:"Github-Repository",
                    url:"https://",
                }
            ]
        }
    };

})(this);
