<template>
	<view>
		<view class="conversion-item" v-for="(item, index) in list" :key="index">
			<view class="item-left">
				<image src="../../../static/img/logo.png" mode=""></image>
				<view class="item-left-text">
					<text>{{ item.point }}积分</text>
					<text>{{ item.name }}</text>
				</view>
			</view>
			<view class="item-right" @click="btnExchange(item.coupon_id)">兑换</view>
		</view>
		<ToastModal :text="text" v-if="toastModalType"></ToastModal>
		<button class="catch" @click='catchCash'>查看我的代金券</button>
	</view>
</template>

<script>
	import {
		couponCouponList,
		couponAddMyCoupon
	} from '@/common/api/mine.js';
	export default {
		data() {
			return {
				list: [], //获取积分兑换列表
				coupon_id: '', //需要兑换的积分id
				text: '兑换成功',
				toastModalType: false
			};
		},
		onLoad() {
			//获取我的代金券列表
			this.getCouponCouponList();
		},
		methods: {
			catchCash(){

				uni.navigateTo({url:'../kimsVolume/kimsVolume'})
			},
			/* 兑换代金券事件 */
			btnExchange(id) {
				this.coupon_id = id;
				this.queryCouponAddMyCoupon();
			},
			/* 兑换代金券接口 */
			async queryCouponAddMyCoupon() {
				try {
					const result = await couponAddMyCoupon({
						coupon_id: this.coupon_id
					});
					console.log(result);
					this.textVal = '兑换成功';
					this.toastModalType = true;
					setTimeout(() => {
						this.toastModalType = false;
						this.getCouponCouponList();
					}, 2000);

				} catch (e) {
					this.showMessage(e.msg);
				}
			},
			/* 我的代金券 */
			async getCouponCouponList() {
				try {
					const result = await couponCouponList({});
					console.log(result);
					this.list = result.list;
				} catch (e) {
					this.showMessage(e.msg);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.catch {
		color: #fff;
		font-size: 14px;
		position: absolute;
		left: 0;
		bottom: 0;
		border-radius: 0;
		width:100%;
		background-color: #FD2316;
		height:50px;
		line-height: 50px;
	}

	.conversion-item {
		width: 670upx;
		height: 206upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
		border-radius: 20upx;
		margin: 0 auto;
		margin-bottom: 32upx;

		&:nth-of-type(1) {
			margin-top: 64upx;
		}

		.item-left {
			display: flex;
			justify-content: space-between;
			align-items: center;

			image {
				width: 82upx;
				height: 86upx;
				margin-left: 34upx;
			}

			.item-left-text {
				margin-left: 30upx;

				text {
					display: block;
					font-size: 26upx;
					font-weight: 600;
					color: rgba(173, 169, 169, 1);

					&:nth-of-type(2) {
						font-size: 46upx;
						font-weight: 600;
						color: rgba(15, 12, 11, 1);
						margin-top: 14upx;
					}
				}
			}
		}

		.item-right {
			font-size: 26upx;
			font-weight: 600;
			color: rgba(173, 169, 169, 1);
			margin-right: 22upx;
		}
	}
</style>
