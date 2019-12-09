<template>
	<view v-if="wallet.type !== 10">
		<view class="balance-header">
			<view class="money">￥{{ wallet.after_money }}</view>
			<view class="header-btn" @click="btnPassword">修改支付密码</view>
		</view>
		<view class="balance-title">消费记录</view>
		<view class="balance-list">
			<view class="balance-list-title">
				<view class="title-left">
					<text></text>
					<view class="title-left-title">本月</view>
				</view>
				<view class="title-right">
					<view class="title-right-h">
						<text>获取：</text>
						<text>￥{{ wallet.in }}</text>
					</view>
					<view class="title-right-x">
						<text>消费：</text>
						<text>￥{{ wallet.out }}</text>
					</view>
				</view>
			</view>
			<view class="list-item" v-for="(item, index) in dates" :key="index">
				<view class="item-left">
					<text>{{ item.describe }}</text>
					<text>{{ item.time }}</text>
				</view>
				<view class="item-right">
					<text :style="{ color: item.money > 0 ? '' : '#FD2316' }">
						{{ item.money > 0 ? '+' + item.money : item.money }}
					</text>
					<text>{{item.after_money}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { userMyWallet } from '@/common/api/mine.js';
export default {
	data() {
		return {
			wallet: { type: 10 },
			dates: []
		};
	},
	onLoad() {},
	onShow() {
		this.getuserMyWallet();
	},
	methods: {
		async getuserMyWallet() {
			try {
				const result = await userMyWallet({});
				this.wallet = result.info;
				//判断是否设置过密码
				if (result.info.type === 10) {
					uni.navigateTo({
						url: '../forgetPassword/forgetPassword'
					});
					return;
				}
				this.dates = result.info.date.data;
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		btnPassword() {
			uni.navigateTo({
				url: '../changePassword/changePassword?passwordType=1'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.balance-header {
	padding-top: 60upx;
	padding-bottom: 22upx;
	background: #fd2316;

	.money {
		text-align: center;
		font-size: 80upx;
		font-weight: 200;
		color: rgba(255, 255, 255, 1);
	}

	.header-btn {
		text-align: right;
		font-size: 24upx;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		margin-right: 40upx;
		margin-top: 20upx;
	}
}

.balance-title {
	margin-top: 16upx;
	padding-left: 40upx;
	font-size: 28upx;
	font-weight: 600;
	color: rgba(34, 34, 34, 1);
}

.balance-list {
	width: 690upx;
	margin: 0 auto;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	border-radius: 20upx;

	.balance-list-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 67upx;

		.title-left {
			display: flex;
			align-items: center;
			padding-left: 30upx;
			align-items: center;

			text {
				width: 16upx;
				height: 16upx;
				background: #fd2316;
				display: block;
				border-radius: 50%;
				margin-right: 8upx;
			}

			.title-left-title {
				font-size: 28upx;
				font-weight: 600;
				color: rgba(34, 34, 34, 1);
			}
		}
	}

	.title-right {
		display: flex;
		align-items: center;
		height: 100%;
		padding-right: 40upx;

		text {
			font-size: 20upx;
			font-weight: 200;
			color: rgba(253, 35, 22, 1);
		}

		.title-right-h {
			text {
				text-align: right;
				&:nth-of-type(1) {
					color: #222222;
				}
			}
		}

		.title-right-x {
			margin-left: 38upx;

			text {
				color: #4d9938;
			}
		}
	}
}

.list-item {
	height: 112upx;
	border-top: 1px solid rgba(226, 225, 225, 1);
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
	padding-left: 30upx;
	padding-right: 40upx;
	align-items: center;

	.item-left {
		font-size: 20upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);

		text {
			display: block;

			&:nth-of-type(1) {
				margin-bottom: 8upx;
			}
		}
	}

	.item-right {
		font-size: 20upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);
		text {
			display: block;
			text-align: right;
			&:nth-of-type(1) {
				display: block;
				color: #4d9938;
				margin-bottom: 8upx;
			}
		}
	}
}
</style>
