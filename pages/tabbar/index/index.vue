<template>
	<view class="index-cont">
		<!-- 头部轮播 -->
		<view class="index-swiper">
			<swiper
				class="swiper"
				:autoplay="true"
				interval="3000"
				duration="1000"
				:current="swiperCurrent"
				@change="changeSwiper"
			>
				<swiper-item v-for="item in swiperImg" :key="item.id">
					<image class="swiper-item" :src="item.path" />
				</swiper-item>
			</swiper>
			<!-- 轮播指示点样式修改 -->
			<view class="dots">
				<block v-for="(item, index) in swiperImg.length" :key="item">
					<view
						class="dot"
						:class="index == swiperCurrent ? ' active' : ''"
					></view>
				</block>
			</view>
			<!-- 附近位置 -->
			<view class="index-location " @click="toLink('nearDevice')">
				<view class="location-left">
					<view class="iconfont iconweizhi location-left-icon" />
					<view class="location-left-text">
						<text>附近设备</text>
						<text>{{ deviceNumber }}</text>
					</view>
				</view>
				<view class="location-right">
					<image src="../../../static/img/se.png" mode="" />
				</view>
			</view>
		</view>
		<!-- 首页主体内容 -->
		<view class="index-cont">
			<!-- 首页待操作 -->
			<view class="cont-pending">
				<view class="cont-pending-title">
					<view class="title-left">我的订单</view>
					<view class="title-right" @click="toLink('order')">
						查看全部订单>
					</view>
				</view>
				<view class="cont-pending-nav">
					<view
						class="pending-item"
						v-for="(item, index) in orderList"
						:key="item.title"
						@click="toLink('order', '', index)"
					>
						<view class="item-number" v-show="item.number > 0">
							{{ item.number }}
						</view>
						<image :src="item.image" mode="" />
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view>
			<!-- 首页功能 -->
			<view class="cont-function">
				<view class="function-item" v-for="item in menuList" :key="item.title">
					<view class="item-title">{{ item.title }}</view>
					<view class="fun-nav">
						<view
							class="item-fun"
							v-for="child in item.list"
							:key="child.type"
							@click="toLink(child.type, child.isHelp)"
						>
							<image :src="child.image" mode="" />
							<text>{{ child.title }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部导航 -->
		<mrhardTabbar />
	</view>
</template>

<script>
import mrhardTabbar from '@/components/mrhard-tabbar/mrhard-tabbar.vue';
import {
	wxappCarouselIndex,
	helpsGethelp,
	homeCount
} from '@/common/api/index.js';

export default {
	components: {
		mrhardTabbar
	},
	data() {
		return {
			swiperImg: [], //轮播图数据
			swiperCurrent: 0, //记录轮播第几个
			orderList: [
				{
					title: '待付款',
					number: 0,
					image: require('@/static/img/payment.png')
				},
				{
					title: '待取件',
					number: 0,
					image: require('@/static/img/collect.png')
				},
				{
					title: '已完成',
					number: 0,
					image: require('@/static/img/accomplish.png')
				},
				{
					title: '已退款',
					number: 0,
					image: require('@/static/img/delete.png')
				}
			],
			menuList: [
				{
					title: '打印',
					list: [
						{
							title: '文档打印',
							image: require('@/static/img/print1.png'),
							type: 'filePrint',
							isHelp: 1
						},
						{
							title: '电子发票打印',
							image: require('@/static/img/print2.png'),
							type: 'invoice'
						}
					]
				},
				{
					title: '复印',
					list: [
						{
							title: '文件复印',
							image: require('@/static/img/copy1.png'),
							type: 'fileCopy',
							isHelp: 6
						},
						{
							title: '证件复印',
							image: require('@/static/img/copy2.png'),
							type: 'papersCopy',
							isHelp: 8
						}
					]
				},
				{
					title: '照片',
					list: [
						{
							title: '智能证件照',
							image: require('@/static/img/picture1.png'),
							type: 'papersPhoto',
							isHelp: 9
						},
						{
							title: '照片打印',
							image: require('@/static/img/picture2.png'),
							type: 'photoPrint' //6
						}
					]
				},
				{
					title: '特色',
					list: [
						{
							title: '缩印',
							image: require('@/static/img/feature1.png'),
							type: 'reduction'
						},
						{
							title: '拼版',
							image: require('@/static/img/feature2.png'),
							type: 'makeup'
						}
					]
				}
			],
			deviceNumber: 0
		};
	},
	onLoad() {
		this.getCarouselIndex();
	},
	onShow() {
		this.getLocation();
	},
	mounted() {},
	methods: {
		/* 获取当前位置 */
		getLocation() {
			uni.getLocation({
				type: 'wgs84',
				success: res => {
					const location = `${res.latitude},${res.longitude}`;
					try {
						uni.setStorageSync('latitude', res.latitude);
						uni.setStorageSync('longitude', res.longitude);
					} catch (e) {
						// error
					}
					if (uni.getStorageSync('token')) {
						this.getHomeCount(location);
					}
				}
			});
		},

		/**
		 * 首页相关数量信息
		 * @param {Object} location  位置
		 */
		async getHomeCount(location) {
			try {
				const result = await homeCount({
					coordinate: location
				});
				this.deviceNumber = result.print;
				const key = ['pend', 'pick_up', 'complete', 'refund'];
				for (let [index, el] of this.orderList.entries()) {
					el.number = result[key[index]];
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/* 所有打印帮助图片 */
		async gethelpsGethelp(page_type) {
			try {
				console.log(page_type);
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
		},

		//获取首页轮播
		async getCarouselIndex() {
			try {
				const reslut = await wxappCarouselIndex({});
				this.swiperImg = reslut.info.data;
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		//获取轮播指示点到哪个
		changeSwiper(e) {
			if (e.detail.source === 'autoplay' || e.detail.source === 'touch') {
				this.swiperCurrent = e.detail.current;
			}
		},

		//点击打印选项
		async toLink(type, isHelp, index) {
			// 调用checkSession 检验登陆状态是否过期
			try {
				const [err, res] = await uni.checkSession();
				if ((err && err.errMsg) || !uni.getStorageSync('token')) {
					uni.navigateTo({
						url: '../../mine/login/login'
					});
					return;
				}
				if (isHelp) {
					console.log(isHelp);
					const result = await this.gethelpsGethelp(isHelp);
					if (!result.list.is_hide) {
						uni.navigateTo({
							url: `../../index/help/help?pageType=${isHelp}`
						});
						return;
					}
				}
				switch (type) {
					// 打印
					case 'filePrint':
						uni.navigateTo({
							url: '../../index/filePrint/tabs/tabs'
						});
						break;
					case 'invoice':
						uni.navigateTo({
							url: '../../index/invoice/tabs/tabs'
						});
						break;

					// 复印
					case 'fileCopy':
						uni.navigateTo({
							url: '../../index/copy/index/index'
						});
						break;
					case 'papersCopy':
						uni.navigateTo({
							url: '../../index/papersCopy/tabs/tabs'
						});
						break;

					// 照片
					case 'papersPhoto':
						uni.navigateTo({
							url: '../../index/capacity/certificate/certificate'
						});
						break;
					case 'photoPrint':
						uni.navigateTo({
							url: '../../index/photoPrint/index/index'
						});
						break;
					// 特色
					case 'reduction':
						uni.navigateTo({
							url: '../../index/reductionMakeup/tabs/tabs?type=reduction'
						});
						break;
					case 'makeup':
						console.log('AAAAAAAAAA');
						uni.navigateTo({
							url: '../../index/reductionMakeup/makeup/index/index'
						});
						break;
					case 'order':
						uni.navigateTo({
							url: `../../index/order/list/list?index=${index}`
						});
						break;

					case 'nearDevice':
						uni.navigateTo({
							url: '../../index/nearDevice/index/index'
						});
						break;

					default:
						break;
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style scoped lang="scss">
page {
	height: 100%;
}

.index-swiper {
	position: relative;

	.swiper {
		width: 100%;
		height: 418upx;
		position: relative;

		.swiper-item {
			width: 100%;
			height: 100%;
		}
	}

	.dots {
		position: absolute;
		bottom: 104rpx;
		left: 50%;
		// 这里一定要注意兼容不然很可能踩坑
		transform: translate(-50%, 0);
		-webkit-transform: translate(-50%, 0);
		z-index: 99;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.dot {
			width: 8rpx;
			height: 8rpx;
			transition: all 0.6s;
			background: rgba(216, 216, 216, 1);
			margin-right: 10rpx;
			border-radius: 50%;
		}

		.active {
			width: 16rpx;
			height: 16rpx;
			border-radius: 50%;
			background: rgba(216, 216, 216, 1);
		}
	}

	.index-location {
		width: 100%;
		position: absolute;
		z-index: 1;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: 670upx;
		height: 74upx;
		background: rgba(206, 206, 206, 1);
		opacity: 1;
		border-radius: 20upx;
		display: flex;
		align-items: center;

		justify-content: space-between;

		.location-left {
			margin-left: 30upx;
			display: flex;
			align-items: center;

			.location-left-icon {
				font-size: 40upx;
				margin-right: 10upx;
				color: #fd2316;
			}

			.location-left-text {
				font-size: 24upx;
				color: rgba(50, 50, 50, 1);

				text {
					&:nth-of-type(2) {
						color: rgba(255, 34, 41, 1);
						margin-left: 10upx;
					}
				}
			}
		}

		.location-right {
			display: flex;
			align-items: center;

			image {
				margin-right: 20upx;
				width: 50upx;
				height: 50upx;
			}
		}
	}
}

.index-cont {
	.cont-pending {
		width: 670upx;

		box-sizing: border-box;
		height: 258upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
		opacity: 1;
		border-radius: 20upx;
		margin: 0 auto;

		.cont-pending-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 62upx;
			border-bottom: 1px solid rgba(226, 225, 225, 1);
			margin-bottom: 32upx;
			box-sizing: border-box;
			padding-left: 30upx;
			padding-right: 34upx;

			.title-left {
				font-size: 24upx;
				font-weight: 600;
				color: rgba(34, 34, 34, 1);
			}

			.title-right {
				font-size: 20upx;
				font-weight: 200;
				color: rgba(151, 151, 151, 1);
			}
		}

		.cont-pending-nav {
			display: flex;
			padding-left: 8upx;
			box-sizing: border-box;
			align-items: center;

			.pending-item {
				margin: 0 32upx;
				position: relative;

				.item-number {
					position: absolute;
					right: -10upx;
					top: -10upx;
					z-index: 100;
					width: 40upx;
					height: 40upx;
					background: linear-gradient(
						180deg,
						rgba(255, 108, 74, 1) 0%,
						rgba(255, 63, 63, 1) 100%
					);
					border-radius: 50%;
					opacity: 1;
					font-size: 24upx;
					font-weight: 500;
					line-height: 40upx;
					color: #fff;
					text-align: center;
				}

				image {
					width: 100upx;
					height: 100upx;
				}

				text {
					display: block;
					font-size: 24upx;
					font-weight: 500;
					margin-top: 14upx;
					color: rgba(34, 34, 34, 1);
					opacity: 1;
					text-align: center;
				}
			}
		}
	}
}

.cont-function {
	padding-bottom: 244upx;

	.function-item {
		display: flex;
		width: 666upx;
		height: 135upx;
		margin: 0 auto;
		align-items: center;
		justify-content: center;

		border-bottom: 1px solid rgba(226, 225, 225, 1);

		.item-title {
			font-size: 28upx;
			font-weight: 600;
			margin-left: 24upx;
			margin-right: 54upx;
			color: rgba(34, 34, 34, 1);
		}

		.fun-nav {
			width: 532upx;
			display: flex;

			.item-fun {
				display: flex;
				align-items: center;

				image {
					display: block;
					margin-right: 15upx;
					width: 84upx;
					height: 76upx;
				}

				&:nth-of-type(1) {
					width: 228upx;
					margin-right: 36upx;
				}

				text {
					display: block;
					font-size: 24upx;
					font-weight: 200;
					color: rgba(34, 34, 34, 1);
				}
			}
		}

		&:last-child {
			border: none;
		}
	}
}
</style>
