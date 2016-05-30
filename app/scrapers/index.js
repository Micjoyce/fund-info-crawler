'use strict';
var request = require("request"),
	async = require('async'),
	iconv = require('iconv-lite'),
	jsdom = require("jsdom"),
	fs = require("fs");

module.exports = function() {
	this.getLastDate = function(code, category, callback) {
		var that = this;
		var urlObj = {
			// "fundCodesUrl": "http://fund.eastmoney.com/allfund.html",
			"assetAllocationUrl": "http://jingzhi.funds.hexun.com/database/zcpz.aspx?fundcode=" + code,
			"financialIndicatorUrl": "http://jingzhi.funds.hexun.com/database/cwzb.aspx?fundcode=" + code,
			"bondPortfolioUrl": "http://jingzhi.funds.hexun.com/database/zqtz.aspx?fundcode=" + code,
			"industryInvestmentUrl": "http://jingzhi.funds.hexun.com/database/hytz.aspx?fundcode=" + code
		};
		var options = {
			url: urlObj[category],
			encoding: null
		};
		that.scrapeRequest(options, function(err, $) {
			if ($) {
				callback(undefined, $($("#enddate option")[0]).val());
			} else {
				callback(error, undefined);
			}
		})
	}

	this.scrapeFundCodes = function(callback) {
		var that = this;
		var fundCodesUrl = "http://fund.eastmoney.com/allfund.html";
		var options = {
			url: fundCodesUrl,
			encoding: null
		}
		that.scrapeRequest(options, function(err, $) {
			if ($) {
        var fundCodes = [];
        var numBoxLen = $("#code_content .num_box");
        for (var i = 0; i < numBoxLen.length; i++) {
          var numBox = numBoxLen[i];
          var oLis = $(numBox).find("li");
          for (var i = 0; i < oLis.length; i++) {
            var oLi = oLis[i];
            var oA = $(oLi).find("a")[0];
            var type = $(oLi).attr('class');
            var fundStr = $(oA).html();
            fundStr = fundStr.replace("）", ",");
            fundStr = fundStr.replace("（", "");
            var fundArr = fundStr.split(",");
            fundCodes.push({
              Code: fundArr[0].toString().trim(),
              Name: fundArr[1].toString().trim(),
              Type: type ? type: ""
            })
          }
        }
				callback(undefined, fundCodes);
			} else {
				callback(err, undefined);
			}
		})
	}


	this.scrapeFundAssetAllocation = function(code, date, callback) {
		var that = this;
		var fundAssetAllocation = {};
		var assetAllocationUrl = "http://jingzhi.funds.hexun.com/database/zcpz.aspx?fundcode=" + code + "&&enddate=" + date;
		var financialIndicatorUrl = "http://jingzhi.funds.hexun.com/database/cwzb.aspx?fundcode=" + code + "&&enddate=" + date;
		async.waterfall([
			function(cb) {
				var options = {
					url: assetAllocationUrl,
					encoding: null
				};
				that.scrapeRequest(options, function(err, $) {
					if ($) {
						fundAssetAllocation.code = code;
						fundAssetAllocation.date = $('#enddate').val();
						var htmlData = $('#fundData tr');
						var basicData = [{
							"name": '权益投资(股票)',
							'symbol': 'equity'
						}, {
							"name": '固定收益投资(债券)',
							'symbol': 'bond'
						}, {
							"name": '买入返售金融资产',
							'symbol': 'inverseRepo'
						}, {
							"name": '银行存款和结算备付金',
							'symbol': 'cash'
						}, {
							"name": '其他资产',
							'symbol': 'other'
						}, {
							"name": '合计',
							'symbol': 'asset'
						}];
						for (var i = htmlData.length - 1; i >= 1; i--) {
							var trName = $($(htmlData[i]).find('td')[1]).text();
							for (var j = basicData.length - 1; j >= 0; j--) {
								if (basicData[j].name === trName) {
									fundAssetAllocation[basicData[j].symbol] = Number($($(htmlData[i]).find('td')[2]).text());
								}
							};
						};
						cb(undefined, fundAssetAllocation);
					} else {
						cb(err, undefined);
					}
				})
			},
			function(fundAssetAllocation, cb) {
				if (fundAssetAllocation) {
					var options = {
						url: financialIndicatorUrl,
						encoding: null
					}
					that.scrapeRequest(options, function(err, $) {
						if ($) {
							var htmlData = $('#fundName + #fundData tr');
							for (var i = htmlData.length - 1; i >= 0; i--) {
								if ($($(htmlData[i]).find('td')[0]).text() === '期末基金资产净值') {
									fundAssetAllocation.netAsset = Number($($(htmlData[i]).find('td')[1]).text());
								}
							};
							cb(undefined, fundAssetAllocation);
						} else {
							cb(err, undefined);
						}
					})
				} else {
					cb("err", undefined);
				}
			}
		], function(err, result) {
			callback(err, fundAssetAllocation);
		});
	}

	this.scrapeBondSectorBreakdown = function(code, date, callback) {
		var that = this;
		var bondSectorBreakdown = {};
		var bondPortfolioUrl = 'http://jingzhi.funds.hexun.com/database/zqtz.aspx?fundcode=' + code + "&&enddate=" + date;;
		var options = {
			url: bondPortfolioUrl,
			encoding: null
		}
		that.scrapeRequest(options, function(err, $) {
			if ($) {
				bondSectorBreakdown.code = code;
				bondSectorBreakdown.date = date;
				var htmlData = $('#fundData tr');
				var basicData = [{
					"name": '国家债券',
					'symbol': 'treasuryBond'
				}, {
					"name": '央行票据',
					'symbol': 'centralBankNote'
				}, {
					"name": '金融债券',
					'symbol': 'financialBond'
				}, {
					"name": '企业债券',
					'symbol': 'corporateBond'
				}, {
					"name": '企业短期融资券',
					'symbol': 'commercialPaper'
				}, {
					"name": '中期票据',
					'symbol': 'medianTermNote'
				}, {
					"name": '可转债',
					'symbol': 'convertible'
				}, {
					"name": '其它债券',
					'symbol': 'otherBond'
				}];
				for (var i = htmlData.length - 1; i >= 0; i--) {
					var trName = $($(htmlData[i]).find('td')[1]).text();
					for (var j = basicData.length - 1; j >= 0; j--) {
						if (basicData[j].name === trName) {
							bondSectorBreakdown[basicData[j].symbol] = Number($($(htmlData[i]).find('td')[2]).text());
						}
					};
				};
				callback(undefined, bondSectorBreakdown);
			} else {
				callback(err, undefined);
			}
		})
	}

	this.scrapeEquitySectorBreakdown = function(code, date, callback) {
		var that = this;
		var equitySectorBreakdown = {};
		var industryInvestmentUrl = 'http://jingzhi.funds.hexun.com/database/hytz.aspx?fundcode=' + code + "&&enddate=" + date;;
		var options = {
			url: industryInvestmentUrl,
			encoding: null
		}
		that.scrapeRequest(options, function(err, $) {
			if ($) {
				equitySectorBreakdown.code = code;
				equitySectorBreakdown.date = date;
				var htmlData = $('#fundData tr');
				for (var i = htmlData.length - 2; i >= 1; i--) {
					var trCode = $($(htmlData[i]).find('td')[0]).text();
					equitySectorBreakdown[trCode] = Number($($(htmlData[i]).find('td')[2]).text());
				};
				callback(undefined, equitySectorBreakdown);
			} else {
				callback(err, undefined);
			}
		})
	}


	this.scrapeFeeInfo = function(code, callback) {
		var that = this;
		var feeInfo = {};
		var feeInfoUrl = 'http://stock.finance.sina.com.cn/fundInfo/view/FundInfo_JJFL.php?symbol=' + code;
		console.log('scrape  fee info %s'.yellow, code);
		var options = {
			url: feeInfoUrl,
			encoding: null,
		}
		that.scrapeRequest(options, function(err, $) {
			if ($) {
				var htmlData = $('#right .tableContainer table');
				var manageTable = $($(htmlData[1]).find('tbody tr')[1]).find('td');
				feeInfo.code = code;
				feeInfo.managementFee = $(manageTable[0]).text();
				feeInfo.custodianFee = $(manageTable[1]).text();
				feeInfo.serviceFee = $(manageTable[2]).text();
				var frontEndLoadColumns = $($($(htmlData[3]).find('tbody tr')[0]).find('td')[0]).attr('colspan');
				var loadTableTitle = $($(htmlData[3]).find('tbody tr')[1]).find('td');
				var loadTableContent = $($(htmlData[3]).find('tbody tr')[2]).find('td');
				var frontEndLoadContent = "";
				var backEndLoadContent = "";

				for (var i = 0; i < loadTableTitle.length; i++) {
					if (i < frontEndLoadColumns) {
						frontEndLoadContent += $(loadTableTitle[i]).text() + ' ' + $(loadTableContent[i]).text() + '\n';
					} else {
						backEndLoadContent += $(loadTableTitle[i]).text() + ' ' + $(loadTableContent[i]).text() + '\n';
					}
				};
				feeInfo.frontendLoad = frontEndLoadContent;
				feeInfo.backendLoad = backEndLoadContent;
				feeInfo.maxFrontendLoad = $(loadTableTitle[loadTableTitle.length - frontEndLoadColumns - 1]).text() + ' ' + $(loadTableContent[loadTableTitle.length - frontEndLoadColumns - 1]).text();
				feeInfo.maxBackendLoad = $(loadTableTitle[frontEndLoadColumns]).text() + ' ' + $(loadTableContent[frontEndLoadColumns]).text();

				var redemptionFeeRows = $(htmlData[4]).find('tbody tr');
				var redemptionFeeContent = "";
				var maxRedemptionFeeContent = "";
				for (var j = 0; j < redemptionFeeRows.length; j++) {
					var redemptionFeeCell = $(redemptionFeeRows[j]).find('td');
					for (var len = 0; len < redemptionFeeCell.length; len++) {
						redemptionFeeContent += $(redemptionFeeCell[len]).text() + ' ';
					}
					redemptionFeeContent += "/n";

					if ($(redemptionFeeCell[0]).text().charAt(0) === '0') {
						maxRedemptionFeeContent = $(redemptionFeeCell[0]).text() + ' ' + $(redemptionFeeCell[1]).text()
					}
				}
				feeInfo.redemptionFee = redemptionFeeContent;
				feeInfo.maxRedemptionFee = maxRedemptionFeeContent;
				callback(undefined, feeInfo);
			} else {
				callback(err, undefined);
			}
		})
	}

	this.scrapeSharesChange = function(code, callback) {
		var that = this;
		var sharesChanges = [];
		var sharesChangeUrl = 'http://stock.finance.sina.com.cn/fundInfo/view/FundInfo_SGSH.php?symbol=' + code;
		console.log('scrape  shares change %s'.yellow, code);
		var options = {
			url: sharesChangeUrl,
			encoding: null
		};
		var removeThousandsSeparator = function(str) {
			var res = str.replace(/,/g, "")
			return Number(res);
		}
		async.waterfall([
			function(cb) {
				that.scrapeRequest(options, function(err, $) {
					if ($) {
						var htmlData = $('#right .tableContainer tr');
						for (var i = htmlData.length - 1; i >= 3; i--) {
							var innerHtmlData = $(htmlData[i]).find('td');
							var sharesChange = {};
							sharesChange.code = code;
							sharesChange.date = $(innerHtmlData[0]).text();
							sharesChange.totalShares = removeThousandsSeparator($(innerHtmlData[2]).text());
							sharesChange.sharesPurchased = removeThousandsSeparator($(innerHtmlData[3]).text());
							sharesChange.sharesRedeemed = removeThousandsSeparator($(innerHtmlData[4]).text());
							sharesChange.netSharesChange = removeThousandsSeparator($(innerHtmlData[5]).text());
							sharesChange.percentChange = $(innerHtmlData[6]).text();
							sharesChanges.push(sharesChange);
						};
						cb(undefined, sharesChanges);
					} else {
						cb(err, undefined);
					}
				})
			},
			function(sharesChanges, cb) {
				if (sharesChanges) {
					for (var i = sharesChanges.length - 1; i >= 1; i--) {
						if (sharesChanges[i].date === sharesChanges[i - 1].date) {
							sharesChanges.splice(i, 1);
						}
					};
					cb(undefined, sharesChanges)
				} else {
					cb("err", undefined);
				}
			}

		], function(err, sharesChanges) {
			callback(err, sharesChanges);
		})
	}

	this.scrapeRequest = function(options, callback) {
		var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.min.js", "utf-8");
		request(options, function(error, response, body) {
			if (!error) {
				var html = iconv.decode(body, 'gb2312');
				jsdom.env({
					html: html,
					src: [jquery],
					encoding: null,
					decoding: 'GBK',
					done: function(errors, window) {
						var $ = window.$;
						callback(undefined, $);
					}
				});
			} else {
				callback(error, undefined);
			}
		});
	}

	this.scrapeLatestFundAssetAllocation = function(code, callback) {
		var that = this;
		var category = 'assetAllocationUrl';
		console.log('scrape latest fund asset allocation %s'.yellow, code);
		async.waterfall([
			function(cb) {
				that.getLastDate(code, category, function(err, date) {
					if (!err) {
						cb(undefined, date);
					} else {
						cb("err", undefined);
					}
				})
			},
			function(date, cb) {
				that.scrapeFundAssetAllocation(code, date, function(err, fundAssetAllocation) {
					if (fundAssetAllocation) {
						cb(undefined, fundAssetAllocation);
					} else {
						cb("err", undefined);
					}
				})
			}
		], function(err, returnFundAssetAllocation) {
			callback(err, returnFundAssetAllocation);
		})
	}

	this.scrapeLatestBondSectorBreakdown = function(code, callback) {
		var that = this;
		var category = 'industryInvestmentUrl';
		console.log('scrape latest fund bond sector breakdown %s'.yellow, code);
		async.waterfall([
			function(cb) {
				that.getLastDate(code, category, function(err, date) {
					if (!err) {
						cb(undefined, date);
					} else {
						cb("err", undefined);
					}
				})
			},
			function(date, cb) {
				that.scrapeBondSectorBreakdown(code, date, function(err, bondSectorBreakdown) {
					if (bondSectorBreakdown) {
						cb(undefined, bondSectorBreakdown);
					} else {
						cb("err", undefined);
					}

				})
			}
		], function(err, bondSectorBreakdown) {
			callback(err, bondSectorBreakdown);
		})
	}

	this.scrapeLatestEquitySectorBreakdown = function(code, callback) {
		var that = this;
		var category = 'industryInvestmentUrl';
		console.log('scrape latest equity sector breakdown %s'.yellow, code);
		async.waterfall([
			function(cb) {
				that.getLastDate(code, category, function(err, date) {
					if (!err) {
						cb(undefined, date);
					} else {
						cb("err", undefined);
					}
				})
			},
			function(date, cb) {
				that.scrapeEquitySectorBreakdown(code, date, function(err, equitySectorBreakdown) {
					if (equitySectorBreakdown) {
						cb(undefined, equitySectorBreakdown);
					} else {
						cb("err", undefined);
					}

				})
			}
		], function(err, equitySectorBreakdown) {
			callback(err, equitySectorBreakdown);
		})
	}



	return this;
};
