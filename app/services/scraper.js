var  async = require('async');

module.exports = function(_, utils, moment, Errors, Scrapers, FundBasicModel, FundAssetAllocationModel, BondSectorBreakdownModel,EquitySectorBreakdownModel, FeeInfoModel, SharesChangeModel) {

    this.getAllCodes = function(callback){
        FundBasicModel
            .findAll()
            .then(function(funds){
                if(funds){
                    var codes = [];
                    for (var i = funds.length - 1; i >= 0; i--) {
                        codes.push(funds[i].Code);
                    };
                    callback(codes);
                }
                else{
                    callback(undefined);
                }
            })
    }

    this.updateFundCodes = function() {
      Scrapers.scrapeFundCodes(function(err, funds){
        console.log(err, funds);
        if (!funds || funds.length < 1) {
          return;
        }
        if (err) {
          console.log(err);
          return;
        }else {
          for (var i = 0; i < funds.length; i++) {
            var fund = funds[i];
            console.log(fund);
            FundBasicModel
              .findOrCreate({
                where: {
                  Code: fund.Code
                },
                defaults:{
                  Name: fund.Name,
                  Type: fund.Type
                }
              })
              .spread(function(createFund){
                if (!createFund) {
                  console.log("-----");
                  return;
                }
                else{

                }
              })
          }
        }
      })
    }

    this.updateFundAssetAllocation = function(callback){
        FundBasicModel.findAll().then(function(funds){
            var queue = async.queue(function(fund, cb){
                Scrapers.scrapeLatestFundAssetAllocation(fund.Code, function(err, fundAssetAllocation){
                    console.log('saving to db %s'.green, fund.Code);
                    if(fundAssetAllocation.date){
                        FundAssetAllocationModel
                            .findOrCreate({
                                where: {
                                    Code: fundAssetAllocation.code,
                                    Date: new Date(fundAssetAllocation.date)
                                },
                                defaults: {
                                    Asset: fundAssetAllocation.asset,
                                    NetAsset: fundAssetAllocation.netAsset,
                                    Equity: fundAssetAllocation.equity,
                                    Bond: fundAssetAllocation.bond,
                                    Cash: fundAssetAllocation.cash,
                                    InverseRepo: fundAssetAllocation.inverseRepo,
                                    Other: fundAssetAllocation.other
                                }
                            })
                            .spread(function(createdFundAssetAllocation){
                                if(!createdFundAssetAllocation){
                                    return cb("err");
                                }
                                console.log('saved'.green);
                                cb();
                            });
                    }
                    else{
                        cb();
                    }
                });
            }, 10);
            funds.forEach(function(fund){
                queue.push(fund, function(err){
                    console.log('finished %s', fund.Code);
                });
            });
        });
    };

    this.updateBondSectorBreakdown = function(callback){
        FundBasicModel.findAll().then(function(funds){
            console.log(funds.length);
            var queue = async.queue(function(fund, cb){
                Scrapers.scrapeLatestBondSectorBreakdown(fund.Code, function(err, bondSectorBreakdown){
                    console.log('saving to db %s'.green, fund.Code);
                    if(bondSectorBreakdown.date){
                        BondSectorBreakdownModel
                            .findOrCreate({
                                where: {
                                    Code: bondSectorBreakdown.code,
                                    Date: new Date(bondSectorBreakdown.date)
                                },
                                defaults: {
                                    TreasuryBond: bondSectorBreakdown.treasuryBond,
                                    CentralBankNote: bondSectorBreakdown.centralBankNote,
                                    FinancialBond: bondSectorBreakdown.financialBond,
                                    CorporateBond: bondSectorBreakdown.corporateBond,
                                    CommercialPaper: bondSectorBreakdown.commercialPaper,
                                    MedianTermNote: bondSectorBreakdown.medianTermNote,
                                    Convertible: bondSectorBreakdown.convertible,
                                    OtherBond: bondSectorBreakdown.otherBond
                                }
                            })
                            .spread(function(createBondSectorBreakdown){
                                if(!createBondSectorBreakdown){
                                    return cb("err");
                                }
                                console.log('saved'.green);
                                cb();
                            });
                    }
                    else{
                        cb();
                    }
                });
            }, 10);
            funds.forEach(function(fund){
                queue.push(fund, function(err){
                    console.log('finished %s', fund.Code);
                });
            });
        });
    }

    this.updateEquitySectorBreakdown = function(callback){
        FundBasicModel.findAll().then(function(funds){
            console.log(funds.length);
            var queue = async.queue(function(fund, cb){
                Scrapers.scrapeLatestEquitySectorBreakdown(fund.Code, function(err, equitySectorBreakdown){
                    console.log('saving to db %s'.green, fund.Code);
                    if(equitySectorBreakdown.date){
                        EquitySectorBreakdownModel
                            .findOrCreate({
                                where: {
                                    Code: equitySectorBreakdown.code,
                                    Date: new Date(equitySectorBreakdown.date)
                                },
                                defaults: {
                                    A: equitySectorBreakdown.A,
                                    B: equitySectorBreakdown.B,
                                    C: equitySectorBreakdown.C,
                                    D: equitySectorBreakdown.D,
                                    E: equitySectorBreakdown.E,
                                    F: equitySectorBreakdown.F,
                                    G: equitySectorBreakdown.G,
                                    H: equitySectorBreakdown.H,
                                    I: equitySectorBreakdown.I,
                                    J: equitySectorBreakdown.J,
                                    K: equitySectorBreakdown.K,
                                    L: equitySectorBreakdown.L,
                                    M: equitySectorBreakdown.M,
                                    N: equitySectorBreakdown.N,
                                    O: equitySectorBreakdown.O,
                                    P: equitySectorBreakdown.P,
                                    Q: equitySectorBreakdown.Q,
                                    R: equitySectorBreakdown.R,
                                    S: equitySectorBreakdown.S
                                }
                            })
                            .spread(function(createEquitySectorBreakdown){
                                if(!createEquitySectorBreakdown){
                                    return cb("err");
                                }
                                console.log('saved'.green);
                                cb();
                            });
                    }
                    else{
                        cb();
                    }
                });
            }, 10);
            funds.forEach(function(fund){
                queue.push(fund, function(err){
                    console.log('finished %s', fund.Code);
                });
            });
        });
    }

    this.updateFeeInfo = function(callback){
        FundBasicModel.findAll().then(function(funds){
            console.log(funds.length);
            var queue = async.queue(function(fund, cb){
                Scrapers.scrapeFeeInfo(fund.Code, function(err, feeInfo){
                    console.log('saving to db %s'.green, fund.Code);
                    FeeInfoModel
                        .findOrCreate({
                            where: {
                                Code: feeInfo.code,
                            },
                            defaults: {
                                ManagementFee: feeInfo.managementFee,
                                CustodianFee: feeInfo.custodianFee,
                                ServiceFee: feeInfo.serviceFee,
                                FrontEndLoad: feeInfo.frontendLoad,
                                MaxFrontEndLoad: feeInfo.frontendLoad,
                                BackendLoad: feeInfo.backendLoad,
                                MaxBackendLoad: feeInfo.maxBackendLoad,
                                RedemptionFee: feeInfo.redemptionFee,
                                MaxRedemptionFee: feeInfo.maxRedemptionFee
                            }
                        })
                        .spread(function(createFeeInfo){
                            if(!createFeeInfo){
                                return cb("err");
                            }
                            console.log('saved'.green);
                            cb();
                        });
                });
            }, 10);
            funds.forEach(function(fund){
                queue.push(fund, function(err){
                    console.log('finished %s', fund.Code);
                });
            });
        });
    }

    this.updateSharesChange = function(callback){
        FundBasicModel.findAll().then(function(funds){
            console.log(funds.length);
            var queue = async.queue(function(fund, cb){
                Scrapers.scrapeSharesChange(fund.Code, function(err, sharesChanges){
                    console.log('saving to db %s'.green, fund.Code);
                    async.each(sharesChanges, function(sharesChange, _cb){
                        if(sharesChange.date){
                            SharesChangeModel
                                .findOrCreate({
                                    where: {
                                        Code: sharesChange.code,
                                        Date: new Date(sharesChange.date)
                                    },
                                    defaults: {
                                        TotalShares: sharesChange.totalShares,
                                        SharesPurchased: sharesChange.sharesPurchased,
                                        SharesRedeemed: sharesChange.sharesRedeemed,
                                        NetSharesChange: sharesChange.netSharesChange,
                                        PercentChange: sharesChange.percentChange,
                                    }
                                })
                                .spread(function(createSharesChange){
                                    if(!createSharesChange){
                                        return _cb("err");
                                    }
                                    console.log('saved'.green);
                                    _cb();
                                });
                        }
                        else{
                            _cb();
                        }
                    },function(err){
                        cb(err)
                    });
                });
            }, 10);
            funds.forEach(function(fund){
                queue.push(fund, function(err){
                    console.log('finished %s', fund.Code);
                });
            });
        });
    }

    return this;
};
