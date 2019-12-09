<template>
	<view>
		<!-- 文档打印  列表-->
	
				<view class="each">
					<view class="item-each">
						<view class="eachs">
							<view class="eachs-top-copy">
								<view class="eachs-top-copy-left">
									<view class="eachs-top-title">文件预览</view>
									<view class="eachs-top-img">
										<image
											:src="item.file_path"
											mode=""
											v-for="(item, index) in order.goods_list"
											:key="index"
										></image>
									</view>
								</view>
								<view
									class="eachs-top-copy-right"
									@click="toPreview(order.goods_list)"
								>
									<text>打印预览</text>
									<text class="iconfont iconxiaoyuhao-copy"></text>
								</view>
							</view>
							<view class="eachs-bottom">
								<!-- 文档打印  选择属性-->
								<view class="property">
									<view class="property-item">
										<view class="item-title">尺寸</view>
										<view class="data">
											{{ order.goods_list[0].goods_sku_name? order.goods_list[0].goods_sku_name:'' }}
										</view>
									</view>
									<view class="property-item">
										<view class="item-title">份数</view>
										<view class="data">
											<view class="data-btns" @click="goodsObj.total_num -= 1">
												-
											</view>
											<input
												type="number"
												class="data-number"
												v-model="goodsObj.total_num"
												@blur="setTotalNum"
												@confirm="setTotalNum"
											/>
											<view class="data-btns" @click="goodsObj.total_num += 1">
												+
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			
		<confirm-modal
			v-if="showConfirm"
			@clickLeft="showConfirm = false"
			@clickRight="deleteOrder"
		/>
	</view>
</template>

<script>
import { previewPrintFile } from '@/common/api/order';
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';

