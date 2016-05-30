'use strict';

var app = {};

//init container
app.container = require('./dependency');
app.run = function() {
    console.log('run');
    var ScraperService = app.container.get('ScraperService');
    // ScraperService.updateFundCodes();
    ScraperService.updateFundAssetAllocation();
    ScraperService.updateBondSectorBreakdown();
    ScraperService.updateEquitySectorBreakdown();
    ScraperService.updateFeeInfo();
    ScraperService.updateSharesChange();
};

module.exports = app;
