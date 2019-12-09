<template>
	<view>
		<view class="" v-if="codeType == 1">
			<image :src="info" mode="" class="code-img"></image>
			<view class="friend">
				<view class="describe-icon">*</view>
				<view class="describe-text">
					接收邀请, 成为小程序用户, 并获得5元代金券。
				</view>
			</view>
			<button class="btn-class-red" data-type="1" @click="fridentsAccept">
				接受邀请
			</button>
		</view>
		<view class="" v-if="codeType == 2">
			<image :src="info" mode="" class="code-img"></image>

			<view class="share-text">
				<text>我的奖励</text>
				<text>享受偶像的打印折扣</text>
				<text>我的贡献</text>
				<text>您得到积分的50%自动转到偶像账户</text>
			</view>

			<button class="btn-class-red" data-type="2" @click="fansAccept">
				接受邀请
			</button>
		</view>
		<view class="" v-if="codeType == 3">
			<image :src="info" mode="" class="code-img"></image>

			<view class="share-text">
				<text>我的奖励</text>
				<text>获得粉丝得到积分的50%</text>
				<text>我的贡献</text>
				<text>粉丝享受我的打印折扣</text>
			</view>
			<button class="btn-class-red" data-type="3" @click="idolAccept">
				接受邀请
			</button>
		</view>
		<view v-if="codeType == 4">
			<view class="item-member">
				<text class="member">
					{{
						couponInfo.user_nick ? couponInfo.user_nick : '好友'
					}}送您一张代金券
				</text>
			</view>
			<view class="lomsValime-item">
				<image
					src="../../../static/img/copybg.png"
					mode=""
					class="item-logo"
				></image>
				<view>
					<view class="item-top">
						<view class="use-money">￥{{ couponInfo.reduce_price }}</view>
					</view>
					<view class="item-bottom">
						<text>使用日期截止至</text>
						<text>{{ couponInfo.end_time }}</text>
					</view>
				</view>
			</view>
			<view class="receive" @click="getCollect(couponInfo.user_coupon_id)">
				立即领取
			</view>
		</view>
	</view>
</template>

