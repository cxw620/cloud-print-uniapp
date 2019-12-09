<template>
	<view class="reduction-order" v-if="order.goods_name">
		<view class="each">
			<view class="item-each">
				<view class="eachs">
					<view class="eachs-top">
						<view class="eachs-left">
							<file-icon :type="order.goods_name" />
							<view class="eachs-left-text">
								<view class="name">{{ order.goods_name }}</view>
								<view class="describe" v-if="order.describe">
									{{ order.describe }}
								</view>
								<view class="specification">{{ order.goods_attr }}</view>
							</view>
						</view>
						<view class="eachs-right" @click="toPreview(detail.order_no)">
							<view class="number">预览打印</view>
							<view class="iconfont iconxiaoyuhao-copy"></view>
						</view>
					</view>
					<view class="eachs-bottom">
						<!-- 文档打印  选择属性-->
						<view class="property">
							<view
								class="property-item"
								v-for="(attr, index) in spec.spec_attr"
								:key="attr.group_id"
							>
								<view class="item-title">{{ attr.group_name }}</view>
								<view class="data" v-if="attr.spec_items.length === 1">
									{{ attr.spec_items[0].spec_value }}
								</view>
								<view class="data" v-else>
									<view
										class="data-radio"
										v-for="item in attr.spec_items"
										:key="item.item_id"
										@click="changeGoodSku(item.item_id, index)"
									>
										<view
											class="data-radio-box"
											:style="{
												background:
													item.item_id === Number(specIds[index])
														? '#FD2316'
														: '',
												boder:
													item.item_id === Number(specIds[index])
														? '1px soild #FD2316'
														: '1px soild #E4E4E4'
											}"
										></view>
										<view
											class="data-radio-text"
											:style="{
												color:
													item.item_id === Number(specIds[index])
														? ''
														: '#E4E4E4'
											}"
										>
											{{ item.spec_value }}
										</view>
									</view>
								</view>
							</view>
							<view class="property-item">
								<view class="item-title">份数</view>
								<view class="data">
									<view class="data-btns" @click="order.total_num -= 1">-</view>
									<input
										type="number"
										class="data-number"
										v-model="order.total_num"
										@blur="setTotalNum"
										@confirm="setTotalNum"
									/>
									<view class="data-btns" @click="order.total_num += 1">+</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<order-info :info="detail" />
		<view class="btns">
			<view class="btn-class-black" @click="submitOrder">提交订单</view>
			<view class="btn-class-red" @click="toPay">去付款</view>
		</view>

		<confirm-modal
			v-if="showConfirm"
			:title="confirmObj.title"
			:text="confirmObj.text"
			:left-text="confirmObj.leftText"
			:right-text="confirmObj.rightText"
			@clickLeft="goHome"
			@clickRight="goTabs"
		/>

		<pay-order
			v-if="showPay"
			@closePay="showPay = false"
			@complete="completePay"
			:pay-price="detail.pay_price"
			:order-no="detail.order_no"
		/>
	</view>
</template>

<script>
import fileIcon from '@/components/fileIcon/fileIcon.vue';
import orderInfo from '@/components/orderInformation/orderInformation.vue';
import payOrder from '@/components/payOrder/payOrder.vue';
import { onSubmitOrder } from '@/common/js/utils.js';

import {
	preOrderDetail,
	specList,
	previewZoomPrintFile,
	resetPrice
} from '@/common/api/order.js';

