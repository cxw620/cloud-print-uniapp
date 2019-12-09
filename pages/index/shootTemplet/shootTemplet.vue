<template>
	<view>
		<image src="../../../static/img/templet2.png" mode="" class="templet-img"></image>
		<view class="item-text">
			<view class="iconfont iconwujiaoxing"></view>
			<text>背靠白墙拍摄</text>
		</view>
		<view class="item-text">
			<view class="iconfont iconwujiaoxing"></view>
			<text>请将头部摆正</text>
		</view>
		<view class="item-text">
			<view class="iconfont iconwujiaoxing"></view>
			<text>请穿深色衣物</text>
		</view>
		<view class="btn-class-red" @click="btnadvance">我知道了</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			btnadvance(){
				uni.navigateTo({
					url:'../capacityPictureEditor/capacityPictureEditor'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.templet-img{
		width: 486upx;
		height: 680upx;
		display: block;
		margin: 0 auto;
		margin-top: 110upx;
		margin-bottom: 44upx;
	}
	.item-text{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 30upx;
		.iconfont{
			font-size: 36upx;
			color: #fd2316;
			margin-right: 20upx;
		}
		text{
			
			font-size:28upx;
			font-weight:200;
			color:rgba(15,12,11,1);
		}
	}
	.btn-class-red{
		position: fixed;
		bottom:0;
		width: 100%;
	}

</style>
