<template>
	<view>
		<map class="map" scale="2" show-location :markers="covers"></map>
		<view class="bottom-card">
			<view>天津工业大学西校区</view>
			<view>
				<text
					v-for="item in tagList"
					:key="item.title"
					:style="{ color: item.color }"
				>
					{{ item.title }}
				</text>
			</view>
			<view>天津工业大学西校区B1座1楼食堂门口</view>
			<view>驾车10公里, 需20分钟</view>
			<view @click="openMap">查看路线</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			covers: [],
			tagList: [
				{ title: '营业中', color: '#FD2316' },
				{ title: '文档打印', color: '#FD2316' },
				{ title: '照片打印', color: '#FF9422' }
			]
		};
	},
	methods: {
		openMap() {
				uni.showToast({
					title:'tishi '
				})
			// uni.openLocation({
			// 	latitude: 0,
			// 	longitude: 0,
			// 	success: res => {
			// 		console.log(res);
			// 	},
			// 	fail: err => {
			// 		console.log(err);
			// 	}
			// });
		}
	}
};
</script>

<style lang="scss" scoped>
.map {
	width: 100%;
	height: 1034upx;
}
.bottom-card {
	width: 100%;
	height: 414upx;
	background-color: #fff;
	padding: 40upx 60upx;
	box-sizing: border-box;

	& > view {
		&:nth-child(1) {
			color: #222222;
			font-size: 28upx;
			font-weight: bold;
		}
		&:nth-child(2) {
			font-size: 20upx;
			margin-top: 20upx;
			margin-bottom: 20upx;
			text {
				border-width: 1upx;
				border-style: solid;
				border-radius: 10upx;
				margin-right: 12upx;
				display: inline-block;
				padding: 2upx 20upx;
			}
		}
		&:nth-child(3) {
			font-size: 28upx;
			color: #454545;
		}
		&:nth-child(4) {
			font-size: 29upx;
			color: #454545;
			margin-top: 30upx;
			margin-bottom: 30upx;
		}
		&:nth-child(5) {
			width: 316upx;
			height: 82upx;
			background-color: #fd2316;
			border-radius: 10upx;
			font-size: 36upx;
			color: #fff;
			line-height: 82upx;
			text-align: center;
			margin: 0 auto;
		}
	}
}
</style>
