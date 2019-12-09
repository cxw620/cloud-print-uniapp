<template>
	<view>
		<!-- 头部 -->
		<view class="fansInvite-header">
			<view class="header-left">
				<image src="../../../static/img/logo-b.png" mode=""></image>
				<view class="header-left-text">
					<text>我的邀请码</text>
					<text>微印云科技已邀请</text>
				</view>
			</view>
			<view class="header-right">
				<text>分享</text>
				<text>50人</text>
			</view>

		</view>
		<!-- 内容 -->
		<view class="fansInvite-cont">
			<image src="../../../static/img/sharePrivilege.png" mode=""></image>
			<text>我的奖励</text>
			<text>获得粉丝得到积分的50%</text>
			<text>我的贡献</text>
			<text>粉丝享受我的打折折扣</text>

		</view>
		<view class="btn-class-red">立即邀请微信好友</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.fansInvite-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FD2316;
		padding-top: 30upx;
		padding-bottom: 50upx;

		.header-left {
			display: flex;

			image {
				width: 84upx;
				height: 88upx;
				margin-right: 42upx;
				margin-left: 60upx;
			}

			.header-left-text {
				text {
					display: block;

					font-size: 26upx;
					font-weight: 600;
					color: rgba(249, 249, 249, 1);

					&:nth-of-type(1) {
						margin-bottom: 82upx;
					}
				}
			}

		}

		.header-right {
			margin-top: 26upx;
			padding-right: 56upx;

			text {
				display: block;

				font-size: 26upx;
				font-weight: 600;
				color: rgba(255, 255, 255, 1);

				&:nth-of-type(1) {
					margin-bottom: 56upx;
				}
			}
		}
	}
	.fansInvite-cont{
		margin-top: 90upx;
		image{
			width: 384upx;
			height: 384upx;
			display: block;
			margin: 0 auto;
			margin-bottom: 134upx;
		}
		text{
			display: block;
		text-align: center;
			font-size:30upx;
			font-family:Lantinghei SC;
			font-weight:600;
			line-height:60upx;
			color:rgba(15,12,11,1);
			opacity:1;
		}
	}
	.btn-class-red{
		position:fixed;
		bottom:0;
		
	}
</style>
