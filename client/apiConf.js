/**
 * @author kekobin@163.com
 *
 * @file 项目配置：页面对应的服务端api接口
 * @param page -> 页面名称：对应路由和html
 * @param urls -> 页面需要的服务端接口，形式如下
 * 	 {
 *		 "name": "", //api名称，在模版中对请求结果的引用
 *		 "url":""
 *	 }
 * @param cache -> 是否需要缓存接口数据
 * 	 cache:true -> 页面路由为/demo/index
 * 	 cache:false -> 页面路由为/live/demo/index
 */

module.exports = {
	"{{-project_name-}}": {
		"pages": [
			{
				"page": "index",
				"urls": [],
				"cache": true
			}
		]
	}
}