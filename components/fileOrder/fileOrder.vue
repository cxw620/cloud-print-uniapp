<template>
	<view>
		<!-- 文档打印  列表-->
		<uni-swipe-action>
			<uni-swipe-action-item :options="options" @click="showConfirm = true">
				<view class="each">
					<view class="item-each">
						<view
							class="eachs"
							:class="documentType == 2 ? 'documentTypeClass' : ''"
						>
							<view class="eachs-top">
								<view class="eachs-left">
									<image src="../../static/img/pdf.png" mode="" />
									<view class="eachs-left-text">
										<view class="name">{{ order.goods_name }}</view>
										<view class="describe" v-if="order.describe">
											{{ order.describe }}
										</view>
										<view class="specification">{{ order.goods_attr }}</view>
									</view>
								</view>
								<view
									class="eachs-right"
									v-if="documentType === 1"
									@click="toPreview(order.goods_id)"
								>
									<view class="number">预览打印</view>
									<view class="iconfont iconxiaoyuhao-copy"></view>
								</view>
								<view class="eachs-rightnumber eachs-right" v-else>
									<view class="number">x1</view>
									<view class="money">￥1.50</view>
								</view>
							</view>
							<view
								class="eachs-bottom"
								v-show="Number(order.goods_id) === menuGoodId"
							>
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
										<view class="item-title">范围</view>
										<view class="data">
											<view
												class="data-all"
												@click="allPages"
												:style="{
													background:
														order.goods_page_end +
															1 -
															order.goods_page_start ===
														order.all_goods_page
															? '#FD2316'
															: '',
													color:
														order.goods_page_end +
															1 -
															order.goods_page_start ===
														order.all_goods_page
															? '#fff'
															: ''
												}"
											>
												全部
											</view>
											<view class="data-sel">
												<input
													type="number"
													@blur="setpageStart"
													@confirm="setpageStart"
													v-model="order.goods_page_start"
												/>
												<text>至</text>
												<input
													type="number"
													@blur="setpageEnd"
													@confirm="setpageEnd"
													v-model="order.goods_page_end"
												/>
												<text>页</text>
											</view>
										</view>
									</view>
									<view class="property-item">
										<view class="item-title">份数</view>
										<view class="data">
											<view class="data-btns" @click="order.total_num -= 1">
												-
											</view>
											<input
												type="number"
												class="data-number"
												v-model="order.total_num"
												@blur="setTotalNum"
												@confirm="setTotalNum"
											/>
											<view class="data-btns" @click="order.total_num += 1">
												+
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view
						class="btn-examine"
						@click="setMenu(order.goods_id)"
						v-if="documentType === 1"
					>
						<view
							:class="[
								'iconfont',
								Number(order.goods_id) === menuGoodId
									? 'icontop'
									: 'iconxiaoyuhao-copy'
							]"
						/>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>

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
import { delOrderFile } from '@/common/js/utils.js';

export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem
	},
	props: {
		detail: {
			type: Object,
			default: () => {
				return {};
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
			default: 1
		},
		menuGoodId: {
			type: Number,
			default: 0
		},
		orderNo: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			order: {},
			specIds: [],
			pageObj: {},
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
		'order.total_num'(val) {
			if (val <= 0) {
				this.order.total_num = 1;
				this.showMessage('份数值必须大于0');
				return;
			}
			this.changeGoodList('total_num');
		},

		// 订单起始页
		'order.goods_page_start'(val) {
			if (val <= 0 || val > this.order.goods_page_end) {
				this.showMessage('起始页码必须大于0并且小于结束页码');
				return;
			}
			if (
				val !== 1 &&
				this.order.goods_page_end !== this.order.all_goods_page &&
				this.order.goods_page_end - val >= 100
			) {
				this.showMessage('打印区间页面不能大于100页');
				return;
			}
			this.changeGoodList('goods_page_start');
		},

		// 订单结束页
		'order.goods_page_end'(val) {
			if (
				val < this.order.goods_page_start ||
				val > this.order.all_goods_page
			) {
				this.showMessage('结束页码不能小于起始页并且不能大于总页码');
				return;
			}

			if (
				val !== this.order.all_goods_page &&
				val - this.order.goods_page_start >= 100 &&
				this.order.goods_page_start !== 1
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
		this.initData();
	},
	methods: {
		setMenu(id) {
			this.$emit('setMenu', id);
		},

		/**
		 * 删除订单
		 */
		deleteOrder() {
			this.showConfirm = false;
			delOrderFile(this.orderNo, this.order.goods_id, data => {
				this.$emit('delOrder', data.order_no);
			});
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

		/**
		 * 范围全部
		 */
		allPages() {
			this.order.goods_page_start = 1;
			this.order.goods_page_end = this.order.all_goods_page;
		},

		/* 初始化数据 */
		initData() {
			this.order = this.detail;
			this.specIds = this.order.spec_sku_id.split('_');
			this.pageObj = {
				goods_page_start: this.order.goods_page_start,
				goods_page_end: this.order.goods_page_end,
				total_num: this.order.total_num
			};
		},

		/**
		 * 获取预览文件地址
		 * @param {Object} fileId  文件ID
		 */
		async toPreview(fileId) {
			try {
				const result = await previewPrintFile({ file_ids: fileId });
				if (result.file_paths[0]) {
					uni.navigateTo({
						url: `/pages/index/selectFile/selectFile?type=preview&url=${
							result.file_paths[0]
						}`
					});
				}
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
			this.$emit('resetPrice', 'sku', {
				goods_id: this.order.goods_id,
				sku_id: skuObj.price_sku_id
			});
		},

		/**
		 * 变更文件范围份数
		 */
		changeGoodList(name) {
			if (this.pageObj[name] === this.order[name]) {
				return;
			}
			this.pageObj[name] = this.order[name];
			this.$emit('resetPrice', 'list', {
				file_id: this.order.goods_id,
				start_page: this.order.goods_page_start,
				end_page: this.order.goods_page_end,
				total_num: this.order.total_num
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

			.eachs-top {
				display: flex;

				justify-content: space-between;
				align-items: center;
				height: 178upx;
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
</style>
