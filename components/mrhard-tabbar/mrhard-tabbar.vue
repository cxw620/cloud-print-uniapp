<template>
	<view class="tabbar">
		<image src="/static/img/tabbar-bak.png" mode="" class="tabbar-bak"></image>
		<view class="tabbar-cont">
			<view class="tabbar-cont-code" @click="clickTabcode()">
				<view class="iconfont iconsaoma1"></view>
			</view>

			<block v-for="(item, index) in tabBar.list" :key="index">
				<view
					class="tabbar-text tabbar-code"
					v-if="item.pagePath == 'code'"
					@click="clickTabcode()"
				>
					{{ item.text }}
				</view>
				<view class="" v-if="item.pagePath != 'code'">
					<view
						:class="['tabbar-item', item.showBig ? 'big' : '']"
						:style="{
							color:
								item.pagePath === '/' + nowPath
									? tabBar.selectedColor
									: tabBar.color,
							'background-color': tabBar.bgColor,
							'border-color': item.showBig
								? item.pagePath === '/' + nowPath
									? tabBar.selectedColor
									: tabBar.borderColor
								: ''
						}"
						@click="clickTab(item)"
					>
						<block v-if="tabBar.showType == 'img'">
							<image
								class="tabbar-icon"
								:src="
									item.pagePath === '/' + nowPath
										? item.selectedIconPath
										: item.iconPath
								"
							/>
						</block>
						<block v-if="tabBar.showType == 'iconfont'">
							<view :class="['tabbar-icon', 'iconfont', item.fontClass]"></view>
						</block>
						<text class="tabbar-text">{{ item.text }}</text>
						<text class="tabbar-item-num" v-if="item.num">{{ item.num }}</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { checkPrintId } from '@/common/api/device.js';

export default {
	data() {
		return {
			tabBar: {
				color: '#747474',
				selectedColor: '#FD2316',
				showType: 'iconfont', //img/图片模式,iconfont/字体图标模式
				borderColor: '#bbbbbb',
				bgColor: '#ffffff',
				list: [
					{
						pagePath: '/pages/tabbar/index/index',
						navigateType: 'switchTab',
						showBig: false,
						iconPath: '/static/img/index-1.png',
						selectedIconPath: '/static/img/index-1.png',
						text: '打印',
						fontClass: 'icondayin'
					},
					{
						pagePath: 'code',
						text: '扫码取件'
					},
					{
						pagePath: '/pages/tabbar/mine/mine',
						navigateType: 'switchTab',
						showBig: false,

						iconPath: '/static/img/index-1.png',
						selectedIconPath: '/static/img/index-1.png',
						text: '我的',
						fontClass: 'iconwode'
					}
				]
			}
		};
	},
	onReady() {
		try {
			uni.hideTabBar({
				animation: false
			});
		} catch (e) {
			//TODO handle the exception
		}
	},
	mounted() {
		try {
			uni.hideTabBar({
				animation: false
			});
		} catch (e) {}
	},
	methods: {
		clickTab(item) {
			uni[item.navigateType]({
				url: item.pagePath
			});
		},

		clickTabcode() {
			uni.scanCode({
				success: res => {
					this.checkPrint(res.result);
				}
			});
		},

		/**
		 * 验证是否是打印机
		 * @param {Object} code
		 */
		async checkPrint(code) {
			try {
				await checkPrintId({ printer_code: code });
				uni.navigateTo({
					url: `/pages/index/order/scanCode/scanCode?printId=${code}`
				});
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	},

	computed: {
		nowPath() {
			return getCurrentPages()[0] && getCurrentPages()[0].route;
		}
	}
};
</script>

<style lang="scss">
.tabbar {
	/* height: 8vh; */
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 100;
	height: 164rpx;
	width: 100%;
	.tabbar-bak {
		width: 100%;
		height: 100%;
	}
}
.tabbar-cont {
	display: flex;
	justify-content: space-between;
	padding-left:110upx ;
	padding-right: 110upx;
	box-sizing: border-box;
	align-items: center;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 100;
	height: 164rpx;
	width: 100%;
}
.tabbar-item {
	flex: 1;
	text-align: center;
	color: #c1c0c9;
	padding: 15upx 0;
	position: relative;
}

.tabbar-item.active {
	color: #327df4;
}
.tabbar-item.big {
	position: relative;
	top: -60rpx;
	font-size: 130%;
	background: #000;
	border-radius: 50%;
	overflow: hidden;
	border: 1px solid;
}
.tabbar-icon {
	display: block;
	margin: 0 auto;
	margin-bottom: 1.5vw;
	font-size: 60rpx;
	line-height: 1em;
	&:nth-of-type(1) {
		font-size: 55rpx;
	}
}

.tabbar-text {
	font-size: 24upx;
	letter-spacing: 0;
	text-align: center;
	line-height: 11px;
	display: block;
	font-weight: 600;
}

.tabbar-item-num {
	position: absolute;
	top: 1vw;
	font-size: 20upx;
	padding: 4upx;
	border-radius: 50%;
	background-color: #ff4a39;
	color: #ffffff;
	width: 28upx;
	height: 28upx;
	text-align: center;
	line-height: 28upx;
	left: 45upx;
	margin: auto;
	right: 0;
}
.tabbar-code {
	padding-top: 60upx;
	color: #8a8a8a;
	font-weight: 600;
}
.tabbar-cont-code {
	position: fixed;
	left: 0;
	right: 0;
	margin: auto;
	bottom: 100upx;
	width: 130upx;
	height: 130upx;
	background: linear-gradient(
		163deg,
		rgba(255, 71, 83, 1) 0%,
		rgba(255, 34, 41, 1) 100%
	);
	box-shadow: 0px 4upx 16upx rgba(255, 50, 59, 0.27);
	border-radius: 50%;
	opacity: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	.iconsaoma1 {
		font-size: 75upx;
		color: #fff;
	}
}
</style>