export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	props: {
		detail: {
			type: Object,
			default: () => {
				return [];
			}
		},
		spec: {
			type: Object,
			default: () => {
				return {};
			}
		},
		//1：预览  2：数据
		documentType: {
			type: Number,
			default: () => {
				return null;
			}
		}
	},
	data() {
		return {
			order: {},
			specIds: [],
			pageObj: {},
			goodsObj: {},
			showConfirm: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#fd2316'
					}
				}
			]
		};
	},
	watch: {
		// 父组件传订单值
		detail() {
			this.initData();
		},

		// 订单份数值
		'goodsObj.total_num'(val) {
			console.log(val);
			if (val <= 0) {
				this.goodsObj.total_num = 1;
				this.showMessage('份数值必须大于0');
				return;
			}
			this.changeGoodList('total_num');
		},

		// 订单起始页
		'order.goods_page_start'(val) {
			if (val <= 0 || val > this.order.goods_list[0].goods_page_end) {
				this.showMessage('起始页码必须大于0并且小于结束页码');
				return;
			}
			if (
				val !== 1 &&
				this.order.goods_list[0].goods_page_end !==
					this.order.goods_list[0].all_goods_page &&
				this.order.goods_list[0].goods_page_end - val >= 100
			) {
				this.showMessage('打印区间页面不能大于100页');
				return;
			}
			this.changeGoodList('goods_page_start');
		},

		// 订单结束页
		'order.goods_page_end'(val) {
			if (
				val < this.order.goods_list[0].goods_page_start ||
				val > this.order.goods_list[0].all_goods_page
			) {
				this.showMessage('结束页码不能小于起始页并且不能大于总页码');
				return;
			}

			if (
				val !== this.order.goods_list[0].all_goods_page &&
				val - this.order.goods_list[0].goods_page_start >= 100 &&
				this.order.goods_list[0].goods_page_start !== 1
			) {
				this.showMessage('结束页码不能小于起始页并且不能大于总页码');
				return;
			}
			this.changeGoodList('goods_page_end');
		}
	},
	onShow() {},
	onLoad() {},
	mounted() {
		// this.initData();
	},
	methods: {
		deleteOrder() {
			console.log('delete');
		},

		setpageStart(e) {
			this.order.goods_page_start = Number(e.detail.value);
		},

		setpageEnd(e) {
			this.order.goods_page_end = Number(e.detail.value);
		},

		setTotalNum(e) {
			this.order.total_num = Number(e.detail.value);
		},

		/* 初始化数据 */
		initData() {
			this.order = this.detail;
			// this.specIds = this.spec;
			this.specIds = this.order.goods_list[0].spec_sku_id.split('_');
			console.log(this.specIds);
			this.goodsObj = this.order.goods_list[0];
			this.pageObj = {
				goods_page_start: this.goodsObj.goods_page_start,
				goods_page_end: this.goodsObj.goods_page_end,
				total_num: this.goodsObj.total_num
			};
		},

		/**
		 * 获取预览文件地址
		 * @param {}
		 */
		toPreview(list) {
			let imgList = [];
			for (let i in list) {
				imgList.push(list[i].file_path);
			}
			uni.navigateTo({
				url:
					'../../photoPrint/preview/preview?imgList='+JSON.stringify(imgList)
			});
		},

		/**
		 * 变更文件规格
		 * @param {Object} id       规格ID
		 * @param {Object} index		规格索引
		 */
		changeGoodSku(id, index) {
			this.specIds[index] = id;
			const skuObj = this.spec.spec_list.find(value => {
				return this.specIds.join('_') === value.spec_sku_id;
			});
			console.log(skuObj);

			uni.$emit('resetPrice', {
				type: 'sku',
				menuState: {
					goods_id: this.order.goods_list[0].goods_id,
					showMenu: this.order.showMenu
				},
				params: {
					goods_id: this.order.goods_list[0].goods_id,
					sku_id: skuObj.price_sku_id
				}
			});
		},

		/**
		 * 变更文件范围份数
		 */
		changeGoodList(name) {
			console.log(name);
			if (this.pageObj[name] === this.goodsObj[name]) {
				return;
			}

			uni.$emit('resetPrice', {
				type: 'list',
				menuState: {
					goods_id: this.goodsObj.goods_id
				},
				params: {
					file_id: this.goodsObj.goods_id,
					start_page: this.goodsObj.goods_page_start,
					end_page: this.goodsObj.goods_page_end,
					total_num: this.goodsObj.total_num
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.each {
	position: relative;
	width: 100%;
	padding-top: 10upx;
	background-color: #f8f8f8;

	.item-each {
		border-bottom: 1px solid rgba(226, 225, 225, 1);
		.eachs {
			box-sizing: border-box;
			padding-left: 52upx;
			padding-right: 54upx;
			.eachs-top-copy {
				height: 238upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-sizing: border-box;

				.eachs-top-copy-left {
					.eachs-top-img {
						image {
							width: 102upx;
							height: 132upx;
							margin-right: 18upx;
						}
					}
					.eachs-top-title {
						font-size: 24upx;
						font-weight: 200;
						color: rgba(35, 35, 35, 1);
						margin-bottom: 14upx;
						margin-top: 28upx;
					}
				}
				.eachs-top-copy-right {
					font-size: 20upx;
					font-weight: 200;
					color: rgba(72, 72, 72, 1);
					.iconfont {
						color: rgba(151, 151, 151, 1);
						font-size: 22upx;
					}
				}
			}
			.eachs-left {
				display: flex;
				align-items: center;
				padding-left: 54upx;

				image {
					width: 67upx;
					height: 86upx;
					display: block;
					margin-right: 24upx;
				}

				.eachs-left-text {
					.name {
						font-size: 24upx;
						font-weight: 200;
						color: rgba(34, 34, 34, 1);
						width: 380upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.describe {
						font-size: 16upx;
						font-weight: 200;
						line-height: 24upx;
						color: rgba(151, 151, 151, 1);
					}

					.specification {
						font-size: 16upx;
						font-weight: 200;
						color: rgba(151, 151, 151, 1);

						text {
							margin-right: 15upx;
						}
					}
				}
			}

			.eachs-right {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 20upx;
				padding-right: 54upx;
				font-weight: 200;
				height: 100%;
				color: rgba(72, 72, 72, 1);
			}
			.eachs-rightnumber {
				.number {
					margin-right: 52upx;
				}

				.money {
					color: rgba(34, 34, 34, 1);
				}
			}
		}
		.documentTypeClass {
			height: 110upx;
		}
	}
}
.btn-examine {
	text-align: center;
	position: absolute;
	bottom: 10upx;
	width: 100%;

	.iconxiaoyuhao-copy {
		font-size: 45upx;
		transform: rotate(90deg);
		color: #fd2316;
		display: inline-block;
	}

	.icontop {
		color: #fd2316;
		transform: rotate(180deg);
		margin-bottom: 10upx;
	}
}

.property {
	box-sizing: border-box;
	padding-left: 52upx;
	padding-right: 44upx;
	padding-top: 26upx;
	border-bottom: 1px solid rgba(226, 225, 225, 1);
	.property-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24upx;
		font-weight: 200;
		color: rgba(35, 35, 35, 1);
		margin-bottom: 26upx;
		.data {
			display: flex;
			align-items: center;
			.data-radio {
				display: flex;
				align-items: center;
				&:nth-of-type(1) {
					margin-right: 28upx;
				}
				.data-radio-box {
					width: 25upx;
					height: 25upx;
					border: 1px solid rgba(228, 228, 228, 1);
					border-radius: 6upx;
					opacity: 1;
					margin-right: 8upx;
				}
			}
			.data-all {
				width: 86upx;
				height: 32upx;
				text-align: center;
				background: rgba(255, 255, 255, 1);
				border: 2upx solid rgba(228, 228, 228, 1);
				border-radius: 6upx;
				font-size: 24upx;
				font-weight: 200;
				line-height: 32upx;
				color: rgba(15, 12, 11, 1);
				margin-right: 44upx;
			}
			.data-sel {
				display: flex;
				align-items: center;
				input {
					display: block;
					width: 56upx;
					height: 32upx;
					line-height: 32upx;
					background: rgba(255, 255, 255, 1);
					border: 2upx solid rgba(228, 228, 228, 1);
					opacity: 1;
					border-radius: 6upx;
					// min-height: 32upx !important;
					padding-left: 10upx;
					padding-right: 10upx;
					box-sizing: border-box;
					margin-left: 6upx;
					margin-right: 6upx;
					text-align: center;
				}
			}
			.data-btns {
				font-size: 50upx;
				font-weight: 500;
				color: rgba(253, 35, 22, 1);
			}
			.data-number {
				display: block;
				width: 56upx;
				height: 32upx;
				background: rgba(255, 255, 255, 1);
				border: 2upx solid rgba(228, 228, 228, 1);
				opacity: 1;
				border-radius: 6upx;
				// min-height: 32upx;
				padding-left: 10upx;
				padding-right: 10upx;
				box-sizing: border-box;
				margin-left: 6upx;
				margin-right: 6upx;
				text-align: center;
			}
		}
	}
}
</style>
