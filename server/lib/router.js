var request = require('./request');
var apiConfig = require('../config/api');
var path = require('path');

module.exports = function(app) {
	for (var appName in apiConfig) {
		var appConf = apiConfig[appName],
		    pages = apiConfig['pages'],
			
console.log('======pages=======')
console.log(appConf)
console.log(pages)

		pages.forEach(function(pageItem) {
			console.log('---pageItem---')
			console.log(pageItem)

			var urls = pageItem['urls'],
				page = pageItem['page'];

			app.use('/' + appName + '/' + page, function(req, res, next) {
				request(req, urls, function(data) {
					//根据这个在页面中判断是否登录
					data.yyuid = req.cookies.yyuid;

					// res.render(path.join(__dirname, '../views/' + appName + 'View/index'), data);
					res.render(path.join(__dirname, '../views/' + page), data);
				});
			});	
		});
	}
}