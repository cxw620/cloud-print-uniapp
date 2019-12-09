<template>
	<view>
		<!-- 订单信息 -->
		<view class="information">
			<view class="information-item">
				<view class="title">数量</view>
				<view class="data">{{ info.order_total_page_num?info.order_total_page_num:'' }}页</view>
			</view>
			<view class="information-item">
				<view class="title">共计</view>
				<view class="data">￥{{ info.total_price?info.total_price:'' }}</view>
			</view>
			<view class="information-item">
				<view class="title">共享特权</view>
				<view class="data">{{ info.discount?info.discount:'' }}折</view>
			</view>
			<view class="information-item" @click="openCouponModal">
				<view class="title">
					代金券
					<text class="desc" v-show="!disableCoupon">(点击选择)</text>
				</view>
				<view class="data">￥{{ info.coupon_money_total?info.coupon_money_total:'0.00' }}</view>
			</view>
			<view class="information-item">
				<view class="title">{{ isRefund ? '实付款' : '共节省' }}</view>
				<view class="data" :style="{ color: isRefund ? '#0F0C0B' : '#fd2316' }">
					￥{{ isRefund ? `${info.order_price}元` : info.cut_price?info.cut_price:'' }}
				</view>
			</view>
		</view>

		<!-- 退款金额金额 -->
		<view class="refund-money" v-if="isRefund">
			<view>
				<view class="title">退款金额：</view>
				<view class="data">￥{{ info.order_price }}元</view>
			</view>
			<view>
				<view class="title">退至：</view>
				<view class="data">钱包余额</view>
			</view>
		</view>

		<!-- 订单实际付款金额 -->
		<view class="practical-money" v-else>
			<view class="title">实付款</view>
			<view class="data">￥{{ info.pay_price?info.pay_price:'' }}元</view>
		</view>

		<!-- 新增 选择优惠券 -->
		<view class="discountCoupon" v-if="showCoupon">
			<view class="discountCoupon-title">
				<view>优惠券</view>
				<view
					@click="showCoupon = !showCoupon"
					style="width: 50upx;height: 50upx;"
				>
					X
				</view>
			</view>
			<view class="discountCoupon-text" v-show="checked !== null">
				已选中推荐优惠,使用1张代金券,抵扣¥{{
					info.coupon_list[checked].reduce_price
				}}
			</view>
			<view class="discountCouponNav">
				<view
					class="discountCouponNav-item"
					v-for="(item, index) in info.coupon_list"
					:key="item.user_coupon_id"
					@click="checkedCoupon(index)"
				>
					<view class="item-left">
						<image :src="require('@/static/img/discount.png')" mode=""></image>
						<view class="left-text">
							<text>{{ item.create_from_type }}</text>
							<text>￥{{ item.reduce_price }}</text>
							<text>使用日期截至</text>
						</view>
					</view>
					<view class="item-right">
						<view class="right-top">
							<view class="right-top-wei" v-if="checked !== index" />
							<image
								:src="require('@/static/img/gouxuan.png')"
								mode=""
								v-else
							/>
						</view>
						<view class="right-bottom">{{ item.end_time.text }}</view>
					</view>
				</view>
			</view>
			<view class="btn-class-red" @click="confirmCoupon">确定</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		info: {
			type: Object,
			default: () => {
				return {};
			}
		},
		disableCoupon: {
			type: Boolean,
			default: false
		},
		isRefund: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			checked: null,
			showCoupon: false
		};
	},
	methods: {
		openCouponModal() {
			if (!this.disableCoupon) {
				this.checked = null;
				this.showCoupon = true;
			}
		},

		/**
		 * 选择优惠券
		 * @param {Object} index  索引
		 */
		checkedCoupon(index) {
			this.checked = index;
		},

		/* 确认优惠券 */
		confirmCoupon() {
			if (
				this.info.coupon_list.length &&
				this.info.coupon_list[this.checked].user_coupon_id
			) {
				this.$emit('resetPrice', 'coupon', {
					coupon_id: this.info.coupon_list[this.checked].user_coupon_id
				});
			}
			this.showCoupon = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.information {
	padding-top: 18upx;
	padding-bottom: 5upx;
	border-bottom: 1px solid rgba(226, 225, 225, 1);

	.information-item {
		display: flex;
		margin-bottom: 10upx;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding-right: 106upx;
		padding-left: 48upx;
		font-size: 26upx;
		font-weight: 200;
		color: rgba(15, 12, 11, 1);
		letter-spacing: 10upx;

		.desc {
			color: #fd2316;
			letter-spacing: 1upx;
			font-size: 20upx;
		}
		.data {
			letter-spacing: 0upx;
		}
	}
}
.practical-money {
	display: flex;
	border-bottom: 1px solid rgba(226, 225, 225, 1);
	justify-content: space-between;
	box-sizing: border-box;
	align-items: center;
	padding-left: 48upx;
	padding-right: 92upx;
	height: 78upx;
	font-size: 28upx;
	font-weight: 400;
	color: rgba(253, 35, 22, 1);
}

.refund-money {
	border-bottom: 1upx solid rgba(226, 225, 225, 1);
	padding-top: 30upx;
	padding-bottom: 30upx;
	& > view {
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		align-items: center;
		padding-left: 48upx;
		padding-right: 92upx;
		height: 40upx;
		& > view {
			&:nth-child(1) {
				font-size: 24upx;
				color: #0f0c0b;
			}
			&:nth-child(2) {
				font-size: 26upx;
				color: #fd2316;
			}
		}
	}
}

.discountCoupon {
	width: 750upx;
	height: 80vh;
	padding-top: 50upx;
	position: fixed;
	bottom: 0;
	z-index: 998;
	box-sizing: border-box;
	padding-top: 34upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px -2upx 10upx rgba(0, 0, 0, 0.16);

	.discountCouponNav {
		height: 50vh;
		overflow-y: auto;
	}
	.discountCoupon-title {
		display: flex;
		justify-content: space-between;
		font-size: 36upx;
		font-weight: 600;
		color: rgba(11, 11, 11, 1);
		height: 50upx;
		margin-bottom: 48upx;
		box-sizing: border-box;
		padding: 0 38upx;
	}
	.discountCoupon-text {
		margin-left: 38upx;
		font-size: 24upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);
		margin-bottom: 40upx;
	}
	.discountCouponNav-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 718upx;
		height: 210upx;
		background: rgba(255, 255, 255, 1);
		box-sizing: border-box;
		padding-left: 22upx;
		padding-right: 22upx;
		margin: 0 auto 10upx;
		border: 2upx solid rgba(208, 208, 208, 1);
		opacity: 1;
		.item-left {
			display: flex;
			align-items: center;
			.left-text {
				margin-left: 28upx;
				text {
					display: block;
					font-size: 24upx;
					font-weight: 200;
					color: rgba(34, 34, 34, 1);

					&:nth-of-type(2) {
						font-size: 44upx;
						font-weight: 200;
						color: rgba(34, 34, 34, 1);
						margin-top: 10upx;
						margin-bottom: 28upx;
					}
				}
			}
			image {
				display: block;
				width: 86upx;
				height: 86upx;
			}
		}
		.item-right {
			.right-top {
				display: flex;
				justify-content: flex-end;
				image {
					padding-top: 40upx;
					width: 52upx;
					height: 52upx;
					display: block;
					margin-bottom: 24upx;
				}
				.right-top-wei {
					width: 50upx;
					height: 50upx;
					margin-top: 40upx;
					margin-bottom: 24upx;
					border: 2upx solid rgba(112, 112, 112, 1);
					border-radius: 50%;
				}
			}
			.right-bottom {
				font-size: 24upx;
				padding-right: 50upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
			}
		}
	}
	.btn-class-red {
		width: 374upx;
		height: 110upx;
		background: rgba(253, 35, 22, 1);
		opacity: 1;
		margin: 0 auto;
		margin-top: 50upx;
	}
}
</style>
