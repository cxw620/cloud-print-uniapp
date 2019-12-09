<template>
	<view class="mine">
		<view class="mine-header">
			<!-- 个人头像名称 -->
			<view class="header-top">
				<view class="header-top-left">
					<image
						:src="info.avatarUrl"
						mode=""
						class="logo"
						v-if="loginType"
					></image>
					<image
						src="../../../static/img/xuanxuan-image.png"
						mode=""
						class="logo"
						v-else
					></image>
					<view class="info">
						<view class="info-name" v-if="loginType">{{ info.nickName }}</view>
						<view class="info-name" v-else>登录</view>
						<view class="info-btn">
							<text @click="accountMana">账号管理</text>
							<text class="iconfont iconxiaoyuhao-copy"></text>
						</view>
					</view>
				</view>
				<image
					@click="btnadvance('9')"
					src="../../../static/img/xiaoxi.png"
					mode=""
					class="message"
					v-if="loginType"
				></image>
			</view>
			<!-- 等级详情 -->
			<view class="header-grade">
				<view class="grade-top" @click="btnadvance('3')">
					<view class="grade-top-left" v-if="loginType">
						<text>{{ info.greade_name }}</text>
						<text>/{{ info.discount }}折</text>
					</view>
					<view class="grade-top-left" style="color: #fff;" v-else>--</view>

					<view class="grade-top-right" v-if="loginType">
						<text>共享特权</text>
						<text v-if="info.my_idol.type == 10">
							{{ info.my_idol.date.equity }}折
						</text>
					</view>
					<view class="grade-top-right" v-else>
						<text>共享特权</text>
						<text style="color: #fff;font-weight: 500;">--</text>
					</view>
				</view>
				<!-- 等级进度 -->
				<view class="grade-slider" @click="btnadvance('3')">
					<view class="slider-bak"></view>
					<view class="slider-bak-number" v-if="loginType">
						{{ info.expend_money ? info.expend_money : '' }}
					</view>
					<view
						class="slider-gone"
						:style="{ width: widths + '%' }"
						v-if="loginType"
					>
						<view class="gone-icon-cont">
							<view class="gone-icon"></view>
							<view class="gone-number">
								{{ info.point ? info.point : '' }}
							</view>
						</view>
					</view>
				</view>
				<!-- 等级积分期限 -->
				<view class="grade-integral" @click="btnadvance('3')">
					<view class="grade-integral-left">
						<view class="grade-integral-text">距离保级积分</view>
						<view class="grade-integral-text" v-if="loginType">
							{{ info.relegation_integral ? info.relegation_integral : '--' }}
						</view>
						<view class="notLogin" v-else>--</view>
					</view>
					<view class="grade-integral-broder"></view>
					<view class="grade-integral-right">
						<view class="grade-integral-text">当前等级有效期</view>
						<view class="grade-integral-text" v-if="loginType">
							{{ info.expire_time ? info.expire_time : '--' }}
						</view>
						<view class="notLogin" v-else>--</view>
					</view>
				</view>
				<!-- 我的偶像我的粉丝 -->
				<view class="grade-idol-fans">
					<view class="grade-idol" @click="btnadvance('1')">
						<view class="title">我的偶像</view>
						<view
							class="grade-idol-info"
							v-if="loginType && Number(info.my_idol.type) === 10"
						>
							<image
								:src="
									info.my_idol.date.avatarUrl
										? info.my_idol.date.avatarUrl
										: '../../../static/img/xuanxuan-image.png'
								"
								mode=""
							></image>
							<view class="grade-idol-info-name">
								<text>
									{{
										info.my_idol.date.nickName ? info.my_idol.date.nickName : ''
									}}
								</text>
								<text>
									{{ info.my_idol.date.name ? info.my_idol.date.name : '' }}/{{
										info.my_idol.date.equity ? info.my_idol.date.equity : 0
									}}折
								</text>
							</view>
						</view>
						<view class="grade-idol-info-notLogin" v-else>--</view>
					</view>
					<view class="grade-idol-fans-broder"></view>
					<view class="grade-fans" @click="btnadvance('2')">
						<view class="title">
							<view class="title-text">我的粉丝</view>
							<view class="iconfont iconhao"></view>
						</view>
						<view class="grade-fans-number" v-if="loginType">
							{{ info.my_fan ? info.my_fan : '0' }}
						</view>
						<view class="grade-idol-info-notLogin" v-else>--</view>
					</view>
				</view>
			</view>
			<!-- 我的剩余 积分  余额  代金券 -->
			<view class="mine-residue">
				<view class="grade-residue-item" @click="btnadvance('10')">
					<view class="title">我的积分</view>
					<view class="cont">{{ info.point ? info.point : '0' }}</view>
				</view>
				<view class="grade-residue-item" @click="btnadvance('7')">
					<view class="title">钱包余额</view>
					<view class="cont">{{ info.balance ? info.balance : '0.00' }}</view>
				</view>
				<view class="grade-residue-item" @click="btnadvance('4')">
					<view class="title">我的代金券</view>
					<view class="cont">
						{{ info.my_coupons_num ? info.my_coupons_num : 0 }}
					</view>
				</view>
			</view>
			<!-- 积分兑换 生日特权  邀请好友 -->
			<view class="mine-else">
				<view class="mine-else-item" @click="btnadvance('5')">
					<view class="iconfont iconzu27"></view>
					<text>积分兑换</text>
				</view>
				<view class="mine-else-item" @click="btnadvance('8')">
					<view class="iconfont iconzu38"></view>
					<text>生日特权</text>
				</view>
				<view class="mine-else-item" @click="btnadvance('6')">
					<view class="iconfont iconzu36"></view>
					<text>邀请好友</text>
				</view>
			</view>
			<!-- 绑定支付宝 -->
			<view class="" style="padding-bottom: 250upx;">
				<view class="alipay">
					<!-- 已绑定 -->
					<view class="alipay-binding" v-if="isCode == 2">
						<view class="alipay-binding-left">
							<text>支付宝账号：</text>
							<text>{{ accountVal }}</text>
						</view>
						<image
							src="../../../static/img/ziyuan.png"
							mode=""
							@click="deleteCode"
						></image>
					</view>
					<!-- 未绑定 -->
					<view class="alipay-notbound " v-if="isCode == 1">
						<text>快去</text>
						<text @click="binding">绑定支付宝</text>
						<text>,同步你的积分吧！</text>
					</view>
				</view>
			</view>
		</view>

		<mrhardTabbar></mrhardTabbar>
		<onAlipay
			@confirm="confirm"
			:hidden="hidden"
			@alipayClose="alipayClose"
		></onAlipay>
		<successAlipay
			:hidden="hidden"
			:isUsre="isUsre"
			@close="close"
		></successAlipay>
	</view>
