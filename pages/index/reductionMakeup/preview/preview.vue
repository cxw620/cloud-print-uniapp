<template>
	<view>
		<view class="box-father">
			<view v-for="item in 2" :key="item" class="box-son-2 hide"></view>
			<view v-for="item in 4" :key="item" class="box-son-4 hide"></view>
			<view v-for="item in 8" :key="item" class="box-son-8 hide"></view>
			<view v-for="item in 16" :key="item" class="box-son-16"></view>
		</view>
		<view class="father">
			<view class="son">＜</view>
			<view class="son">1/3</view>
			<view class="son">＞</view>
		</view>
		<view class="bottom-botton">
			<view class="botton-left">去修改</view>
			<view class="botton-right">确定</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
.box-father {
	width: 688upx;
	height: 964upx;
	border: 1upx solid #707070;
	margin: 62upx auto 0;
	box-shadow: 0 4upx 12upx #ccc;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	.hide{
		display:none;
	}
	.box-son-2 {
		width: 612upx;
		height: 422upx;
		border: 1upx solid #707070;
		margin: 28upx auto;
	}
	.box-son-4 {
		width: 297upx;
		height: 422upx;
		border: 1upx solid #707070;
		margin: 30upx auto 10upx;
	}
	.box-son-8 {
		width: 310upx;
		height: 216upx;
		border: 1upx solid #707070;
		margin: 16upx auto 1upx;
	}
	.box-son-16 {
		width: 150upx;
		height: 213upx;
		border: 1upx solid #707070;
		margin: 12upx auto;
	}
}
.bottom-botton {
	position: fixed;
	width: 100%;
	height: 110upx;
	bottom: 0;
	display: flex;
	text-align: center;
	line-height: 110upx;
	.botton-left {
		flex: 1;
		background: #ada9a9;
		font-size: 28upx;
	}
	.botton-right {
		flex: 1;
		background: #fd2316;
		color: #fff;
		font-size: 28upx;
	}
}
.father {
	width: 100%;
	height: 380upx;
	display: flex;
	padding-top: 30upx;
	justify-content: center;
	.son {
		padding-right: 24upx;
		color: #979797;
	}
}
</style>
