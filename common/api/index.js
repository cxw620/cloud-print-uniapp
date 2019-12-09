import {
	httpAjax,
	uploadFiles,
	downloadFiles
} from './http';
// 首页轮播图
const wxappCarouselIndex = data => httpAjax('/api/wxapp.carousel/index', data);
// 获取设备列表
const PrinterMachineList = data => httpAjax('/api/Printer/machineList', data);
// 打印帮助不再提醒
const helpsHide = data => httpAjax('/api/wxapp.helps/hide', data);
//所有打印帮助图片
const helpsGethelp = data => httpAjax('/api/wxapp.helps/gethelp', data);
//人像抠图返回透明图
const uploadPortraitCutout = data => uploadFiles('/api/upload/portraitCutout', data);
// 打印文件上传
const printFileUpload = (data, jsonData) => uploadFiles('/api/Upload/printFileUpload', data, jsonData);
// 上传缩印文件
const zoomPrintFileUpload = (data, jsonData) => uploadFiles('/api/upload/zoomPrintFileUpload', data, jsonData);
// 首页相关数量信息
const homeCount = data => httpAjax('/api/home/homeCount', data);
//百度 网盘获取文档列表
const baiduGetDocumentList = data => httpAjax('/api/baidu/getDocumentList', data);
// 百度 搜索文件
const baiduSearch = data => httpAjax('/api/baidu/search', data);
// 百度 获取文件详情
const baiduGetDetails = data => httpAjax('/api/baidu/getDetails', data);
// 百度 网盘下载到本地
const baidudownloadFiles = data => downloadFiles(data)

export {
	wxappCarouselIndex,
	PrinterMachineList,
	helpsHide,
	helpsGethelp,
	baiduGetDocumentList,
	uploadPortraitCutout,
	printFileUpload,
	homeCount,
	baiduSearch,
	baiduGetDetails,
	baidudownloadFiles,
	zoomPrintFileUpload
}
