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
        "releaseEndPointUrl": "http://192.168.178.173:8080/udp/rest/dashboard/release",
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
                url:"http://dataInMotion.de/udp/rest"
            }],
            "gitRepositories":[]
        }
    };

})(this);