export default {
	components: { fileIcon, orderInfo, payOrder },
	data() {
		return {
			showPay: false,
			showConfirm: false,
			detail: {},
			spec: {},
			order: {},
			specIds: [],
			submitParams: {},
			pageObj: {},
			confirmObj: {
				title: '提交成功',
				text: '您可在首页待付款中查看，也可继续添加打印',
				leftText: '返回首页',
				rightText: '继续添加'
			}
		};
	},
	onLoad(option) {
		this.getOrderDetail(option.orderNo);
	},
	watch: {
		// 订单份数值
		'order.total_num'(val) {
			if (val <= 0) {
				this.order.total_num = 1;
				this.showMessage('份数值必须大于0');
				return;
			}
			this.changeGoodList('total_num');
		}
	},
	methods: {
		completePay(orderId) {
			this.showPay = false;
			uni.reLaunch({
				url: `/pages/index/order/success/success?orderId=${orderId}`
			});
		},

		/* 支付 */
		toPay() {
			this.showPay = true;
		},

		/* 提交订单 */
		submitOrder() {
			onSubmitOrder(this.detail.order_no, () => {
				this.showConfirm = true;
			});
		},
		/**
		 * 重置订单价钱
		 * @param {Object} type
		 * @param {Object} data
		 */
		async resetPrice(type, data) {
			let submitParams = this.submitParams;
			switch (type) {
				case 'list':
					const listIndex = submitParams.goods_list.findIndex(value => {
						return Number(data.file_id) === Number(value.file_id);
					});
					submitParams.goods_list[listIndex] = data;
					break;
				case 'sku':
					const skuIndex = submitParams.goods_sku.findIndex(value => {
						return Number(data.goods_id) === Number(value.goods_id);
					});
					submitParams.goods_sku[skuIndex] = data;
					break;
				case 'coupon':
					submitParams.coupon_id = data.coupon_id;
					break;
			}
			submitParams.goods_list = JSON.stringify(submitParams.goods_list);
			submitParams.goods_sku = JSON.stringify(submitParams.goods_sku);
			try {
				this.detail = await resetPrice(submitParams);
				this.order = this.detail.goods_list[0];
				this.specIds = this.order.spec_sku_id.split('_');
				this.formatOrder(this.order);
			} catch (e) {
				this.showMessage(e.msg);
			}
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
			this.resetPrice('sku', {
				goods_id: this.order.goods_id,
				sku_id: skuObj.price_sku_id
			});
		},

		/**
		 * 预览文件
		 * @param {Object} orderNo
		 */
		async toPreview(orderNo) {
			try {
				const result = await previewZoomPrintFile({ order_no: orderNo });
				uni.navigateTo({
					url: `/pages/index/selectFile/selectFile?type=preview&url=${
						result.file_paths[0]
					}`
				});
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 获取预览订单详情
		 * @param {Object} orderNo
		 */
		async getOrderDetail(orderNo) {
			try {
				this.detail = await preOrderDetail({ order_no: orderNo });
				this.order = this.detail.goods_list[0];
				this.formatOrder(this.order);
				this.specIds = this.order.spec_sku_id.split('_');
				this.getSpecList();
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 获取规格
		 */
		async getSpecList() {
			try {
				this.spec = await specList({ group_id: 0 });
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 格式化提交数据
		 * @param {Object} order 订单
		 */
		formatOrder(order) {
			this.submitParams = {
				order_no: this.detail.order_no,
				goods_list: [
					{
						file_id: order.goods_id,
						start_page: order.goods_page_start,
						end_page: order.goods_page_end,
						total_num: order.total_num
					}
				],
				goods_sku: [
					{
						goods_id: order.goods_id,
						sku_id: order.goods_sku_id
					}
				]
			};
			this.pageObj = {
				goods_page_start: order.goods_page_start,
				goods_page_end: order.goods_page_end,
				total_num: order.total_num
			};
		},

		/**
		 * 变更文件范围份数
		 */
		changeGoodList(name) {
			if (this.pageObj[name] === this.order[name]) {
				return;
			}
			this.pageObj[name] = this.order[name];
			this.resetPrice('list', {
				file_id: this.order.goods_id,
				start_page: this.order.goods_page_start,
				end_page: this.order.goods_page_end,
				total_num: this.order.total_num
			});
		},

		setTotalNum(e) {
			this.order.total_num = Number(e.detail.value);
		},

		/* 返回首页 */
		goHome() {
			uni.switchTab({
				url: '/pages/tabbar/index/index'
			});
		},

		/* 返回选项卡页 */
		goTabs() {
			const size = getCurrentPages().length;
			uni.navigateBack({
				delta: size >= 3 ? size - 2 : 1
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
		.eachs {
			box-sizing: border-box;

			.eachs-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 178upx;
				border-bottom: 1px solid rgba(226, 225, 225, 1);
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
			.eachs-top {
				height: 100%;
			}
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
.btns {
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	width: 100%;
	z-index: 1;
}
</style>
