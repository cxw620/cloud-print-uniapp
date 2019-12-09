<template>
	<view class="reduction-panel">
		<view class="title"><text>请选择缩印规格</text></view>
		<view class="spec-panel">
			<view class="reduction">
				<view class="reduction-left">
					<view class="reduction-left-item" @click="select(1)">
						<view class="iconfont iconzu6"></view>
						<view class="reduction-left-item-text">
							<view class="icon"><text v-if="selectIndex === 1"></text></view>
							<text class="">一页2张</text>
						</view>
					</view>
					<view class="reduction-left-item" @click="select(3)">
						<view class="iconfont iconzu24"></view>
						<view class="reduction-left-item-text">
							<view class="icon"><text v-if="selectIndex === 3"></text></view>
							<text class="">一页8张</text>
						</view>
					</view>
				</view>
				<view class="reduction-right">
					<view class="reduction-right-item" @click="select(2)">
						<view class="iconfont iconzu3"></view>
						<view class="reduction-left-item-text">
							<view class="icon"><text v-if="selectIndex === 2"></text></view>
							<text class="">一页4张</text>
						</view>
					</view>
					<view class="reduction-right-item" @click="select(4)">
						<view class="iconfont iconzu25"></view>
						<view class="reduction-left-item-text">
							<view class="icon"><text v-if="selectIndex === 4"></text></view>
							<text class="">一页16张</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view
			class=""
			style="width:100%;height:24upx;background:rgba(228,228,228,1);"
		></view>
		<view class="specification">
			<view class="specification-title">
				<view class="specification-title-left">{{ orderName }}</view>
				<view class="specification-title-right" @click="toPreview">
					<text>预览打印</text>
					<view class="iconfont iconxiaoyuhao-copy"></view>
				</view>
			</view>
		</view>
		<view class="btn-class-red" @click="toOrder">确认打印</view>
	</view>
</template>

<script>
import { preZoomOrderHandle, zoomChange } from '@/common/api/order.js';
export default {
	data() {
		return {
			selectIndex: 1,
			orderName: '',
			orderNo: '',
			previewPath: ''
		};
	},
	onLoad(option) {
		this.orderNo = option.orderNo;
		this.getOrderInfo(this.orderNo);
	},
	methods: {
		toOrder() {
			uni.navigateTo({
				url: `../order/order?orderNo=${this.orderNo}`
			});
		},
		toPreview() {
			console.log(this.previewPath)
			uni.navigateTo({
				url: `/pages/index/selectFile/selectFile?type=preview&url=${
					this.previewPath
				}`
			});
		},

		select(index) {
			this.selectIndex = index;
			this.changeSpec(index);
		},

		/**
		 * 根据orderNo获取订单信息
		 * @param {Object} orderNo
		 */
		async getOrderInfo(orderNo) {
			try {
				const result = await preZoomOrderHandle({ order_no: orderNo });
				this.changeSpec(1);
				this.orderName = result.goods_list[0].goods_name;
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 变更规格
		 * @param {Object} type
		 */
		async changeSpec(type) {
			try {
				const result = await zoomChange({
					order_no: this.orderNo,
					sku_type: type
				});
				this.previewPath = result.file_vector_path;
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.reduction-panel {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100vh;
}
.spec-panel {
	flex: 1;
}
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
	color: #fd2316;
}

text {
	display: block;
	font-size: 34upx;
	font-weight: 600;
	color: rgba(151, 151, 151, 1);
}

.reduction {
	display: flex;
	height: 100%;
	.reduction-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 50%;
		height: 100%;

		.reduction-left-item {
			box-sizing: border-box;
			flex: 1;
			padding-top: 85upx;
			padding-bottom: 50upx;
			.iconfont {
				font-size: 162upx;
				margin-bottom: 68upx;
			}
			.reduction-left-item-text {
				display: flex;
				align-items: center;
				.icon {
					border: 1px solid #fd2316;
					width: 28upx;
					height: 28upx;
					border-radius: 50%;
					margin-right: 12upx;
					display: flex;
					justify-content: center;
					align-items: center;
					text {
						width: 20upx;
						height: 20upx;
						background: #fd2316;
						border-radius: 50%;
						margin-top: 0;
						box-sizing: border-box;
					}
				}
				text {
					font-size: 24upx;
					font-weight: 200;
					color: rgba(34, 34, 34, 1);
				}
			}
		}
	}

	.reduction-right {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 50%;
		height: 100%;

		.reduction-right-item {
			flex: 1;
			box-sizing: border-box;
			padding-top: 50upx;
			padding-bottom: 50upx;

			.iconfont {
				font-size: 227upx;
				margin-bottom: 34upx;
			}

			.reduction-left-item-text {
				display: flex;
				align-items: center;
				padding-left: 40upx;
				.icon {
					border: 1px solid #fd2316;
					width: 28upx;
					height: 28upx;
					border-radius: 50%;
					margin-right: 12upx;

					display: flex;
					justify-content: center;
					align-items: center;
					text {
						width: 20upx;
						height: 20upx;
						background: #fd2316;
						border-radius: 50%;
						margin-top: 0;
						box-sizing: border-box;
					}
				}
				text {
					font-size: 24upx;
					font-weight: 200;
					color: rgba(34, 34, 34, 1);
				}
			}
		}
	}
}

.specification {
	height: 250upx;
	.specification-title {
		width: 100%;
		display: flex;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
		height: 80upx;
		padding-left: 50upx;
		padding-right: 50upx;
		border-bottom: 1px solid rgba(226, 225, 225, 1);

		.specification-title-left {
			font-size: 28upx;
			font-weight: 600;
			color: rgba(34, 34, 34, 1);
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.specification-title-right {
			width: 200upx;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			text {
				width: 98upx;
				height: 32upx;
				background: rgba(253, 35, 22, 1);
				text-align: center;
				border-radius: 6upx;
				font-size: 20upx;
				margin-top: 0;
				font-weight: 200;
				line-height: 32upx;
				color: rgba(255, 255, 255, 1);
			}

			.iconfont {
				color: rgba(151, 151, 151, 1);
				font-size: 22upx;
				margin-left: 14upx;
			}
		}
	}
	.specification-item {
		padding-left: 50upx;
		padding-right: 44upx;
		box-sizing: border-box;
		height: 80upx;
		border-bottom: 1px solid rgba(226, 225, 225, 1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		.specification-label {
			font-size: 24upx;
			font-weight: 200;
			color: rgba(34, 34, 34, 1);
		}
		.specification-input {
			display: flex;
			align-items: center;
			input {
				display: block;
				width: 56upx;
				height: 32upx;
				margin-left: 5upx;
				margin-right: 5upx;
				background: rgba(255, 255, 255, 1);
				border: 2upx solid rgba(228, 228, 228, 1);
				opacity: 1;
				min-height: 32upx !important;
				border-radius: 6upx;
			}
			.specification-input-btn {
				font-size: 60upx;
				color: #fd2316;
			}
			text {
				display: block;
				font-size: 24upx;
				margin-top: 0;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
				margin-left: 10upx;
				margin-right: 10upx;
			}
			.frames {
				width: 25upx;
				height: 25upx;
				margin-right: 8upx;
				border: 1px solid #e4e4e4;
				border-radius: 6upx;
				&:nth-of-type(2) {
					background: #fd2316;
					border: 1px solid #fd2316;
				}
			}
			.frames-text-black {
				margin-right: 28upx;
			}
			.frames-text {
				font-size: 24upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
			}
		}
	}
}
</style>
