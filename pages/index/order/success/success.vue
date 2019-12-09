<template>
	<view v-if="detail && detail.order_id">
		<!-- 订单详情状态 -->
		<view class="order-state">
			<view class="title">您已付款成功</view>
			<view class="title">请去微印打印机扫码取件</view>
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
		<orderInformation :info="detail" :disable-coupon="true"></orderInformation>
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
			<view class="btn-class-black" @click="closeBtn()">关闭</view>
			<view class="btn-class-red" @click="toDevice()">查看打印机</view>
		</view>
	</view>
</template>

<script>
import orderInformation from '@/components/orderInformation/orderInformation.vue';
import fileIcon from '@/components/fileIcon/fileIcon.vue';
import { orderDetail } from '@/common/api/order.js';

export default {
	components: {
		orderInformation,
		fileIcon
	},
	data() {
		return {
			detail: {},
			orderInfo: []
		};
	},
	onLoad(option) {
		this.getOrderDetail(option.orderId);
	},
	methods: {
		toDevice() {
			uni.navigateTo({
				url: '/pages/index/nearDevice/index/index'
			});
		},

		/* 关闭按钮 */
		closeBtn() {
			uni.switchTab({
				url: '/pages/tabbar/index/index'
			});
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
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.order-state {
	height: 212upx;
	display: flex;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(226, 225, 225, 1);
	flex-direction: column;
	justify-content: center;
	align-items: center;

	& > view {
		color: #0f0c0b;
		.title {
			font-size: 40upx;
			font-weight: 600;
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
				width: 266upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				& > view {
					&:nth-child(1) {
						font-size: 24upx;
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
