<template>
	<view v-if="detail && detail.order_id">
		<!-- 订单详情状态 -->
		<view
			:class="['order-state', { refund: detail.order_status.value === 40 }]"
		>
			<view class="title">{{ status[detail.order_status.value] }}</view>
			<view v-if="detail.order_status.value === 10">
				剩
				<text v-show="countDownTime.hour > 0">
					{{ countDownTime.hour }}小时
				</text>
				<text v-show="countDownTime.minute > 0">
					{{ countDownTime.minute }}分钟
				</text>
				<text>{{ countDownTime.second }}秒</text>
				自动关闭
			</view>
			<view v-else-if="detail.order_status.value === 30">
				<view>取件地址：{{ detail.printer.address }}</view>
				<view>设备名称：{{ detail.printer.printer_name }}</view>
			</view>
			<view v-else-if="detail.order_status.value === 40">
				{{ detail.pay_time }}
			</view>
		</view>
		<!-- 订单文档 -->
		<view class="detail-order">
			<view
				class="detail-list"
				v-for="item in detail.print_file_data"
				:key="item.goods_name"
			>
				<file-icon :type="item.goods_name" />
				<view>
					<view>{{ item.goods_name }}</view>
					<view>{{ item.goods_attr }}</view>
				</view>
				<view>x {{ item.total_num }}</view>
				<view>￥{{ item.total_pay_price }}</view>
			</view>
		</view>
		<!-- 订单信息 -->
		<orderInformation
			:info="detail"
			:disable-coupon="true"
			:is-refund="detail.order_status.value === 40"
		></orderInformation>
		<!-- 订单信息 -->
		<view class="order-info">
			<view class="order-info-title">订单信息:</view>
			<view class="order-info-cont">
				<view class="info-item" v-for="item in orderInfo" :key="item.key">
					<view class="info-title">{{ item.key }}</view>
					<view class="data">{{ item.value }}</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 根据状态判断显示 -->
		<view class="btns pend-btn">
			<view
				class="btn-class-black"
				v-if="detail.order_status.value === 10"
				@click="cancelBtn(detail)"
			>
				取消订单
			</view>
			<view
				class="btn-class-red"
				v-if="detail.order_status.value !== 30"
				@click="optionBtn(detail)"
			>
				{{ btnText[detail.order_status.value] }}
			</view>
		</view>

		<confirm-modal
			v-if="showConfirm"
			:title="confirmObj.title"
			@clickLeft="showConfirm = false"
			@clickRight="optionOrder"
		/>

		<pay-order
			@closePay="showPay = false"
			@complete="completePay"
			v-if="showPay"
			:pay-price="detail.pay_price"
			:order-no="detail.order_no"
		/>
	</view>
</template>

<script>
import orderInformation from '@/components/orderInformation/orderInformation.vue';
import fileIcon from '@/components/fileIcon/fileIcon.vue';
import {
	orderDetail,
	orderCancel,
	orderRefund,
	orderDelete
} from '@/common/api/order.js';
import payOrder from '@/components/payOrder/payOrder.vue';

