<template>
	<view class="bg">
		<image :src="copyCont.list.date.path" mode="widthFix" />
		<view class="radio" @click="radioType = !radioType">
			<view class="radio-btn">
				<view class="btn-false" v-if="!radioType"></view>
				<image src="../../../static/img/zq.png" mode="" v-else></image>
			</view>
			<view class="radio-text">下次不再提示</view>
		</view>
		<view class="bottom-botton" @click="onSubmit">我知道了</view>
	</view>
</template>

<script>
import { helpsHide, helpsGethelp } from '@/common/api/index.js';
export default {
	data() {
		return {
			pageType: '',
			copyCont: {}, //页面内容
			radioType: false,
			capacityType: null
		};
	},
	onLoad(option) {
		this.pageType = option.pageType;
		if (option.capacityType) {
			this.capacityType = option.capacityType;
		}
		console.log(this.pageType);
		this.gethelpsGethelp(option.pageType);
	},
	methods: {
		async onSubmit() {
			try {
				if (this.radioType) {
					const result = await helpsHide({
						print_help_id: this.copyCont.list.date.print_help_id,
						is_hide: 1
					});
				}

				switch (Number(this.pageType)) {
					case 6:
						// 智能文件复印
						uni.redirectTo({
							url: '../copy/index/index'
						});
						break;
					case 8:
						// 证件复印
						uni.redirectTo({
							url: '../papersCopy/tabs/tabs'
						});
						break;
						case 9:
						console.log('AAAAAAAAAAAAAAA')
							// 智能证件照
							uni.redirectTo({
								url:
									'/pages/index/capacity/certificate/certificate'
							});
							break;
					case 10:
						// 智能证件照
						uni.redirectTo({
							url:
								'/pages/index/capacity/tabs/tabs?capacityType=' + this.capacityType
						});
						break;
					default:
						// 文档打印
						uni.redirectTo({
							url: '../filePrint/tabs/tabs'
						});
						break;
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/* 所有打印帮助图片 */
		async gethelpsGethelp(pageType) {
			try {
				this.copyCont = await helpsGethelp({
					page_type: pageType
				});
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.bg {
	.headline {
		width: 300upx;
		height: 70upx;
		font-size: 50upx;
		font-family: Lantinghei SC;
		font-weight: 600;
		line-height: 32upx;
		color: rgba(34, 34, 34, 1);
		opacity: 1;
		margin-left: 80upx;
		margin-top: 92upx;
		margin-bottom: 134upx;
	}
	.hint-one {
		display: flex;
		margin-left: 198upx;
		margin-top: 34upx;
		.left-son {
			width: 62upx;
			height: 62upx;
			border-radius: 50%;
			background: #fd2316;
			color: #fff;
			text-align: center;
			line-height: 62upx;
		}
		.right-son {
			width: 160upx;
			height: 56upx;
			font-size: 40upx;
			font-family: Lantinghei SC;
			font-weight: 600;
			line-height: 32upx;
			color: rgba(34, 34, 34, 1);
			opacity: 1;
			margin-top: 15upx;
			margin-left: 20upx;
		}
	}
	.one-text {
		width: 288upx;
		height: 72upx;
		font-size: 24upx;
		font-family: Lantinghei SC;
		font-weight: 200;
		line-height: 40upx;
		color: rgba(34, 34, 34, 1);
		opacity: 1;
		margin-left: 284upx;
	}

	.bottom-botton {
		width: 750upx;
		height: 110upx;
		background: rgba(253, 35, 22, 1);
		opacity: 1;
		position: fixed;
		bottom: 0;
		text-align: center;
		line-height: 110upx;
		color: #fff;
		font-size: 28upx;
	}
	image {
		width: 100%;
	}
	.box-father {
		display: flex;
		position: absolute;
		top: 1262upx;
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
.radio {
	position: fixed;
	bottom: 160upx;
	right: 84upx;
	display: flex;
	align-items: center;
	.radio-btn {
		.btn-false {
			width: 32upx;
			height: 32upx;
			background: rgba(255, 255, 255, 1);
			border: 2upx solid rgba(112, 112, 112, 1);
			border-radius: 50%;
			box-sizing: border-box;
		}
		image {
			display: block;
			width: 32upx;
			height: 32upx;
		}
	}
	.radio-text {
		margin-left: 8upx;
		font-size: 24upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);
	}
}
</style>
