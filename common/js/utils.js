function newAb2Str(arrayBuffer) {
	let unit8Arr = new Uint8Array(arrayBuffer);
	let encodedString = String.fromCharCode.apply(null, unit8Arr),
		decodedString = decodeURIComponent(escape((encodedString))); //没有这一步中文会乱码
	return decodedString;
}

/**
 * 弹窗提示
 * @param msg  提示信息
 */
const showMessage = (msg) => {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 2000
	})
}


import {
	submitOrder,
	buyOrder,
	delCacheOrderFile
} from '@/common/api/order';

/**
 * 提交订单
 * @param orderNo   订单编号
 * @param callback  回调函数
 */
const onSubmitOrder = async (orderNo, callback) => {
	try {
		await submitOrder({
			order_no: orderNo
		});
		if (callback) {
			callback();
		}
	} catch (e) {
		showMessage(e.msg);
	}
}

/**
 * 支付订单
 * @param orderNo   订单编号
 * @param payType		支付方式 10:余额支付 20:微信支付  
 * @param payPassword		支付密码
 * @param callback	回调函数
 */
const payOrder = async (orderNo, payType, payPassword, callback) => {
	let param = {
		order_no: orderNo,
		pay_type: payType
	};
	if (payPassword) {
		param.pay_pwd = payPassword
	}
	try {
		const result = await buyOrder(param);
		if (callback) {
			callback(result);
		}
	} catch (e) {
		showMessage(e.msg);
	}
}

/**
 * 验证是否为数字
 * @param value
 * @returns {boolean}
 */
const isNumber = value => {
	const paten = /^(-)?\d+(\.\d+)?$/;
	return !(paten.exec(value) == null || value === '');
};

/**
 * 删除订单文件
 */
const delOrderFile = async (orderNo, goodId, callback) => {
	try {
		const result = await delCacheOrderFile({
			order_no: orderNo,
			goods_id: goodId
		});
		if (callback) {
			callback(result);
		}
	} catch (e) {
		showMessage(e.msg);
	}
}



export {
	newAb2Str,
	showMessage,
	onSubmitOrder,
	payOrder,
	isNumber,
	delOrderFile
}
