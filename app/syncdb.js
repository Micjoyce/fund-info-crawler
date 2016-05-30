app.container.resolve(function(ScraperService, RawDB, CalcDB) {
    RawDB.sync({logging:true});
	CalcDB.sync({logging:true});
});