var async = require('async');
var assert = require('assert');
var helper = require('../helper');
var moment = require('moment');
var _ = require('lodash');

xdescribe('engine service tests', function() {
    var scraperService;
    beforeEach(function(done) {
        app.container.resolve({}, function(ScraperService) {
            scraperService = ScraperService;
        });
        app.container.resolve({}, function( RawDB) {
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
    describe('service test operations', function () {

        it('get all codes', function (done) {
            var Funds=[
                {Name:'华夏大盘精选',Code:'111111'},
                {Name:'上海大盘精选',Code:'111121'},
                {Name:'北京大盘精选',Code:'111311'},
                {Name:'广东大盘精选',Code:'114111'},
                {Name:'福建大盘精选',Code:'351111'},
                {Name:'深圳大盘精选',Code:'611111'},
                {Name:'华大大盘精选',Code:'151111'},
                {Name:'华桥大盘精选',Code:'214311'},
            ];
            helper.createInstances('FundBasicModel', Funds, function(){
                scraperService.getAllCodes(function(codes){
                    assert.equal(codes.length, 8)
                    assert.equal(codes[0], '214311')
                    assert.equal(codes[7], '111111')
                    done();
                })
            })
        });
    });
});

