export default {
	components: {
		orderInformation,
		fileIcon,
		payOrder
	},
	data() {
		return {
			showConfirm: false,
			confirmObj: {},
			showPay: false,
			detail: {},
			orderInfo: [],
			status: {
				10: '待付款',
				20: '待取件',
				30: '已完成',
				40: '退款成功',
				41: '已取消'
			},
			btnText: {
				10: '付款',
				20: '申请退款',
				30: '已完成',
				40: '我知道了',
				41: '删除'
			},
			timer: null,
			countDownTime: {
				hour: 0,
				minute: 0,
				second: 0
			}
		};
	},
	onLoad(option) {
		this.getOrderDetail(option.orderId);
	},
	onHide() {
		clearInterval(this.timer);
	},
	methods: {
		completePay(orderId) {
			this.showPay = false;
			uni.reLaunch({
				url: `../success/success?orderId=${orderId}`
			});
		},

		/**
		 * 根据订单判断操作
		 * @param {Object} detail
		 */
		optionBtn(detail) {
			switch (detail.order_status.value) {
				case 10:
					this.showPay = true;
					break;
				case 20:
					this.confirmObj = {
						title: '您确认申请退款吗？',
						status: detail.order_status.value,
						orderId: detail.order_id
					};
					this.showConfirm = true;
					break;
				case 40:
					uni.navigateBack({
						delta: 1
					});
					break;
				default:
					this.confirmObj = {
						title: '您确认删除订单吗？',
						status: detail.order_status.value,
						orderId: detail.order_id
					};
					this.showConfirm = true;
					break;
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
				default:
					this.deleteOrder(this.confirmObj.orderId);
					break;
			}
		},

		/**
		 * 点击取消订单按钮
		 * @param {Object} detail
		 */
		cancelBtn(detail) {
			this.confirmObj = {
				title: '您确认取消订单吗？',
				orderId: detail.order_id,
				status: detail.order_status.value
			};
			this.showConfirm = true;
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
				this.getOrderDetail(orderId);
			} catch (e) {
				this.showMessage(e, msg);
			}
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
				uni.navigateBack({
					delta: 1
				});
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
				this.getOrderDetail(orderId);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 根绝订单ID获取订单详情
		 * @param {Object} orderId
		 */
		async getOrderDetail(orderId) {
			try {
				const result = await orderDetail({
					order_id: orderId
				});
				this.detail = result;
				// 10:待付款 20：代取件 30：已完成 40：已退款 41：已取消
				switch (result.order_status.value) {
					case 10:
						this.countDown();
						this.orderInfo = [
							{ key: '预计总积分：', value: `${result.points_bonus}分` },
							{
								key: '赠送偶像：',
								value: `${result.points_bonus - result.points_bonus_my}分`
							},
							{
								key: '实际获得：',
								value: `${result.points_bonus_my}分`
							},
							{ key: '订单号：', value: result.order_no },
							{ key: '创建时间：', value: result.create_time }
						];
						break;
					case 20:
						this.orderInfo = [
							{ key: '支付信息：', value: result.pay_type.text },
							{ key: '预计总积分：', value: `${result.points_bonus}分` },
							{
								key: '赠送偶像：',
								value: `${result.points_bonus - result.points_bonus_my}分`
							},
							{
								key: '实际获得：',
								value: `${result.points_bonus_my}分`
							},
							{ key: '订单号：', value: result.order_no },
							{ key: '创建时间：', value: result.create_time },
							{ key: '付款时间：', value: result.pay_time }
						];
						break;
					case 30:
						this.orderInfo = [
							{ key: '支付信息：', value: result.pay_type.text },
							{ key: '总积分：', value: `${result.points_bonus}分` },
							{
								key: '赠送偶像：',
								value: `${result.points_bonus - result.points_bonus_my}分`
							},
							{
								key: '实际获得：',
								value: `${result.points_bonus_my}分`
							},
							{ key: '订单号：', value: result.order_no },
							{ key: '创建时间：', value: result.create_time },
							{ key: '付款时间：', value: result.pay_time }
						];
						break;
					case 40:
						this.orderInfo = [
							{ key: '支付信息：', value: result.pay_type.text },
							{ key: '订单号：', value: result.order_no },
							{ key: '创建时间：', value: result.create_time },
							{ key: '付款时间：', value: result.pay_time }
						];
						break;
					case 41:
						this.orderInfo = [
							{ key: '订单号：', value: result.order_no },
							{ key: '创建时间：', value: result.create_time },
							{ key: '取消时间：', value: result.cancel_time }
						];
						break;
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/* 倒计时 */
		countDown() {
			let times =
				24 * 60 * 60 -
				Math.floor(
					this.detail.current_time -
						Math.round(new Date(this.detail.create_time) / 1000)
				);
			if (times > 0) {
				this.timer = setInterval(() => {
					this.countDownTime = {
						hour: parseInt((times / 60 / 60) % 24),
						minute: parseInt((times / 60) % 60),
						second: parseInt(times % 60)
					};
					if (times <= 0) {
						clearInterval(this.timer);
					}
					times--;
				}, 1000);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.order-state {
	height: 212upx;
	padding-left: 66upx;
	display: flex;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(226, 225, 225, 1);
	flex-flow: column wrap;
	justify-content: center;

	& > view {
		color: #0f0c0b;
		&:nth-child(1) {
			font-size: 40upx;
		}
		&:nth-child(2) {
			font-size: 24upx;
			font-weight: 200;
		}
		&:nth-child(3) {
		}
	}

	&.refund > view {
		color: #fd2316;
	}
}

.order-info {
	padding-left: 48upx;
	box-sizing: border-box;
	padding-bottom: 130upx;

	.order-info-title {
		font-size: 30upx;
		font-weight: 200;
		padding-top: 40upx;
		color: rgba(15, 12, 11, 1);
		margin-bottom: 28upx;
	}

	.order-info-cont {
		.info-item {
			font-size: 24upx;
			font-weight: 200;
			margin-bottom: 14upx;
			color: rgba(15, 12, 11, 1);
			display: flex;
			align-items: center;

			.info-title {
				width: 236upx;
			}
		}
	}
}

.btns {
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
}
.eachs {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 112upx;
	box-sizing: border-box;
	padding-left: 54upx;
	padding-right: 138upx;
}

.detail-order {
	box-sizing: border-box;
	padding: 40upx 40upx 0;
	border-bottom: 1upx solid rgba(226, 225, 225, 1);
	.detail-list {
		display: flex;
		align-items: center;
		margin-bottom: 40upx;
		& > view {
			color: #222;
			font-weight: 200;
			&:nth-child(2) {
				& > view {
					&:nth-child(1) {
						font-size: 24upx;
						width: 270upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					&:nth-child(2) {
						color: #979797;
						font-size: 18upx;
					}
				}
			}
			&:nth-child(3) {
				flex: 1;
				text-align: right;
				font-size: 24upx;
			}
			&:nth-child(4) {
				min-width: 110upx;
				text-align: right;
				font-size: 22upx;
			}
		}
	}
}
</style>
