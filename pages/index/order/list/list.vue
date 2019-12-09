<template>
	<view>
		<!-- 订单选项 -->
		<view class="cont-pending">
			<view class="cont-pending-title">
				<view class="title-left"></view>
				<view class="title-right" @click="navBtn(null)">查看全部订单></view>
			</view>
			<view class="cont-pending-nav">
				<view
					class="pending-item"
					v-for="(item, index) in navlist"
					:key="index"
					@click="navBtn(index)"
				>
					<view class="item-number" v-if="item.number > 0">
						{{ item.number }}
					</view>
					<image
						:src="checkedIndex !== index ? item.img : item.img_sel"
						mode=""
					/>
					<text
						:style="{ color: checkedIndex === index ? '#FD2316' : '#222222' }"
					>
						{{ item.name }}
					</text>
				</view>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="list">
			<view class="list-item" v-for="order in orderList" :key="order.order_no">
				<view
					class="item-state"
					v-if="order.order_status.value === 41"
					@click="deleteBtn(order)"
				>
					<view class="state-text">已取消</view>
					<view class="iconfont iconzu19 state-icon"></view>
				</view>
				<view class="item-state" v-if="order.order_status.value === 40">
					<view class="refund-text">已退款</view>
				</view>
				<view class="item-each">
					<view
						class="eachs"
						@click="btnDetails(order.order_id)"
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
					<view class="btns">
						<view
							v-show="order.order_status.value === 10"
							class="btn-item cancel-btn"
							@click="cancelBtn(order)"
						>
							取消订单
						</view>
						<view
							class="btn-item"
							v-if="order.order_status.value !== 30"
							@click="btnAgain(order)"
						>
							{{ status[order.order_status.value] }}
						</view>
					</view>
				</view>
			</view>
		</view>

		<confirm-modal
			v-if="showConfirm"
			:title="confirmObj.title"
			@clickLeft="showConfirm = false"
			@clickRight="optionOrder"
		/>

		<pay-order
			v-if="showPay"
			@closePay="showPay = false"
			@complete="completePay"
			:pay-price="payPrice"
			:order-no="payOrderNo"
		/>
	</view>
</template>

<script>
import {
	orderList,
	orderCancel,
	orderRefund,
	orderDelete
} from '@/common/api/order.js';
import { homeCount } from '@/common/api/index.js';
import fileIcon from '@/components/fileIcon/fileIcon.vue';
import payOrder from '@/components/payOrder/payOrder.vue';

