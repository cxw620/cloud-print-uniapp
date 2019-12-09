import {
	httpAjax
} from './http';

// 登陆
const userLogin = data => httpAjax('/api/user/login', data);
// 获取积分兑换列表
const couponCouponList = data => httpAjax('/api/coupon/couponList', data);
// 我的代金券
const couponMyCoupon = data => httpAjax('/api/user.coupon/myCoupon', data);
// 兑换代金券
const couponAddMyCoupon = data => httpAjax('/api/user.coupon/addMyCoupon', data);
//赠送代金券
const giveMyCoupon = data => httpAjax('/api/user.coupon/giveCoupon', data);
// 生日礼品
const userBirthday = data => httpAjax('/api/user/birthday', data);
// 领取生日礼品
const couponReceive = data => httpAjax('/api/coupon/receive', data);
// 消息列表
const NewsNewsList = data => httpAjax('/api/News/newsList', data);
// 消息详情
const newsNewsDetail = data => httpAjax('/api/news/newsDetail', data);
// 更改消息为已读
const newsReadToNews = data => httpAjax('/api/news/readToNews', data);
// 我的所有信息
const userMyGreade = () => httpAjax('/api/user/myGreade');
// 积分明细
const userPointRecord = data => httpAjax('/api/user/pointRecord', data);
// 我的钱包
const userMyWallet = data => httpAjax('/api/user/myWallet', data);
// 获取手机验证码(设置密码)
const userGetCode = data => httpAjax('/api/user/getCode', data);
// 首次设置密码--提交验证码
const firstPwdSub = data => httpAjax('/api/user/firstPwdSub', data);
// 设置密码
const userSetPwd = data => httpAjax('/api/user/setPwd', data);
// 忘记密码--获取手机验证码
const userForgetPwdCode = data => httpAjax('/api/user/forgetPwdCode', data);
// 忘记密码--输入验证码提交
const userForgetPwdSub = data => httpAjax('/api/user/forgetPwdSub', data);
// 修改密码
const userEditPwd = data => httpAjax('/api/user/editPwd', data);
// 忘记密码--设置密码
const userForgetPwd = data => httpAjax('/api/user/forgetPwd', data);
// 获取用户access_token
const getAccessToken = () => httpAjax('/api/user/getAccessToken');
// 设置生日
const userSetBirthday = data => httpAjax('/api/user/setBirthday', data);
// 我的偶像
const userMyIdol = data => httpAjax('/api/user/myIdol', data);
// 我的偶像  删除偶像
const userDelIdol = data => httpAjax('/api/user/delIdol', data);
//接受成为偶像
const acceptIdol = data => httpAjax('/api/user/addIdol', data)
// 粉丝列表
const userFanList = data => httpAjax('/api/user/fanList', data);
// 删除粉丝
const userDelFan = data => httpAjax('/api/user/delFan', data);
//接受成为粉丝
const acceptFans = data => httpAjax('/api/user/addFan', data)
// 添加偶像
const userAddIdol = data => httpAjax('/api/user/addIdol', data);
// 邀请二维码
const userInviteCode = data => httpAjax('/api/user/inviteCode', data);
//邀请海报信息
const intervalPoster = data => httpAjax('/api/user/posterInfo', data)
//接受邀请好友
const acceptInterval = data => httpAjax('/api/user/accessInvite', data)
//绑定支付宝
const bindAlipay = data => httpAjax('/api/user/bindAlipay', data);
//解除绑定支付宝
const deleteAlipay = data => httpAjax('/api/user/delAliyun', data);
//领取代金券
const collectVoucher = data => httpAjax('/api/user.coupon/receiveGiveCoupon', data)
// 是否设置支付密码
const isSetPwd = () => httpAjax('/api/user/isSetPwd');
// 领取好友赠送代金券之前代金券状态判断
const couponStatus = data=> httpAjax('/api/user.coupon/couponStatus',data);
export {
	userLogin,
	userBirthday,
	couponCouponList,
	couponMyCoupon,
	couponAddMyCoupon,
	couponReceive,
	NewsNewsList,
	newsNewsDetail,
	newsReadToNews,
	userMyGreade,
	userPointRecord,
	userMyWallet,
	userGetCode,
	userSetPwd,
	userForgetPwdCode,
	userEditPwd,
	userForgetPwdSub,
	userForgetPwd,
	getAccessToken,
	userSetBirthday,
	userMyIdol,
	userDelIdol,
	userFanList,
	userAddIdol,
	userInviteCode,
	userDelFan,
	bindAlipay,
	deleteAlipay,
	intervalPoster,
	giveMyCoupon,
	acceptIdol,
	acceptFans,
	acceptInterval,
	collectVoucher,
	isSetPwd,
	firstPwdSub,
	couponStatus
}
