module.exports = function(){
    var config = {}
    switch(process.env.NODE_ENV){
        case 'dev':
             config.port = 3000;
             config.facebook = {
                appId: '599161553452323',
                secret: '6ac87a0d0cc6756ba6c8358405ef9b98'
            };
        case 'prod':
        default:
            config.port = 80;
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