export default {
	components: { fileIcon, payOrder },
	data() {
		return {
			isMoreData: false,
			showPay: false,
			payPrice: 0,
			payOrderNo: '',
			status: {
				10: '确认付款',
				20: '退款',
				30: '已完成',
				40: '再次打印',
				41: '再次打印'
			},
			showConfirm: false,
			confirmObj: {},
			navlist: [
				{
					name: '待付款',
					number: 0,
					img: require('@/static/img/payment.png'),
					img_sel: require('@/static/img/payment-sel.png')
				},
				{
					name: '待取件',
					number: 0,
					img: require('@/static/img/collect.png'),
					img_sel: require('@/static/img/collect-sel.png')
				},
				{
					name: '已完成',
					number: 0,
					img: require('@/static/img/accomplish.png'),
					img_sel: require('@/static/img/accomplish-sel.png')
				},
				{
					name: '已退款',
					number: 0,
					img: require('@/static/img/delete.png'),
					img_sel: require('@/static/img/delete-sel.png')
				}
			],
			checkedIndex: null,
			orderNumber: [],
			orderList: [],
			page: 1
		};
	},

	onLoad(option) {
		if (option.index !== 'undefined') {
			this.checkedIndex = Number(option.index);
		}
	},

	onShow() {
		this.getHomeCount();
	},

	/* 下拉刷新 */
	onPullDownRefresh() {
		this.page = 1;
		this.getOrderList();
	},

	/* 滚动到底加载 */
	onReachBottom() {
		if (this.isMoreData) {
			this.getOrderList();
		}
	},

	methods: {
		completePay(orderId) {
			this.showPay = false;
			uni.reLaunch({
				url: `../success/success?orderId=${orderId}`
			});
		},

		/**
		 * 首页相关数量信息
		 * @param {Object} location  位置
		 */
		async getHomeCount() {
			try {
				const latitude = uni.getStorageSync('latitude');
				const longitude = uni.getStorageSync('longitude');
				const result = await homeCount({
					coordinate: `${latitude},${longitude}`
				});
				this.homeCount = result;
				const key = ['pend', 'pick_up', 'complete', 'refund'];
				for (let [index, el] of this.navlist.entries()) {
					el.number = result[key[index]];
				}
				this.page = 1;
				this.getOrderList();
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 触发取消订单按钮
		 * @param {Object} order
		 */
		cancelBtn(order) {
			this.confirmObj = {
				title: '您确认取消订单吗？',
				orderId: order.order_id,
				status: order.order_status.value
			};
			this.showConfirm = true;
		},

		deleteBtn(order) {
			this.confirmObj = {
				title: '您确认删除订单吗？',
				orderId: order.order_id,
				status: order.order_status.value
			};
			this.showConfirm = true;
		},

		/**
		 * 删除订单
		 * @param {Object} orderId
		 */
		async deleteOrder(orderId) {
			try {
				await orderDelete({
					order_id: orderId
				});
				this.getHomeCount();
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 确认弹窗点击确认
		 */
		optionOrder() {
			this.showConfirm = false;
			switch (this.confirmObj.status) {
				case 10:
					this.cancelOrder(this.confirmObj.orderId);
					break;
				case 20:
					this.refundOrder(this.confirmObj.orderId);
					break;
				case 41:
					this.deleteOrder(this.confirmObj.orderId);
					break;
			}
		},

		/**
		 * 根据订单ID取消订单
		 * @param {Object} orderId
		 */
		async cancelOrder(orderId) {
			try {
				await orderCancel({
					order_id: orderId
				});
				this.getHomeCount();
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 退款订单
		 * @param {Object} orderId
		 */
		async refundOrder(orderId) {
			try {
				await orderRefund({
					order_id: orderId
				});
				this.btnDetails(orderId);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		//点击切换分类
		navBtn(index) {
			this.checkedIndex = index;
			this.page = 1;
			this.getOrderList();
		},

		/* 获取订单列表 */
		async getOrderList() {
			try {
				const result = await orderList({
					dataType: this.checkedIndex !== null ? this.checkedIndex + 1 : '',
					page: this.page,
					page_num: 20
				});
				if (this.page === 1) {
					this.orderList = [];
				}
				this.orderList.push(...result.data);
				if (this.orderList.length < result.total) {
					this.isMoreData = true;
					this.page++;
					return;
				}
				this.isMoreData = false;
			} catch (e) {
				this.showMessage(e.msg);
			}
			uni.stopPullDownRefresh();
		},

		/**
		 * 根据订单判断执行操作
		 * @param {Object} order
		 * 状态值 10:待付款 20：代取件 30：已完成 40：已退款 41：已取消
		 */
		btnAgain(order) {
			switch (order.order_status.value) {
				case 10:
					this.payPrice = order.pay_price;
					this.payOrderNo = order.order_no;
					this.showPay = true;
					break;
				case 20:
					this.confirmObj = {
						title: '您确认申请退款吗？',
						orderId: order.order_id,
						status: order.order_status.value
					};
					this.showConfirm = true;
					break;
				case 30:
					break;
				default:
					uni.switchTab({
						url: '/pages/tabbar/index/index'
					});
					break;
			}
		},

		/**
		 * 根据订单ID跳转详情页面
		 * @param {Object} orderId
		 */
		btnDetails(orderId) {
			uni.navigateTo({
				url: `../detail/detail?orderId=${orderId}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
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
		margin-bottom: 38upx;

		.item-state {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 26upx;

			.state-text {
				margin-right: 28upx;
				font-size: 24upx;
				font-weight: 200;
				color: rgba(173, 169, 169, 1);
			}

			.refund-text {
				margin-right: 28upx;
				font-size: 24upx;
				font-weight: 200;
				color: #fd2316;
			}

			.state-icon {
				font-size: 27upx;
				color: #ada9a9;
			}
		}

		.item-each {
			.eachs {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 112upx;
				box-sizing: border-box;
				padding-left: 54upx;
				padding-right: 52upx;
				border-bottom: 1px solid rgba(226, 225, 225, 1);

				.eachs-left {
					display: flex;
					align-items: center;

					image {
						width: 58upx;
						height: 74upx;
						display: block;
						margin-right: 24upx;
					}

					.eachs-left-text {
						.name {
							font-size: 24upx;
							font-weight: 200;
							color: rgba(34, 34, 34, 1);
							width: 250upx;
							text-overflow: ellipsis;
							overflow: hidden;
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

			.btns {
				display: flex;
				box-sizing: border-box;
				padding-right: 44upx;
				padding-bottom: 30upx;
				justify-content: flex-end;
				align-items: center;

				.btn-item {
					width: 140upx;
					height: 34upx;
					background: rgba(255, 255, 255, 1);
					border: 1px solid rgba(253, 35, 22, 1);
					border-radius: 20upx;
					text-align: center;
					font-size: 24upx;
					font-weight: 200;
					line-height: 34upx;
					color: rgba(253, 35, 22, 1);

					&:active {
						opacity: 0.8;
					}
				}

				.cancel-btn {
					color: #979797;
					border-color: #979797;
					margin-right: 20upx;
				}
			}
		}
	}
}
</style>
