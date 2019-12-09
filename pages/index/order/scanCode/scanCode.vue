<template>
	<view class="print-list">
		<view class="check-all" @click="checkAllBtn">
			<text :class="{ active: isAll }">{{ isAll ? '全不选' : '全选' }}</text>
		</view>
		<!-- 订单列表 -->
		<view class="list">
			<view class="list-item" v-for="order in orderList" :key="order.order_no">
				<view class="checkbox" @click="checkboxBtn(order.order_no)">
					<text v-if="!checkAll.includes(order.order_no)"></text>
					<image src="../../../../static/img/zq.png" mode="" v-else></image>
				</view>
				<view class="item-each">
					<view
						class="eachs"
						v-for="item in order.print_file_data"
						:key="item.goods_name"
					>
						<view class="eachs-left">
							<file-icon :type="item.goods_name" />
							<view class="eachs-left-text">
								<view class="name">{{ item.goods_name }}</view>
								<view class="describe">{{ item.goods_attr }}</view>
							</view>
						</view>
						<view class="eachs-right">
							<view class="number">x{{ item.total_num }}</view>
							<view class="money">￥{{ item.total_pay_price }}</view>
						</view>
					</view>
				</view>
				<view class="item-bottom">
					<view class="describe">
						<view class="">{{ order.print_file_data.length }}个文档</view>
						<view class="total">
							合计
							<text>￥{{ order.pay_price }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-class-red" @click="submitOrder">确认</view>

		<confirm-modal
			v-if="showConfirm"
			:title="confitmTitle"
			:is-tip="true"
			@clickTip="goHome"
		/>
	</view>
</template>

<script>
import fileIcon from '@/components/fileIcon/fileIcon.vue';
import { printOrders } from '@/common/api/order.js';
import { inspect } from '@/common/api/device.js';

export default {
	components: { fileIcon },
	data() {
		return {
			checkAll: [],
			orderList: [],
			isAll: false,
			printId: '',
			confitmTitle: '文件正在打印，请稍等！',
			showConfirm: false
		};
	},

	onLoad(option) {
		this.printId = option.printId;
	},

	onShow() {
		this.getList();
	},
	watch: {
		checkAll(val) {
			this.isAll = val.length === this.orderList.length;
		}
	},
	methods: {
		/* 提交订单 */
		async submitOrder() {
			if (this.checkAll.length) {
				try {
					await inspect({
						print_id: this.printId,
						order_no: this.checkAll.toString()
					});
					this.showConfirm = true;
				} catch (e) {
					this.showMessage(e.msg);
				}
			} else {
				this.showMessage('请选择订单');
			}
		},

		/* 获取列表 */
		async getList() {
			const result = await printOrders({ page_num: 999 });
			this.orderList = result.data;
		},

		/* 选择订单 */
		checkboxBtn(orderNo) {
			if (this.checkAll.includes(orderNo)) {
				this.checkAll.splice(
					this.checkAll.findIndex(value => {
						return orderNo === value;
					}),
					1
				);
			} else {
				this.checkAll.push(orderNo);
			}
		},

		/* 全选 */
		checkAllBtn() {
			if (this.checkAll.length !== this.orderList.length) {
				this.checkAll = [];
				for (let el of this.orderList) {
					this.checkAll.push(el.order_no);
				}
			} else {
				this.checkAll = [];
			}
		},

		goHome() {
			this.showConfirm = false;
			uni.switchTab({
				url: '/pages/tabbar/index/index'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.print-list {
	padding-top: 50upx;
	padding-bottom: 130upx;
	.btn-class-red {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		&:active {
			opacity: 0.8;
		}
	}
}
.list {
	.list-item {
		width: 670upx;
		margin: 0 auto;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
		border-radius: 20upx;
		padding-top: 20upx;
		margin-top: 38upx;
		padding-bottom: 30upx;
		margin-bottom: 38upx;
		.checkbox {
			padding-left: 24upx;
			padding-top: 18upx;
			text {
				display: block;
				width: 36upx;
				height: 36upx;
				background: rgba(255, 255, 255, 1);
				box-sizing: border-box;
				border: 2upx solid rgba(201, 196, 196, 1);
				border-radius: 50%;
			}
			image {
				display: block;
				width: 36upx;
				height: 36upx;
			}
		}
		.item-each {
			.eachs {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 112upx;
				box-sizing: border-box;
				padding-left: 24upx;
				padding-right: 52upx;
				border-bottom: 1px solid rgba(226, 225, 225, 1);

				.eachs-left {
					display: flex;
					align-items: center;

					image {
						width: 58upx;
						height: 74upx;
						display: block;
						margin-right: 34upx;
					}

					.eachs-left-text {
						margin-left: 10upx;
						.name {
							font-size: 24upx;
							font-weight: 200;
							color: rgba(34, 34, 34, 1);
							width: 270upx;
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
					font-size: 20upx;
					font-weight: 200;
					color: rgba(34, 34, 34, 1);

					.number {
						margin-right: 52upx;
					}

					.money {
						color: rgba(34, 34, 34, 1);
					}
				}
			}
		}

		.item-bottom {
			.describe {
				display: flex;
				margin-top: 18upx;
				justify-content: flex-end;
				align-items: center;
				font-size: 20upx;
				font-weight: 200;
				box-sizing: border-box;
				padding-right: 52upx;
				margin-bottom: 30upx;
				color: rgba(34, 34, 34, 1);

				.total {
					margin-left: 38upx;

					text {
						font-size: 24upx;
						font-family: Lantinghei SC;
						font-weight: 600;
						color: rgba(34, 34, 34, 1);
					}
				}
			}
		}
	}
}
.check-all {
	position: fixed;
	top: 30upx;
	right: 64upx;
	z-index: 1;
	text {
		text-align: center;
		display: block;
		width: 132upx;
		height: 40upx;
		background-color: rgba(255, 255, 255, 1);
		border: 1px solid rgba(253, 35, 22, 1);
		border-radius: 20upx;
		font-size: 28upx;

		font-weight: 200;
		line-height: 40upx;
		color: rgba(255, 34, 41, 1);
	}
	.active {
		color: #fff;
		background-color: #fd2316;
	}
}
</style>
