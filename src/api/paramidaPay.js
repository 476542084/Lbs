import Vue from 'vue'
// import Config from "./config.js"



// Vue-resource拦截器




// 用vue-resource http get post
class _ParamidaPay {
	constructor() {
		this.ApiCaller = {
			host:'',
			uploadhost:'',
			// get请求
			get(uri, data={}, success=null, error=null) {
				// this.jsonp(uri, data, success, error);
				// return;
				if(success == undefined) {
					success = null
				}
				if(error == undefined) {
					error = null
				}
				Vue.http.get(this.host + uri, {params:data,_timeout:5000}).
				then((response)=>{
					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}, (response)=>{
					error(this.parseBody(response))
				})
			},
			// post请求
			post(uri, data={}, success, error) {
				// this.jsonp(uri, data, success, error);
				// return;
				Vue.http.post(this.host + uri, this.formUrlencode(data) ,{headers:{"content-type":"application/x-www-form-urlencoded"}, _timeout:30000}).
				then((response)=>{
					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}, (response)=>{
					error(this.parseBody(response))
				})
			},
			// 上传Excel表格
			postFile(uri, data={}, success, error) {
				// this.jsonp(uri, data, success, error);
				// return;
				Vue.http.post(this.host + uri, data ,{headers:{"content-type":"application/x-www-form-urlencoded"}, _timeout:30000}).
				then((response)=>{
					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}, (response)=>{
					error(this.parseBody(response))
				})
			},
			// put请求
			put(uri, data={}, success, error) {
				Vue.http.put(this.host + uri, this.formUrlencode(data),{headers:{"content-type":"application/x-www-form-urlencoded"}, _timeout:30000}).
				then((response) => {
					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}), (response)=>{
					error(this.parseBody(response))
				}
			},
			// delete请求
			delete(uri, data={}, success, error) {
				data._method = 'DELETE'
				Vue.http.post(this.host + uri, this.formUrlencode(data),{headers:{"content-type":"application/x-www-form-urlencoded"}, _timeout:30000}).
				then((response) => {
					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}), (response)=>{
					error(this.parseBody(response))
				}
			},
			// jsonp
			post2(uri, data={}, success, error) {
				this.jsonp(uri, data, success, error);
				return;
				Vue.http.post(this.host + uri, this.formUrlencode(data) ,{headers:{"content-type":"application/x-www-form-urlencoded"}, _timeout:30000}).
				then((response)=>{

					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}, (response)=>{
					error(this.parseBody(response))
				})
			},
			// 上传图片的服务器地址
			uploadPost(uri, data={}, success, error) {
				Vue.http.post(this.uploadhost + uri, data ,{headers:{"content-type":"application/x-www-form-urlencoded"}, _timeout:30000}).
				then((response)=>{
					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}, (response)=>{
					error(this.parseBody(response))
				})
			},
			// 下载
			down(uri, data={}, success, error) {
				window.open(this.host + uri+"?"+this.formUrlencode(data))
			},
			//
			jsonp(uri, data={}, success, error) {
				Vue.http.jsonp(this.host + uri+"?"+this.formUrlencode(data)).
				then((response)=>{
					let parsedBody = this.parseBody(response)
					success(parsedBody)
				}, (response)=>{
					error(this.parseBody(response))
				})
			},
			
			// 将字符串转为url格式编码
			formUrlencode(d) {
				let data = ""
				for(let key in d) {
					data += "&" + key + "=" + encodeURIComponent(d[key])
				}
				return data.substr(1)
			},

			// 转为JSON对象
			parseBody(response) {
				if(response.body.errcode == '103'){
					window.location.href = '/'
				}
				if(!response.ok) {
					return {
						status:response.body.errcode,
						info:response.statusText,
						data:{}
					}
				}
				try{
					if(typeof response.body == 'string') {
						response.body = JSON.parse(response.body)
					}
					if(response.body.errcode == '103'){
						window.location.href = '/'
					}
					return response.body
				} catch(ex) {
					return {
						status:100,
						info:"server error!",
						data:{}
					}
				}
			}
    };

		this.transManager = {
			processors:[],
			newProcessor:function(id, processor) {
				this.processors[id] = processor
			},
			newTrans:function(vueInstance, channel, order) {
				for(var key in this.processors) {
					if(key == channel.channel) {
						this.processors[key](vueInstance,channel, order);
						return;
					}
				}
				alert("unkown payment method!")
			}
		}
	}
}

const ParamidaPay = new _ParamidaPay()
export default ParamidaPay





