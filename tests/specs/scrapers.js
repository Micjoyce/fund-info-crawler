var async = require('async');
var assert = require('assert');
var helper = require('../helper');
var moment = require('moment');
var _ = require('lodash');

describe('scraper tests', function() {
    var scrapeService, scrapers;
    beforeEach(function(done) {
        app.container.resolve({}, function(Scrapers) {
            scrapers = Scrapers;
        });
        app.container.resolve({}, function(RawDB) {
            async.parallel([
                function(cb) {
                    RawDB.sync({
                        logging: false,
                        force: true
                    }).then(function() {
                        cb();
                    });
                }
            ], function() {
                done();
            })
        });
    });
    describe("scrape fund codes", () => {
      it("get all fund codes", (done) => {
        scrapers.scrapeFundCodes(function(err, result){
          if (err) {
            console.log(err);
          }else {
            done();
          }
        })
      });
    });
    describe('scrape', function () {
        // it('get last date', function(done){
        //     scrapers.getLastDate('000005', 'assetAllocationUrl', function(err, date){
        //         assert.equal(err, undefined);
        //         assert.equal(date, "2015-06-15");
        //         done();
        //     })
        // });
        it('scrape fundAssetAllocation test', function (done) {
            scrapers.getLastDate('000005', 'assetAllocationUrl', function(err, date){
                scrapers.scrapeFundAssetAllocation("000005", date, function(err, fundAssetAllocation){
                    assert.equal(err, undefined);
                    assert.equal(fundAssetAllocation.date, date);
                    assert.equal(fundAssetAllocation.asset, 2220383559.46);
                    assert.equal(fundAssetAllocation.netAsset, 1508401519.1);
                    assert.equal(fundAssetAllocation.equity, 89378350.90);
                    assert.equal(fundAssetAllocation.bond, 1904896870.65);
                    assert.equal(fundAssetAllocation.cash, 29938739.08);
                    assert.equal(fundAssetAllocation.other, 45360703.87);
                    done();
                });
            });
        });
        it('scrape bondSectorBreakdown test', function (done) {
            scrapers.getLastDate('000005', 'bondPortfolioUrl', function(err, date){
              console.log(err, date);
                scrapers.scrapeBondSectorBreakdown("000005", date, function(err, bondSectorBreakdown){
                    assert.equal(err, undefined);
                    assert.equal(bondSectorBreakdown.corporateBond, 486150002.9);
                    assert.equal(bondSectorBreakdown.commercialPaper, 361642000);
                    assert.equal(bondSectorBreakdown.financialBond, 111202000.00);
                    assert.equal(bondSectorBreakdown.convertible, 16214138.60);
                    done();
                })
            });
        });
        it('scrape equitySectorBreakdown test', function (done) {
            scrapers.getLastDate('000001', 'industryInvestmentUrl', function(err, date){
                scrapers.scrapeEquitySectorBreakdown("000001", date, function(err, equitySectorBreakdown){
                    assert.equal(err, undefined);
                    assert.equal(equitySectorBreakdown.A, 50555258.14);
                    assert.equal(equitySectorBreakdown.B, 160931554.9);
                    assert.equal(equitySectorBreakdown.C, 3633289030.61);
                    assert.equal(equitySectorBreakdown.D, 91741329.46);
                    assert.equal(equitySectorBreakdown.E, 198456028.92);
                    assert.equal(equitySectorBreakdown.F, 136182885.80);
                    assert.equal(equitySectorBreakdown.G, 166319622.36);
                    assert.equal(equitySectorBreakdown.I, 1035621675.65);
                    assert.equal(equitySectorBreakdown.J, 25017940.00);
                    assert.equal(equitySectorBreakdown.K, 25303021.82);
                    assert.equal(equitySectorBreakdown.N, 74345616.69);
                    assert.equal(equitySectorBreakdown.R, 45881847.06);
                    done();
                })
            });
        });
        it('scrape feeInfo test', function (done) {
            scrapers.scrapeFeeInfo("000197", function(err, feeInfo){
                assert.equal(err, undefined);
                assert.equal(feeInfo.code, "000197");
                assert.equal(feeInfo.managementFee, "--");
                assert.equal(feeInfo.custodianFee, "0.20%");
                assert.equal(feeInfo.serviceFee, "--");
                assert.equal(feeInfo.frontendLoad, '500万<=X 1000元\n100<=X<500万 0.40%\n0<=X<100万 0.60%\n')
                assert.equal(feeInfo.maxFrontendLoad, '500万<=X 1000元')
                assert.equal(feeInfo.backendLoad, '-- --\n');
                assert.equal(feeInfo.maxBackendLoad, '-- --');
                assert.equal(feeInfo.redemptionFee,'30<X天 0.00% /n0<X<=30天 1.00% /n')
                assert.equal(feeInfo.maxRedemptionFee,'0<X<=30天 1.00%')
                done();
            })
        });
        it('scrape changeShares test', function (done) {
            scrapers.scrapeSharesChange("100038", function(err, changeShares){
                assert.equal(err, undefined);
                assert.equal(changeShares.length, 25);
                for (var i = changeShares.length - 1; i >= 0; i--) {
                    if(changeShares[i].date === '2015/6/30'){
                        assert.equal(changeShares[i].totalShares,1738860000);
                        assert.equal(changeShares[i].sharesPurchased, 887599000);
                        assert.equal(changeShares[i].sharesRedeemed, 1358710000);
                        assert.equal(changeShares[i].netSharesChange, -471111000);
                        assert.equal(changeShares[i].percentChange, '-21.32%');
                    }
                    if(changeShares[i].date === '2011/6/30'){
                        assert.equal(changeShares[i].totalShares,2820450000);
                        assert.equal(changeShares[i].sharesPurchased, 1052590000);
                        assert.equal(changeShares[i].sharesRedeemed, 672767000);
                        assert.equal(changeShares[i].netSharesChange, 379823000);
                        assert.equal(changeShares[i].percentChange, '0.16%');
                    }
                };
                done();
            })
        });


        it('scrape latest FundAssetAllocation test', function (done) {
            scrapers.getLastDate('000005', 'assetAllocationUrl', function(err, date){
                scrapers.scrapeLatestFundAssetAllocation('000005', function(err,returnFundAssetAllocation){
                    assert.equal(err, undefined);
                    assert.equal(new Date(returnFundAssetAllocation.date).getDate(), new Date(date).getDate());
                    assert.equal(returnFundAssetAllocation.asset, 2220383559.46);
                    assert.equal(returnFundAssetAllocation.netAsset, 1508401519.1);
                    assert.equal(returnFundAssetAllocation.equity, 89378350.90);
                    assert.equal(returnFundAssetAllocation.bond, 1904896870.65);
                    assert.equal(returnFundAssetAllocation.cash, 29938739.08);
                    assert.equal(returnFundAssetAllocation.other, 45360703.87);
                    done();
                })
            });
        });


        it('create BondSectorBreakdown test', function (done) {
            scrapers.getLastDate('000005', 'bondPortfolioUrl', function(err, date){
                scrapers.scrapeLatestBondSectorBreakdown('000005', function(err, returnBondSectorBreakdown){
                    assert.equal(err, undefined);
                    assert.equal(returnBondSectorBreakdown.code, '000005');
                    assert.equal(new Date(returnBondSectorBreakdown.date).getDate(), new Date(date).getDate());
                    assert.equal(returnBondSectorBreakdown.treasuryBond, undefined);
                    assert.equal(returnBondSectorBreakdown.centralBankNote, undefined);
                    assert.equal(returnBondSectorBreakdown.financialBond, 111202000);
                    assert.equal(returnBondSectorBreakdown.corporateBond, 521872332.05);
                    assert.equal(returnBondSectorBreakdown.commercialPaper, 261951000);
                    assert.equal(returnBondSectorBreakdown.medianTermNote, undefined);
                    assert.equal(returnBondSectorBreakdown.convertible, 16214138.6);
                    assert.equal(returnBondSectorBreakdown.otherBond, undefined);
                    done();
                })
            });
        });


        it('create equitySectorBreakdown test', function (done) {
            scrapers.getLastDate('000001', 'industryInvestmentUrl', function(err, date){
                scrapers.scrapeLatestEquitySectorBreakdown('000001', function(err, equitySectorBreakdown){
                    assert.equal(err, undefined);
                    assert.equal(equitySectorBreakdown.A, 50555258.14);
                    assert.equal(equitySectorBreakdown.B, 160931554.9);
                    assert.equal(equitySectorBreakdown.C, 3633289030.61);
                    assert.equal(equitySectorBreakdown.D, 91741329.46);
                    assert.equal(equitySectorBreakdown.E, 198456028.92);
                    assert.equal(equitySectorBreakdown.F, 136182885.80);
                    assert.equal(equitySectorBreakdown.G, 166319622.36);
                    assert.equal(equitySectorBreakdown.I, 1035621675.65);
                    assert.equal(equitySectorBreakdown.J, 25017940.00);
                    assert.equal(equitySectorBreakdown.K, 25303021.82);
                    assert.equal(equitySectorBreakdown.N, 74345616.69);
                    assert.equal(equitySectorBreakdown.R, 45881847.06);
                    done();
                })
            });
        });



    });
});
