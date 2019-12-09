<template>
	<view>
	<view class="" v-if="Number(list.length)>0">
		<view class="lomsValime-item" v-for="(item, index) in list" :key="index">
			<view class="item-top">
				<view class="item-top-left">
					<view class="item-number">{{ index + 1 }}</view>
					<view class="use">
						<view class="use-name">{{ item.name }}</view>
						<view class="use-money">￥{{ item.reduce_price }}</view>
					</view>
				</view>
				<view class="operation">
					<view class="operation-btn">去使用</view>
					<button
						class="transfe"
						open-type="share"
						:data-id="item.user_coupon_id"
						v-if="item.marker === '赠送好友'"
					>
						转赠好友
					</button>

					<view class="hint" v-else>不可转增</view>
				</view>
			</view>
			<view class="item-bottom">
				<text>使用日志截至</text>
				<text>{{ item.end_time.text }}</text>
			</view>
		</view>
		</view>
		<view class="without" v-else>
		<image src="../../../static/img/kims.png" mode=""></image>
		<text>这里什么都没有</text>
		</view>
	</view>
</template>

<script>
import { couponMyCoupon, giveMyCoupon } from '@/common/api/mine.js';
export default {
	data() {
		return {
			list: [], //代金卷列表
			cash: '', //代金券信息
			share: '',
			pic_url: ''
		};
	},
	onLoad(options) {
		
	},
	onShow() {
		this.getcouponMyCoupon();
	},
	onShareAppMessage(e) {
		console.log(parseInt(new Date().getTime() / 1000))
		// this.giveCoupon(e.target.dataset.id);
		return {
			title: '测试', // 默认是小程序的名称(可以写slogan等)
			path: `/pages/mine/interval/interval?user_coupon_id=${
				e.target.dataset.id
			}&codeType=4&give_time=${parseInt(new Date().getTime() / 1000)}`, // 默认是当前页面，必须是以‘/’开头的完整路径
			imageUrl: this.pic_url //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
		};
		console.log(e);
	},

	methods: {
		async giveCoupon(id) {
			try {
				const result = await giveMyCoupon({
					user_coupon_id: id
				});
				console.log(result);
			} catch (e) {
				//TODO handle the exception
			}
		},
		/* 获取我的代金卷 */
		async getcouponMyCoupon() {
			try {
				const result = await couponMyCoupon({
					data_type: 'all'
				});
				console.log(result);
				this.list = result.info.list;
				this.pic_url = result.info.pic_url;
			} catch (e) {
				this.showMessage(e.msg);
				//TODO handle the exception
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.lomsValime-item {
	width: 670upx;
	height: 160upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	border-radius: 20upx;
	margin: 0 auto;
	margin-top: 22upx;

	.item-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(226, 225, 225, 1);

		.item-top-left {
			display: flex;

			.item-number {
				margin-top: 28upx;
				padding-left: 28upx;
				margin-right: 38upx;
				font-size: 28upx;
				font-weight: 200;
				color: rgba(151, 151, 151, 1);
			}

			.use {
				.use-name {
					font-size: 20upx;
					font-weight: 200;
					line-height: 24upx;
					color: rgba(34, 34, 34, 1);
					margin-top: 18upx;
					margin-bottom: 12upx;
				}

				.use-money {
					font-size: 32upx;
					font-weight: 600;
					line-height: 24upx;
					color: rgba(253, 35, 22, 1);
					opacity: 1;
				}
			}
		}

		.operation {
			padding-right: 36upx;
			margin-top: 23upx;

			.operation-btn {
				font-size: 24upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
			}

			.hint {
				margin-top: 28upx;
				text-align: right;
				font-size: 16upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
				margin-bottom: 16upx;
			}

			.transfe {
				width: 76upx;
				height: 32upx;
				margin-top: 20upx;
				margin-bottom: 10upx;
				border: 2upx solid rgba(253, 35, 22, 1);
				opacity: 1;
				border-radius: 6upx;
				line-height: 32upx;
				font-size: 16upx;
				text-align: center;
				font-weight: 200;
				color: rgba(253, 35, 22, 1);
				padding: 0;
			}
		}
	}

	.item-bottom {
		margin-top: 10upx;
		padding-left: 100upx;
		padding-right: 36upx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		text {
			font-size: 16upx;

			font-weight: 200;
			line-height: 24upx;
			color: rgba(151, 151, 151, 1);
			opacity: 1;
		}
	}
}
.without{
	image{
		display: block;
		margin: 0 auto;
		margin-top: 220upx;
		margin-bottom: 72upx;
		width: 428upx;
		height: 400upx;
	}
	text{
		display: block;
		width: 100%;
	text-align: center;
	font-size:28upx;
	font-weight:500;
	color:rgba(153,153,153,1);
	}
}
</style>