<script>
import {
	acceptIdol,
	acceptFans,
	acceptInterval,
	collectVoucher,
	userInviteCode,
	couponStatus
} from '@/common/api/mine.js';
export default {
	data() {
		return {
			codeType: 1,
			info: '',
			reduce_price: '1.50',
			end_time: '2019.12.30',
			give_time: '',
			couponInfo: {},
			options_id: '', //赠送人id
			coupon_id: '', //赠送代金券id
			name: '',
			discount: ''
		};
	},
	onLoad(e) {
		console.log('scene');
		console.log(e);
		console.log(e.scene);
		console.log('scene');
		if (e.scene) {
			let informationArr = [];
			console.log(e.scene.split('.'));
			informationArr = e.scene.split('.');
			uni.setStorageSync('user_id', informationArr[0]);
			uni.setStorageSync('codeType', informationArr[1]);
			console.log('处理过的scene');
			console.log(informationArr);
			console.log('处理过的scene');
		}
		//获取赠送类型   4：代金卷
		this.codeType = e.codeType ? e.codeType : uni.getStorageSync('codeType');
		uni.setStorageSync('codeType', this.codeType);
		if (e.user_coupon_id) {
			uni.setStorageSync('user_coupon_id', e.user_coupon_id);
			uni.setStorageSync('give_time', e.give_time);
		}
		if (e.user_id) {
			uni.setStorageSync('user_id', e.user_id);
			uni.setStorageSync('discount', e.discount);
			uni.setStorageSync('name', e.name);
		}
		this.name = uni.getStorageSync('name');
		this.discount = uni.getStorageSync('discount');
		let that = this;
		uni.checkSession({
			success(e) {
				console.log(e);
				switch (Number(that.codeType)) {
					case 4:
						that.getCouponStatus();
						break;
					default:
						that.getuserInviteCode(that.codeType);
				}
			},
			fail(e) {
				uni.reLaunch({
					url: `/pages/mine/login/login?codeType=${that.codeType}`
				});
				return;
				console.log(e);
			}
		});
		console.log(this.codeType);
	},
	methods: {
		/* 获取代金卷 */
		async getCouponStatus() {
			try {
				console.log(
					uni.getStorageSync('user_coupon_id'),
					uni.getStorageSync('give_time')
				);
				const reslut = await couponStatus({
					user_coupon_id: uni.getStorageSync('user_coupon_id'),
					time: uni.getStorageSync('give_time')
				});
				console.log(reslut);
				this.couponInfo = reslut.info;
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		/* 验证是否登陆 */
		async checkSession() {
			try {
				const [err, res] = await uni.checkSession();
				if ((err && err.errMsg) || !uni.getStorageSync('token')) {
					uni.navigateTo({
						url: `/pages/mine/login/login?codeType=${this.codeType}`
					});
					return;
				}
			} catch (e) {
				//TODO handle the exception
			}
		},

		//获取邀请码  1：新用户  2粉丝  3偶像
		async getuserInviteCode(type) {
			try {
				const result = await userInviteCode({
					type: type,
					page: 'pages/mine/interval/interval',	
					invite_id: uni.getStorageSync('user_id')
				});
				this.info = `data:image/png;base64,${result.info}`;
			} catch (e) {
				//TODO handle the exception
			}
		},
		//接受成为偶像
		async idolAccept() {
			console.log('接受成为偶像');
			try {
				const result = await acceptIdol({
					user_id: uni.getStorageSync('user_id'),
					is_new: uni.getStorageSync('is_new')
				});
				this.showMessage('领取成功！');
				uni.removeStorageSync('codeType');
				uni.removeStorageSync('user_id');
				setTimeout(() => {
					uni.switchTab({
						url: '../../tabbar/index/index'
					});
				}, 2000);
			} catch (e) {
				this.showMessage(e.msg);
				setTimeout(() => {
					uni.switchTab({
						url: '../../tabbar/index/index'
					});
				}, 2000);
			}
		},
		//接受成为粉丝
		async fansAccept() {
			console.log('接受成为粉丝');
			try {
				const result = await acceptFans({
					dealer_id: uni.getStorageSync('user_id'),
					is_new: uni.getStorageSync('is_new')
				});
				this.showMessage('接收成功！');
				uni.removeStorageSync('user_id');
				uni.removeStorageSync('codeType');
				setTimeout(() => {
					uni.switchTab({
						url: '../../tabbar/index/index'
					});
				}, 2000);
			} catch (e) {
				this.showMessage(e.msg);
				setTimeout(() => {
					uni.switchTab({
						url: '../../tabbar/index/index'
					});
				}, 2000);
			}
		},
		//接受邀请好友
		async fridentsAccept() {
			console.log('接受邀请好友');
			try {
				const result = await acceptInterval({
					invite_id: uni.getStorageSync('user_id'),
					is_new: uni.getStorageSync('is_new')
				});
				console.log(result, '好友');
				uni.removeStorageSync('user_id');
				uni.removeStorageSync('codeType');
				setTimeout(() => {
					uni.switchTab({
						url: '../../tabbar/index/index'
					});
				}, 2000);
			} catch (e) {
				this.showMessage(e.msg);
				setTimeout(() => {
					uni.switchTab({
						url: '../../tabbar/index/index'
					});
				}, 2000);
			}
		},
		//代金券
		async getCollect(coupon_id) {
			console.log('接受代金券');
			try {
				const result = await collectVoucher({
					is_new: uni.getStorageSync('is_new'),
					user_coupon_id: coupon_id
				});
				this.showMessage('领取成功！');
				uni.removeStorageSync('give_time');

				uni.removeStorageSync('codeType');
				uni.removeStorageSync('user_coupon_id');
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/mine/kimsVolume/kimsVolume'
					});
				}, 2000);
			} catch (e) {
				this.showMessage(e.msg);
				setTimeout(() => {
					uni.switchTab({
						url: '../../tabbar/index/index'
					});
				}, 2000);

				//TODO handle the exception
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.code-img {
	width: 348upx;
	height: 348upx;
	display: block;
	margin: 0 auto;
	margin-bottom: 14upx;
	margin-top: 94upx;
}

.share-hint {
	text-align: center;
	font-size: 20upx;
	font-weight: 200;
	line-height: 32upx;
	color: rgba(51, 51, 51, 1);
}

.describe {
	padding-left: 76upx;
	padding-right: 54upx;
	padding-bottom: 110upx;
	box-sizing: border-box;
	.describe-icon {
		color: #fd2316;
		font-weight: 600;
		font-size: 32upx;
	}
	.describe-top {
		display: flex;
		align-items: center;

		text {
			color: #fd2316;
			font-size: 60upx;

			&:nth-of-type(1) {
				margin-top: 10upx;
			}

			&:nth-of-type(2) {
				margin-left: 5upx;
				font-size: 20upx;
				font-weight: 200;
				color: rgba(51, 51, 51, 1);
			}
		}
	}

	.describe-title {
		font-size: 28upx;
		font-family: Lantinghei SC;
		font-weight: 200;
		line-height: 32upx;
		color: rgba(44, 41, 40, 1);
	}

	.describe-text {
		font-size: 20upx;
		font-weight: 200;
		line-height: 32upx;
		color: rgba(67, 67, 67, 1);
		margin-bottom: 16upx;
	}

	.describe-hint {
		padding-right: 20upx;
		font-size: 20upx;
		font-weight: 200;
		line-height: 32upx;
		color: rgba(51, 51, 51, 1);
	}
}

.btn-class-red {
	position: fixed;
	bottom: 0;
}

.share-text {
	margin-top: 130upx;

	text {
		display: block;
		text-align: center;
		font-size: 30upx;
		font-weight: 600;
		line-height: 60upx;
		color: rgba(15, 12, 11, 1);
	}
}
.item-member {
	width: 670upx;
	margin: 0 auto;
	margin-top: 22upx;
	opacity: 1;
	display: flex;
	justify-content: space-between;
	.member {
		width: 244upx;
		height: 36upx;
		font-size: 26upx;
		font-family: Lantinghei SC;
		font-weight: 200;
		line-height: 36upx;
		color: rgba(74, 74, 74, 1);
		opacity: 1;
	}
	.item-time {
		width: 238upx;
		height: 30upx;
		font-size: 22upx;
		font-family: Lantinghei SC;
		font-weight: 200;
		line-height: 30upx;
		color: rgba(74, 74, 74, 1);
		opacity: 1;
	}
}
.receive {
	width: 590upx;
	height: 56upx;
	font-size: 18px;
	font-family: Lantinghei SC;
	font-weight: 600;
	line-height: 50upx;
	color: rgba(253, 35, 22, 1);
	opacity: 1;
	margin: 0 auto;
	text-align: center;
	margin-top: 104upx;
}
.lomsValime-item {
	width: 670upx;
	height: 160upx;

	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	border-radius: 20upx;
	margin: 0 auto;
	margin-top: 22upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 40upx;
	.item-logo {
		width: 82upx;
		height: 86upx;
		opacity: 1;
		margin-right: 42upx;
	}

	.item-top {
		border-bottom: 1px solid rgba(226, 225, 225, 1);
		width: 506upx;
		margin-bottom: 22upx;
		.use {
			.use-money {
				font-size: 32upx;
				font-weight: 600;
				line-height: 24upx;
				color: rgba(253, 35, 22, 1);
				opacity: 1;
			}
		}
	}

	.item-bottom {
		margin-top: 16upx;
		// padding-left: 100upx;
		padding-right: 36upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 506upx;

		text {
			font-size: 16upx;

			font-weight: 200;
			line-height: 24upx;
			color: rgba(151, 151, 151, 1);
			opacity: 1;
		}
	}
}
.friend {
	display: flex;
	justify-content: center;
	align-items: center;
	.describe-icon {
		color: #fd2316;
		font-weight: 600;
		font-size: 40upx;
		margin-top: 40upx;
		margin-left: 20upx;
	}
	.describe-text {
		font-size: 20upx;
		font-weight: 200;
		margin-top: 52upx;

		color: rgba(34, 34, 34, 1);
	}
}
</style>
