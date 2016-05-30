var config;
if(process.env.NODE_ENV === 'test'){
	config = require('./config/test');
	if(process.env.DB_LOG)
	config.dbLogging = console.log;
}
if(process.env.NODE_ENV === 'local') {
	config = require('./config/local');
}
if(process.env.NODE_ENV === 'dev'){
	config = require('./config/dev');
}
if(process.env.NODE_ENV === 'prod'){
	config = require('./config');
}

if(config.newrelic_key) {
	var newrelic = require('newrelic');
}

global.app = require('../app');
global.app.container.register('Configs', config);
