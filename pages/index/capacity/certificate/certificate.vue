<template>
	<view>
		<view class="title">
			<text>智能证件照</text>
			<text>（没有电子版选我）</text>
		</view>
		<view class="no-cont">
			<view class="no-cont-img-border">
				<image src="../../../../static/img/templet1.png" mode=""></image>
			</view>
			<text>在线制作证件照</text>
			<text>支持多尺寸，一键换背景，自动排版</text>
			<view class="btn" @click="btnadvance(1)">点我制作证件照</view>
		</view>
		<view class="title">
			<text>普通证件照</text>
			<text>（已有电子版选我）</text>
		</view>
		<view class="yes-cont" @click="btnadvance(2)">
			<text class="iconfont iconzu3"></text>
			<view class="yes-cont-text">
				<text>证件照排版</text>
				<text>将手机中的证件照电子版打印出来</text>
			</view>
		</view>
	</view>
</template>

<script>
import { helpsGethelp } from '@/common/api/index.js';
export default {
	data() {
		return {};
	},
	methods: {
		//前往选择证件排版页
		async btnadvance(e) {
			try {
				// 智能打印
				let result = await this.gethelpsGethelp(10);
				console.log(result);
				//判断是否已经提示
				if (!result.list.is_hide) {
					uni.navigateTo({
						url: "../../help/help?pageType=10&capacityType="+e
					});
				} else {
					uni.navigateTo({
						url: "../tabs/tabs?capacityType="+e
					});
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		/* 所有打印帮助图片 */
		async gethelpsGethelp(page_type) {
			try {
				const result = await helpsGethelp({
					page_type: page_type
				});
				console.log(result);
				return result;
			} catch (e) {
				this.showMessage(e.msg);
				return false;
			}
			return false;
		}
	}
};
</script>

<style lang="scss" scoped>
.title {
	box-sizing: border-box;
	padding-left: 40upx;
	margin-bottom: 10upx;
	text {
		font-size: 24upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);

		&:nth-of-type(1) {
			color: #222;
			font-size: 28upx;
			font-weight: 600;
		}
	}
}

.no-cont {
	width: 670upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	border-radius: 20upx;
	padding-top: 30upx;
	margin: 0 auto;
	padding-bottom: 30upx;
	margin-bottom: 34upx;

	.no-cont-img-border {
		width: 490upx;
		height: 348upx;

		image {
			width: 100%;
			height: 100%;
			display: block;
		}

		box-sizing: border-box;
		padding: 16upx;
		border: 2upx solid #979797;
		margin: 0 auto;
		margin-bottom: 20upx;
	}

	text {
		display: block;
		font-size: 28upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);
		text-align: center;

		&:nth-of-type(2) {
			font-size: 20upx;
			font-weight: 200;
			margin-top: 8upx;
			color: rgba(151, 151, 151, 1);
		}
	}

	.btn {
		width: 280upx;
		height: 54upx;
		line-height: 54upx;
		text-align: center;
		color: #fff;
		font-size: 28upx;
		margin: 0 auto;
		margin-top: 16upx;
		background: #fd2316;
		border-radius: 20upx;
	}
}
.yes-cont {
	width: 670upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 20upx;
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	display: flex;
	align-items: center;
	margin: 0 auto;
	.iconfont {
		font-size: 120upx;
		color: #fd2316;
		padding-left: 20upx;
		padding-right: 20upx;
		margin-top: 42upx;
		margin-bottom: 48upx;
	}
	text {
		display: block;
		font-size: 28upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);

		&:nth-of-type(2) {
			font-size: 20upx;
			font-weight: 200;
			margin-top: 8upx;
			color: rgba(151, 151, 151, 1);
		}
	}
}
</style>
