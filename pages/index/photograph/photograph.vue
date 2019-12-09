<template>
	<view>
		<view class="">
			<view class="title">
				<text>请尽量铺平文件</text>
			</view>
			<image src="../../../static/img/add.png" mode="" class="add"></image>
			<text class="photograph-icon-text">点击上传照片</text>
		</view>
		<view class="photograph-btn">
			<view class="btn-left">上传照片（0/10）</view>
			<view class="btn-right">确认</view>
		</view>

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
	.title {
		width: 100%;

		height: 80upx;
		background: rgba(228, 228, 228, 1);
		opacity: 1;
		line-height: 80upx;
		padding-left: 56upx;
		box-sizing: border-box;

		text {
			margin-top: 0;
			display: block;
			font-size: 24upx;
			font-weight: 600;
			color: rgba(253, 35, 22, 1);


		}
	}



	.iconfont {
		color: #FD2316;
	}

	text {
		margin-top: 32upx;
		display: block;
		font-size: 34upx;
		font-weight: 600;
		color: rgba(151, 151, 151, 1);
	}

	.photograph-icon {
		margin-top: 370upx;
		text-align: center;
	}

	.photograph-icon-text {
		text-align: center;
	}

	.photograph-btn {
		position: absolute;
		bottom: 0;
		display: flex;
		width: 100%;

		.btn-left {

			font-size: 28upx;

			font-weight: 200;
			text-align: center;
			color: rgba(255, 255, 255, 1);
			opacity: 1;
			background: rgba(253, 35, 22, 1);
			opacity: 0.59;
			flex: 1;
			line-height: 110upx;
		}

		.btn-right {
			flex: 1;


			height: 110upx;
			background: rgba(253, 35, 22, 1);
			opacity: 1;
			line-height: 110upx;
			text-align: center;
			font-size: 28upx;
			font-weight: 200;
			color: rgba(255, 255, 255, 1);
		}
	}
	.add{
		width: 134upx;
		height: 134upx;
		display: block;
		margin: 0 auto;
		margin-top: 370upx;
	}
</style>
