import {
	httpAjax
} from './http';

// 获取规格信息列表
const specList = data => httpAjax('/api/price/specList', data);

// 获取预交易订单信息
const preOrderDetail = data => httpAjax('/api/upload/preOrderDetail', data);

// 预览打印文件
const previewPrintFile = data => httpAjax('/api/upload/previewPrintFile', data);

// 重置预创建订单价格
const resetPrice = data => httpAjax('/api/upload/resetPrice', data);

// 订单列表
const orderList = data => httpAjax('/api/user.order/lists', data);

// 提交订单
const submitOrder = data => httpAjax('/api/order/submitOrder', data);

// 立即付款
const buyOrder = data => httpAjax('/api/order/buyNow', data);

// 获取订单详情
const orderDetail = data => httpAjax('/api/user.order/detail', data);

// 订单退款
const orderRefund = data => httpAjax('/api/user.order/refund', data);

// 取消订单
const orderCancel = data => httpAjax('/api/user.order/cancel', data);

// 获取打印订单列表
const printOrders = data => httpAjax('/api/printer/getprintorders', data);

// 删除订单
const orderDelete = data => httpAjax('/api/user.order/delete', data);

// 获取缩印预交易订单处理信息
const preZoomOrderHandle = data => httpAjax('/api/upload/preZoomOrderHandle', data);

// 切换缩印规格事件
const zoomChange = data => httpAjax('/api/upload/zoomChange', data);

// 预览缩印文件
const previewZoomPrintFile = data => httpAjax('/api/upload/previewZoomPrintFile', data);

// 左滑删除待打印预交易订单文件
const delCacheOrderFile = data => httpAjax('/api/upload/delCacheOrderFile', data);

export {
	specList,
	preOrderDetail,
	previewPrintFile,
	resetPrice,
	orderList,
	submitOrder,
	buyOrder,
	orderDetail,
	orderCancel,
	orderRefund,
	printOrders,
	orderDelete,
	preZoomOrderHandle,
	zoomChange,
	previewZoomPrintFile,
	delCacheOrderFile
}
