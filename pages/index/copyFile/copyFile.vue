<template>
	<view class="bg">
		<view class="text">
			智能文件复印
			<br />
			手机轻松搞定
		</view>
		<image src="../../../static/img/1.png" mode=""></image>
		<view class="hint">请尽量铺平文件</view>
		<view class="hint">请尽量在深色背景下拍摄文件</view>
		<view class="bottom-botton">我知道了</view>
		<view class="box-father">
			<view class="left-son"></view>
			<view class="right-son">下次不再提示</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.bg {
	background-color: #cecece;
	height: 1440upx;
	position: relative;
	.text {
		padding-top: 60upx;
		text-align: center;
		height: 126upx;
		font-size: 48upx;
		font-weight: 400;
		line-height: 60upx;
		color: rgba(253, 35, 22, 1);
		letter-spacing: 10upx;
		opacity: 1;
	}
	image {
		width: 748upx;
		height: 964upx;
		margin-top: 60upx;
	}
	.bottom-botton {
		z-index: 1000;
		position: fixed;
		bottom: 0;
		width: 750upx;
		height: 110upx;
		background: rgba(253, 35, 22, 1);
		opacity: 1;
		text-align: center;
		line-height: 110upx;
		color: #fff;
		font-size: 28upx;
	}
	.hint {
		width: 364upx;
		height: 38upx;
		font-size: 28upx;
		font-family: Lantinghei SC;
		font-weight: 600;
		line-height: 24upx;
		color: rgba(253, 35, 22, 1);
		opacity: 1;
		margin-left: 56upx;
	}
	.box-father {
		display: flex;
		position: absolute;
		bottom: 160upx;
		right: 58upx;
		.left-son {
			width: 32upx;
			height: 32upx;
			border: 1upx solid #eee;
			border-radius: 50%;
			background-color: #fff;
			box-shadow: 0px 0px 2upx #000;
		}
		.right-son {
			width: 144upx;
			height: 32upx;
			font-size: 24upx;
			font-family: Lantinghei SC;
			font-weight: 200;
			line-height: 40upx;
			color: rgba(34, 34, 34, 1);
			opacity: 1;
			margin-left: 18upx;
		}
	}
}
</style>
