// import {baseUrl} from './envConfig'
// import store from '@/store/store'
// 将字符串转为url格式编码
function formUrlencode(d){
	let data = ""
	for(let key in d) {
		data += "&" + key + "=" + encodeURIComponent(d[key])
	}
	return data.substr(1)
}

export default async(url = '', data = {}, type = 'GET', upload = false, method = 'fetch') => {
	type = type.toUpperCase();
	// url = baseUrl + url;

	if (type === 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	if (window.fetch && method === 'fetch') {
		console.log('data',data)
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization':'JWT '+ store.getState('forum').forumData.token
			},
			mode: "cors",
			cache: "no-cache"
        }

		if (type === 'POST' || type === 'PUT') {
            if (!upload) {
				console.log('data22',data)
                // Object.defineProperty(requestConfig, 'body', {
                //     value: JSON.stringify(data)
				// })
				requestConfig.body = formUrlencode(data)
            } else {
				
                requestConfig = {
                    ...requestConfig,
                    headers: {
                        'Accept': 'application/json',
                        // 'Authorization':'JWT '+ store.getState('forum').forumData.token,
                    },
                    body: data,
                }
            }
        }
		
		try {
            const response = await fetch(url, requestConfig)
            const responseJson = await response.json()
            // responseJson['status'] = parseInt(response.status)
            return responseJson
		} catch (error) {
            //未知错误
            alert('系统错误，请稍后重试')
			throw new Error(error)
		}
	} else {
		return new Promise((resolve, reject) => {
            let requestObj;
            //兼容IE浏览器
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				// requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type === 'POST') {
				sendData = JSON.stringify(data);
			}
			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState === 4) {
					if (requestObj.status === 200) {
						let obj = requestObj.response
						
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}