//dependency definition
var dependable = require('dependable'),
    container = dependable.container();

var Sequelize = require('sequelize');
container.register('Configs', require('./config'));
container.register('DataTypes', {sequelize: Sequelize});

var getSequezlieParams = function(Configs) {
    var params = {
        host: Configs.dbHost,
        dialect: Configs.dialect,
        logging: Configs.dbLogging,
        define: {
            timestamps: false
        }
    };
    if(Configs.dialect === 'mysql') {
        params.timezone = '+08:00';
    }
    return params;
};

container.register('RawDB', function(Configs) {
    //database configs
    var params = getSequezlieParams(Configs);
    var RawDB = new Sequelize('RawData', Configs.user, Configs.password, params);

    //avoid call to this function and result in reconnect to database
    container.register('RawDB', RawDB);
    return RawDB;
});

container.register('CalcDB', function(Configs) {
    //database configs
    var params = getSequezlieParams(Configs);
    var CalcDB = new Sequelize('CalcData', Configs.user, Configs.password, params);

    //avoid call to this function and result in reconnect to database
    container.register('CalcDB', CalcDB);
    return CalcDB;
});


//models

container.register('FundBasicModel', require('./models/rawdata/fund_basic'));

container.register('FundAssetAllocationModel', require('./models/rawdata/fund_asset_allocaton'));
container.register('BondSectorBreakdownModel', require('./models/rawdata/bond_sector_breakdown'));
container.register('EquitySectorBreakdownModel', require('./models/rawdata/equity_sector_breakdown'));
container.register('FeeInfoModel', require('./models/rawdata/feeinfo'));
container.register('SharesChangeModel', require('./models/rawdata/shares_change'));

//services
container.register('ScraperService', require('./services/scraper'));


//controllers
container.register('Scrapers', require('./scrapers'));

//utils
container.register('_', function(){
    return require('lodash');
});
container.register('moment', function(){
    return require('moment');
});
container.register('colors', require('colors'));
container.register('utils', require('./utils'));

//errors
container.register('Errors', require('./error'));


module.exports = container;
