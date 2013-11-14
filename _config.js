module.exports = function(){
    var config = {}
    switch(process.env.NODE_ENV){
        case 'dev':
             config.facebook = {
                appId: '321092171365778',
                secret: '40d3849f6a9eedb6ef7edc2571993d60'
            };
        default:
        case 'prod':
            config.facebook = {
                appId: '321092171365778',
                secret: '40d3849f6a9eedb6ef7edc2571993d60'
            };
        break;

    }

    config.amazon = {
        access_key_id:'AKIAIWAM5VQTMEM73MFA',
            secret_access_key:'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',
            assoc_tag:'holiday_helper-20'
    };
    config.partials = {

        header_nav:'partials/header_nav',
        footer_nav:'partials/footer_nav',
        loading:'partials/loading'

    }
    return config;

};
