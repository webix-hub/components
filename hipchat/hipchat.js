webix.protoUI({
    name:"hipchat",
    $init:function(config){
        //configuration params
        var params = [
            "anonymous=true",
            "minimal=true",
            "timezone="+config.timezone,
            "welcome_msg="+(config.welcome_msg||"Welcome to Webix Hub Chat")
        ];

        //building full url
        var url = config.url + (config.url.indexOf("?") > 0 ? "&" : "?") + params.join("&");
        if (url.indexOf("https://") !== 0)
            url = "https://" + url;

        //loading the hipchat
        this.$view.innerHTML = "<iframe src='" + url + "' frameborder='0' width='100%' height='100%'></iframe>";
    },
}, webix.ui.view);