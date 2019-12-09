<template>
	<view class="pay-panel">
		<view class="pay-order">
			<view @click="closePay">x</view>
			<view>支付</view>
			<view>
				需支付金额
				<text>￥{{ payPrice }}</text>
				元
			</view>
			<view class="pay-option">
				<view
					v-for="(item, index) in radioList"
					:key="item.name"
					@click="changePay(index)"
				>
					<view>
						<image :src="item.icon" />
						{{ item.name }}
						<text>{{ item.text }}</text>
					</view>
					<view :class="{ active: index === checkedIndex }" />
				</view>
			</view>
			<view class="pay-btn" @click="toPay">确认支付{{ payPrice }}元</view>

			<confirm-modal
				v-if="showConfirm"
				:title="confirmObj.title"
				:text="confirmObj.text"
				@clickLeft="showConfirm = false"
				@clickRight="toSetPwd"
			/>

			<pay-password
				v-if="showPassword"
				@closePassword="showPassword = false"
				@balancePay="balancePay"
			/>
		</view>
	</view>
</template>

<script>
import { userMyGreade, isSetPwd } from '@/common/api/mine.js';
import { payOrder, onSubmitOrder } from '@/common/js/utils.js';
import payPassword from '../payPassword/payPassword.vue';

export default {
	components: { payPassword },
	props: {
		payPrice: {
			type: String,
			default: '0'
		},
		orderNo: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			showConfirm: false,
			confirmObj: {
				title: '你未设置支付密码',
				text: '确认设置支付密码，提交该笔订单'
			},
			radioList: [
				{
					icon: require('@/static/img/wechat.png'),
					type: 20,
					name: '微信支付'
				},
				{
					icon: require('@/static/img/balance.png'),
					type: 10,
					name: '余额支付',
					text: ''
				}
			],
			checkedIndex: 0,
			balance: 0,
			showPassword: false
		};
	},
	mounted() {
		this.getUserBalance();
		if (Number(this.payPrice) === 0) {
			this.radioList = [
				{
					icon: require('@/static/img/balance.png'),
					type: 10,
					name: '余额支付',
					text: ''
				}
			];
		}
	},
	methods: {
		toSetPwd() {
			onSubmitOrder(this.orderNo, () => {
				uni.navigateTo({
					url: '/pages/mine/forgetPassword/forgetPassword'
				});
			});
		},

		/* 支付订单 */
		toPay() {
			if (
				this.radioList[this.checkedIndex].type === 10 &&
				this.balance < Number(this.payPrice)
			) {
				this.showMessage('您账户余额不足！');
				return;
			}
			if (this.radioList[this.checkedIndex].type === 10) {
				this.getIsSetPwd();
				return;
			}

			// 微信支付
			payOrder(
				this.orderNo,
				this.radioList[this.checkedIndex].type,
				'',
				data => {
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: data.payment.timeStamp,
						nonceStr: data.payment.nonceStr,
						package: 'prepay_id=' + data.payment.prepay_id,
						signType: 'MD5',
						paySign: data.payment.paySign,
						success: () => {
							this.$emit('complete');
						},
						fail: err => {
							if (err.errMsg === 'requestPayment:fail cancel') {
								this.showMessage('取消支付');
							} else {
								this.showMessage(err.errMsg);
							}
						}
					});
				}
			);
		},

		/* 判断是否设置了交易密码 */
		async getIsSetPwd() {
			try {
				const result = await isSetPwd();
				if (result.is_set_pwd) {
					this.showPassword = true;
				} else {
					this.showConfirm = true;
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 余额支付
		 * @param {Object} password
		 */
		balancePay(password) {
			this.showPassword = false;
			payOrder(
				this.orderNo,
				this.radioList[this.checkedIndex].type,
				password,
				data => {
					this.$emit('complete', data.order_id);
				}
			);
		},

		/* 获取用户信息取余额 */
		async getUserBalance() {
			try {
				const result = await userMyGreade();
				this.balance = Number(result.info.balance);
				this.radioList[1].text =
					this.balance < Number(this.payPrice) ? '余额不足' : '';
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 更改支付索引
		 * @param {Object} index
		 */
		changePay(index) {
			this.checkedIndex = index;
		},

		/* 关闭支付窗口 */
		closePay() {
			this.checkedIndex = 0;
			this.$emit('closePay');
		}
	}
};
</script>

<style lang="scss" scoped>
.pay-panel {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	display: flex;
	align-items: flex-end;
	z-index: 999;
}
.pay-order {
	width: 100%;
	height: 490upx;
	background: #fff;
	& > view {
		&:nth-child(1) {
			text-align: right;
			color: #767676;
			font-weight: bold;
			font-size: 40upx;
			box-sizing: border-box;
			height: 40upx;
			line-height: 40upx;
			padding-right: 40upx;
		}
		&:nth-child(2) {
			text-align: center;
			font-size: 26upx;
			color: #0f0c0b;
		}
		&:nth-child(3) {
			font-size: 22upx;
			color: #0f0c0b;
			text-align: center;
			margin-bottom: 100upx;
			text {
				color: #e51c23;
			}
		}
	}

	.pay-option {
		& > view {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding-left: 66upx;
			padding-right: 40upx;
			margin-bottom: 44upx;
			& > view {
				height: 40upx;
				line-height: 40upx;
				&:nth-child(1) {
					color: #0f0c0b;
					font-size: 24upx;
					image {
						width: 48upx;
						height: 39upx;
						vertical-align: middle;
						margin-right: 20upx;
					}
				}
				&:nth-child(2) {
					width: 36upx;
					height: 36upx;
					border: 2upx solid #a5a5a5;
					border-radius: 50%;
					&.active {
						width: 36upx;
						height: 36upx;
						background: #fff;
						border: 2upx solid #fd2316;
						border-radius: 50%;
						position: relative;
						&::before {
							content: '';
							position: absolute;
							width: 20upx;
							height: 20upx;
							background-color: #fd2316;
							border-radius: 50%;
							left: 50%;
							margin-left: -10upx;
							top: 50%;
							margin-top: -10upx;
						}
					}
				}
			}

			&:nth-child(2) {
				image {
					width: 36upx !important;
					height: 39upx !important;
					margin-left: 6upx;
					margin-right: 26upx !important;
				}

				text {
					color: #001ec3;
					margin-left: 40upx;
				}
			}
		}
	}

	.pay-btn {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 110upx;
		width: 100%;
		text-align: center;
		background: #fd2316;
		line-height: 110upx;
		color: #fff;
		font-size: 28upx;
		font-weight: 200;
	}
}
</style>
