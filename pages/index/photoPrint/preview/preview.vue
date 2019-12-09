<template>
	<view>
		<view class="title">
			打印效果预览
			<br />
			照片未显示部分会被裁掉
		</view>
		<view class="content-list" v-if="imgList.length">
			<swiper class="swiper" :current="swiperCurrent" @change="changeSwiper">
				<swiper-item v-for="(item, index) in imgList" :key="index">
					<image :src="item" mode=""></image>
				</swiper-item>
			</swiper>
			<view class="swiperCurrents">
				{{ Number(swiperCurrent) + 1 }}/{{ imgList.length }}
			</view>
		</view>
		<view class="content" v-else><image :src="imgUrl" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgUrl: '',
			indicatorDots: true,
			imgList: [],
			swiperCurrent: '0'
		};
	},
	onLoad(option) {
		console.log(option.imgList);
		if (option.imgList) {
			this.imgList = JSON.parse(option.imgList);
		} else {
			this.imgUrl = option.url;
		}
	},
	methods: {
		changeSwiper(e) {
			console.log(e);
			this.swiperCurrent = e.detail.current;
		}
	}
};
</script>

<style lang="scss" scoped>
.title {
	padding-top: 20upx;
	padding-left: 60upx;
	font-size: 28upx;
	color: #222;
}
.content {
	width: 710upx;
	height: 986upx;
	background-color: #fff;
	margin: 50upx auto 0;
	box-shadow: 0 6upx 12upx rgba($color: #000000, $alpha: 0.16);
	box-sizing: border-box;
	padding: 30upx;

	image {
		width: 100%;
		height: 100%;
	}
}
.swiper {
	height: 842upx;
	width: 595upx;
	margin: 0 auto;
	margin-top: 50upx;
	image {
		height: 100%;
		width: 100%;
	}
}
.swiperCurrents {
	text-align: center;
}
</style>
