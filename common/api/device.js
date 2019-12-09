import {
	httpAjax
} from './http';

// 获取设备列表
const getMachineList = data => httpAjax('/api/Printer/machineList', data);
// 获取单条设备详情
const getMachineDetail = data => httpAjax('/api/Printer/machineDetail', data);
// 请求打印
const inspect = data => httpAjax('/api/foreign/inspect', data);
// 验证打印机
const checkPrintId = data => httpAjax('/api/Printer/checkPrintId', data);

export {
	getMachineList,
	getMachineDetail,
	inspect,
	checkPrintId
}