</template>

<script>
import mrhardTabbar from '@/components/mrhard-tabbar/mrhard-tabbar.vue';
import onAlipay from '@/components/alipayModal/alipayModal.vue';
import successAlipay from '@/components/successModal/successModal.vue';
import {
	userBirthday,
	userMyGreade,
	bindAlipay,
	deleteAlipay,
	userMyIdol
} from '@/common/api/mine.js';

export default {
	components: {
		mrhardTabbar,
		onAlipay,
		successAlipay
	},
	data() {
		return {
			widths: '',
			registerType: false,
			loginType: true,
			confrimType: 2,
			title: '绑定支付宝',
			confirms: true,
			info: {
				my_idol: {
					type: 20
				}
			},
			hidden: 0, //1 绑定支付宝弹窗  2 是否成功弹出框
			idolInfo: {},
			isUsre: 0, //绑定是否成功  默认为0,
			isCode: 0, //是否有支付宝账号,
			accountVal: '', //账号,
			idolType: '',
			options_id: '',
			type: ''
		};
	},
	onLoad(options) {
		// this.options_id = options.id;
		// if(options.type){
		// 	this.type = options.type;
		// }
	},
	onShow() {
		//判断是否登陆
		// if (!uni.getStorageSync('token')) {
		// 	// this.loginType = true;
		// 	// return;
		// }
		this.getuserMyGreade();

		//判断是否有绑定的支付宝账号
		console.log(uni.getStorageSync('code'));
		// this.isCode = 1

		if (uni.getStorageSync('code')) {
			this.isCode = uni.getStorageSync('code');
		} else {
			this.isCode = 1;
		}

		uni.setStorageSync('options_id', this.options_id);
		uni.setStorageSync('type', this.type);
	},
	methods: {
		//账号管理
		accountMana() {
			console.log('1111');
			uni.navigateTo({
				url: '../../mine/account/account'
			});
		},
		//偶像信息
		async getMyIdol() {
			const result = await userMyIdol({});

			if (result.info.type == 20) {
			} else {
				this.idolInfo = result.info.date;
				this.idolType = result.info.type;
			}
		},

		confirmBtn(e) {
			console.log(e);
		},
		//获取我的所有信息
		async getuserMyGreade() {
			try {
				const result = await userMyGreade({});

				this.info = result.info;
				this.widths =
					(Number(this.info.point) / Number(this.info.expend_money)) * 100 > 100
						? 100
						: (Number(this.info.point) / Number(this.info.expend_money)) * 100;
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		// 检测此等级是否有礼品
		async getuserBirthday() {
			try {
				const result = await userBirthday({});
				console.log(result);
				if (result.info.type == 2) {
					uni.showToast({
						title: '当前等级没有生日礼品',
						icon: 'none'
					});
					return;
				} else {
					uni.navigateTo({
						url: '../../mine/birthday/birthday'
					});
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		//绑定支付宝
		binding() {
			//绑定弹窗
			this.hidden = 1;
		},

		async confirm(childValue) {
			if (childValue.accountVal.length != 11) {
				this.showMessage('输入正确的支付宝账号');
				return;
			}
			try {
				console.log(uni.getStorageSync('token'));
				const result = await bindAlipay({
					wxapp_id: 10001,
					token: uni.getStorageSync('token'),
					order_number: childValue.orderVal,
					alipay_account: childValue.accountVal
				});
				console.log(result);
				if (result.code == 1) {
					(this.hidden = 2), (this.isUsre = 2);
					(childValue.accountVal = ''), (childValue.orderVal = '');
				} else {
					(this.hidden = 2),
						(this.isUsre = 1),
						(childValue.accountVal = ''),
						(childValue.orderVal = ''),
						uni.setStorageSync('accountVal', result.info);
					this.accountVal = uni.getStorageSync('accountVal');
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		close() {
			if (this.isUsre == 1) {
				uni.setStorageSync('code', 2);
				this.isCode = uni.getStorageSync('code');
				this.hidden = 0;
			} else if (this.isUsre == 2) {
				this.isCode = 1;
				this.hidden = 0;
			}
		},
		alipayClose() {
			this.hidden = 0;
		},
		async deleteCode() {
			try {
				const result = await deleteAlipay({
					wxapp_id: 10001,
					token: uni.getStorageSync('token')
				});
				console.log(result);
				this.isCode = 1;
				uni.removeStorageSync('code');
				uni.removeStorageSync('accountVal');
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		//跳转
		btnadvance(e) {
			switch (e) {
				case '1':
					uni.navigateTo({
						url: '../../mine/idol/idol'
					});
					break;
				case '2':
					uni.navigateTo({
						url: '../../mine/fans/fans'
					});
					break;
				case '3':
					uni.navigateTo({
						url: '../../mine/memberShip/memberShip'
					});
					break;
				case '4':
					uni.navigateTo({
						url: '../../mine/kimsVolume/kimsVolume'
					});
					break;
				case '5':
					uni.navigateTo({
						url: '../../mine/integralConversion/integralConversion'
					});
					break;
				case '6':
					uni.navigateTo({
						url: '../../mine/sharePrivilege/sharePrivilege?codeType=1'
					});
					break;
				case '7':
					uni.navigateTo({
						url: '../../mine/balance/balance'
					});
					break;
				case '8':
					// 检测此等级是否有礼品
					this.getuserBirthday();
					break;
				case '9':
					uni.navigateTo({
						url: '../../mine/message/message'
					});
					break;
				case '10':
					uni.navigateTo({
						url: '../../mine/integral/integral'
					});
					break;
			}
		}
	}
};
</script>
<style scoped lang="scss">
.mine-header {
	background: #fd2316;
	box-sizing: border-box;
	padding-top: 15upx;
	height: 250upx;

	.header-top {
		display: flex;
		justify-content: space-between;
		padding-left: 48upx;
		align-items: center;
		margin-bottom: 28upx;

		.header-top-left {
			display: flex;
			align-items: center;
		}
	}

	.logo {
		width: 130upx;
		height: 130upx;
		margin-right: 28upx;
	}

	.message {
		width: 48upx;
		height: 49upx;
		margin-right: 66upx;
	}

	.info {
		.info-name {
			font-size: 36upx;
			font-family: Lantinghei SC;
			font-weight: 600;
			line-height: 36upx;
			color: rgba(255, 255, 255, 1);
			opacity: 1;
		}

		.info-btn {
			width: 112upx;
			height: 32upx;
			border: 2upx solid rgba(34, 34, 34, 1);
			opacity: 1;
			border-radius: 6upx;
			font-size: 18upx;
			font-weight: 200;
			color: rgba(34, 34, 34, 1);
			opacity: 1;
			display: flex;
			justify-content: center;
			margin-top: 6upx;
			align-items: center;

			.iconxiaoyuhao-copy {
				font-size: 24upx;
			}
		}
	}

	.header-grade {
		width: 670upx;
		height: 352upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
		opacity: 1;
		border-radius: 20upx;
		margin: 0 auto;

		.grade-top {
			height: 80upx;
			background: linear-gradient(
				170deg,
				rgba(15, 12, 11, 1) 0%,
				rgba(60, 58, 57, 1) 59%,
				rgba(47, 7, 7, 1) 100%
			);
			box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
			opacity: 1;
			border-top-right-radius: 20upx;
			border-top-left-radius: 20upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 35upx;
			box-sizing: border-box;

			.grade-top-left {
				display: flex;

				align-items: center;

				text {
					display: block;
					font-size: 28upx;
					font-weight: 600;
					color: rgba(255, 255, 255, 1);

					&:nth-of-type(2) {
						font-size: 24upx;
						margin-left: 6upx;
						font-weight: 200;
						color: rgba(253, 35, 22, 1);
					}
				}
			}

			.grade-top-right {
				display: flex;

				align-items: center;

				text {
					display: block;
					font-size: 24upx;
					font-weight: 200;
					color: rgba(196, 154, 87, 1);

					&:nth-of-type(2) {
						margin-left: 20upx;
						font-size: 28upx;
						font-weight: 600;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}

		.grade-slider {
			position: relative;

			.slider-bak {
				width: 100%;
				height: 12upx;
				background: rgba(206, 206, 206, 1);
				opacity: 1;
			}

			.slider-bak-number {
				width: 100%;
				text-align: right;
				box-sizing: border-box;
				margin-bottom: 20upx;
				padding-right: 20upx;

				font-size: 18upx;
				font-weight: 200;
				color: rgba(73, 73, 73, 1);
			}

			.slider-gone {
				position: absolute;
				left: 0;
				top: 0;

				height: 13upx;
				background: #ff343e;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				opacity: 1;

				.gone-icon-cont {
					position: relative;

					.gone-icon {
						width: 22upx;
						height: 22upx;
						position: absolute;
						right: -2upx;
						top: -13upx;
						border: 1px solid rgba(206, 206, 206, 1);
						background: #fff;
						border-radius: 50%;
					}

					.gone-number {
						position: absolute;
						left: -37upx;
						top: 15upx;
						width: 58upx;
						height: 20upx;
						line-height: 20upx;
						background: rgba(255, 52, 62, 1);
						opacity: 1;
						display: block;
						text-align: center;
						border-radius: 6upx;
						font-size: 14upx;
						font-weight: 200;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}

		.grade-integral {
			border-top: 1px solid rgba(226, 225, 225, 1);
			border-bottom: 1px solid rgba(226, 225, 225, 1);
			display: flex;
			height: 72upx;
			position: relative;
			align-items: center;
			justify-content: space-between;

			.grade-integral-left {
				width: 50%;
				text-align: center;

				font-weight: 200;

				color: rgba(73, 73, 73, 1);
				opacity: 1;

				.grade-integral-text {
					font-size: 16upx;
				}
			}

			.grade-integral-broder {
				.grade-integral-text {
					font-size: 16upx;
					margin: 4upx 0;
				}

				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				height: 50upx;
				width: 1px;
				background: rgba(240, 240, 240, 1);
			}

			.grade-integral-right {
				width: 50%;
				text-align: center;
				font-size: 16upx;
				font-weight: 200;
				color: rgba(73, 73, 73, 1);
				opacity: 1;
			}
		}

		.grade-idol-fans {
			position: relative;
			display: flex;
			padding-top: 20upx;
			box-sizing: border-box;

			.grade-idol {
				padding-left: 24upx;
				width: 50%;

				.title {
					font-size: 24upx;
					font-weight: 600;
					margin-bottom: 10upx;
					color: rgba(73, 73, 73, 1);
				}

				.grade-idol-info {
					display: flex;
					align-items: center;

					image {
						width: 75upx;
						height: 75upx;

						margin-right: 15upx;
					}

					.grade-idol-info-name {
						font-size: 24upx;
						font-weight: 600;
						color: rgba(73, 73, 73, 1);

						text {
							display: block;

							&:nth-of-type(2) {
								font-size: 16upx;
								font-weight: 200;
								color: rgba(73, 73, 73, 1);
							}
						}
					}
				}
			}

			.grade-idol-fans-broder {
				position: absolute;
				left: 0;
				right: 0;
				top: 55upx;
				margin: auto;
				width: 1px;
				height: 78upx;
				background: rgba(240, 240, 240, 1);
			}

			.grade-fans {
				box-sizing: border-box;
				padding-right: 22upx;
				width: 50%;

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.title-text {
						font-size: 24upx;
						font-weight: 600;
						color: rgba(73, 73, 73, 1);
					}

					.iconhao {
						color: #fd2316;
						font-size: 30upx;
					}
				}

				.grade-fans-number {
					text-align: center;
					font-size: 32upx;
					font-weight: 200;
					margin-top: 22upx;
					color: rgba(253, 35, 22, 1);
				}
			}
		}
	}
}

.mine-residue {
	width: 670upx;
	height: 152upx;
	margin: 0 auto;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	border-radius: 20upx;
	margin-top: 30upx;
	display: flex;
	justify-content: center;
	align-items: center;

	.grade-residue-item {
		flex: 1;

		.title {
			font-size: 24upx;
			font-weight: 600;
			color: rgba(73, 73, 73, 1);
			text-align: center;
		}

		.cont {
			height: 78upx;
			border-right: 2upx solid rgba(240, 240, 240, 1);
			text-align: center;
			line-height: 78upx;
			font-size: 32upx;
			font-weight: 200;
			color: rgba(253, 35, 22, 1);
		}

		&:nth-of-type(3) {
			.cont {
				border: 0px;
			}
		}
	}
}

.mine-else {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 670upx;
	height: 152upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	border-radius: 20upx;
	margin: 0 auto;
	margin-top: 30upx;
	text-align: center;

	.mine-else-item {
		flex: 1;

		.iconfont {
			font-size: 50upx;
			color: #fd2316;
		}

		text {
			font-size: 24upx;
			font-weight: 200;
			color: rgba(73, 73, 73, 1);
		}
	}
}

.notLogin {
	font-size: 32upx;
	color: #919191;
}

.grade-idol-info-notLogin {
	color: #fd2316;
	text-align: center;
}

.alipay {
	width: 670upx;
	height: 90upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	box-sizing: border-box;
	padding: 0 34upx;
	border-radius: 20upx;
	margin: 0 auto;
	margin-top: 28upx;

	.alipay-binding {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.alipay-binding-left {
			display: flex;
			align-items: center;

			text {
				display: block;
				font-size: 24upx;
				font-weight: 600;
				color: rgba(115, 115, 115, 1);
			}
		}

		image {
			width: 35upx;
			height: 35upx;
		}
	}

	.alipay-notbound {
		display: flex;
		align-items: center;
		height: 100%;

		text {
			display: block;
			font-size: 24upx;
			font-weight: 600;
			color: rgba(35, 35, 35, 1);

			&:nth-of-type(2) {
				color: #fd2316;
			}
		}
	}
}
</style>
