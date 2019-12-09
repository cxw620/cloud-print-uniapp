<template>
	<view>
		<view class="mine-header">
			<view class="header-top">
				<view class="header-top-left">
					<image :src="info.avatarUrl" mode="" class="logo" v-if="info"></image>
					<image
						src="../../../static/img/xuanxuan-image.png"
						mode=""
						class="logo"
						v-else
					></image>
					<view class="info">
						<view class="info-name">{{ info ? info.nickName : '登陆' }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="edit-password">
			<view class="edit-content" @click="goEditPass">
				<view class="content">
					<image
						src="../../../static/img/lock.png"
						mode=""
						class="lock"
					></image>
					<text class="edit-pay">
						{{ is_set_pwd ? '修改支付密码' : '设置密码' }}
					</text>
				</view>
				<view class="row">
					<image
						src="../../../static/img/down.png"
						mode=""
						class="down"
					></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { userMyGreade, isSetPwd } from '@/common/api/mine.js';
export default {
	data() {
		return {
			info: {},
			is_set_pwd: false
		};
	},
	onLoad() {
		this.getuserMyGreade();
		this.getisSetPwd()
	},
	methods: {
		//获取我的所有信息
		async getuserMyGreade() {
			try {
				const result = await userMyGreade({});
				this.info = result.info;
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		async getisSetPwd() {
			try {
				const result = await isSetPwd({});
				console.log(result);
				this.is_set_pwd = result.is_set_pwd;
			} catch (e) {
				this.showMessage(e.msg);
				//TODO handle the exception
			}
		},
		//
		goEditPass() {
			if(this.is_set_pwd){
				uni.navigateTo({
					url: '../../mine/changePassword/changePassword?passwordType=1'
				});
			}else{
				uni.navigateTo({
					url: '../../mine/forgetPassword/forgetPassword?forgetPassword=1'
				});
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
			color: #ffffff;
			opacity: 1;
		}
	}
}
.edit-password {
	background: rgba(249, 249, 249, 1);

	.edit-content {
		width: 670upx;
		height: 112upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
		opacity: 1;
		border-radius: 20upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 42upx;
		margin-left: 32upx;
		padding-left: 36upx;
		padding-right: 44upx;
		box-sizing: border-box;
		.content {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.lock {
				display: inline-block;
				width: 74upx;
				height: 74upx;
				margin-right: 48upx;
			}
			.edit-pay {
				font-size: 28upx;
				font-family: Lantinghei SC;
				font-weight: 600;

				color: rgba(34, 34, 34, 1);
				opacity: 1;
			}
		}
		.row {
			.down {
				width: 20upx;
				height: 40upx;
			}
		}
	}
}
</style>
