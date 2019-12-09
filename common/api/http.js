// const baseUrl = 'http://print.hongchen007.cn/index.php?s='; // mock地址
// const baseUrl = 'http://jw.hongchen007.cn/index.php?s='; // mock地址
// const baseUrl = 'http://39.100.41.225:8804/index.php?s='; // 白文彪
const baseUrl = 'https://print-dev.kaituocn.com/index.php?s='; // dev
const h5Url = 'https://print-dev.kaituocn.com/preview'; // h5 url地址
const wxappId = 10001;

const httpAjax = (url, jsonData) => {
	uni.showLoading({
		title: '加载中...',
		mask: true
	});
	let data = jsonData || {};
	//获取token
	if (uni.getStorageSync('token')) {
		data.token = uni.getStorageSync('token');
	}
	//获取用户id user_id
	// if (uni.getStorageSync('user_id')) {
	// 	data.user_id = uni.getStorageSync('user_id');
	// }
	data.wxapp_id = wxappId;
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}${url}`,
			method: 'post',
			data,
			success: (res) => {
				console.log(res.data);
				switch (res.data.code) {
					case 1:
						resolve(res.data.data);
						break;
					case -1:
						uni.navigateTo({
							url: '/pages/mine/login/login'
						});
						// token失效
						break;
					default:
						reject(res.data);
						break;
				}
			},
			fail: (error) => {
				reject(error);
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	});
};

/**
 * 打印文件上传
 */
const uploadFiles = (url, value, jsonData) => {
	let params = {
		url: `${baseUrl}${url}`,
		name: 'iFile',
		filePath: value,
		formData: {
			token: uni.getStorageSync('token'),
			wxapp_id: wxappId,
		}
	};
	if (jsonData) {
		for (let key in jsonData) {
			params.formData[key] = jsonData[key];
		}
	}
	return new Promise(async (resolve, reject) => {
		try {
			const [err, res] = await uni.uploadFile(params);
			console.log(res);
			if (res && res.data) {
				res.data = JSON.parse(res.data);
				switch (res.data.code) {
					case 1:
						resolve(res.data.data);
						break;
					case -1:
						// token失效
						uni.navigateTo({
							url: '/pages/mine/login/login.vue'
						});
						break;
					default:
						reject(res.data);
						break;
				}
			}
			if (err) {
				reject(err);
			}
		} catch (e) {
			reject({
				msg: '网络超时,请联系系统管理员'
			});
		}

	});
};

//文件下载
const downloadFiles = (url) => {
	let params = {
		url: url,
	};
	return new Promise(async (resolve, reject) => {
		const [err, res] = await uni.downloadFile(params);
		console.log(res);

		if (res) {
			resolve(res.tempFilePath);
		}
		if (err) {
			reject(err);
		}
	});
};
export {
	httpAjax,
	uploadFiles,
	h5Url,
	downloadFiles
};
