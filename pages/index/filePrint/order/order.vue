<template>
	<view>
		<view class="printing" v-if="orderDetail.goods_list">
			<!-- 文档打印  列表-->
			<file-order
				v-for="item in orderDetail.goods_list"
				:key="item.goods_id"
				:detail="item"
				:spec="spec"
				:documentType="documentType"
				:menu-good-id="menuGoodId"
				:order-no="orderDetail.order_no"
				@setMenu="setMenu"
				@resetPrice="resetPrice"
				@delOrder="getOrderDetail"
			/>

			<!-- 文档打印 新增-->
			<view
				class="add"
				v-if="orderDetail.goods_list.length < 5 && Number(orderType) !== 4"
				@click="addFile"
			>
				<view class="iconfont iconhao" />
			</view>
			<!-- 文档打印  信息-->
			<orderInformation :info="orderDetail" @resetPrice="resetPrice" />
			<view class="btns">
				<view class="btn-class-black" @click="submitOrder">提交订单</view>
				<view class="btn-class-red" @click="toPay">去付款</view>
			</view>
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
			:pay-price="orderDetail.pay_price"
			:order-no="orderDetail.order_no"
		/>

		<up-loading v-if="showUpLoading" />
	</view>
</template>

<script>
import orderInformation from '@/components/orderInformation/orderInformation.vue';
import fileOrder from '@/components/fileOrder/fileOrder.vue';
import payOrder from '@/components/payOrder/payOrder.vue';
import { preOrderDetail, specList, resetPrice } from '@/common/api/order';
import { printFileUpload } from '@/common/api/index.js';
import { onSubmitOrder } from '@/common/js/utils.js';
import upLoading from '@/components/uploadLoading/uploadLoading.vue';

export default {
	components: {
		fileOrder,
		orderInformation,
		payOrder,
		upLoading
	},
	data() {
		return {
			showUpLoading: false,
			orderDetail: {},
			spec: {},
			documentType: 1,
			submitParams: {},
			showPay: false,
			orderType: null,
			menuGoodId: 0,
			showConfirm: false,
			confirmObj: {
				title: '提交成功',
				text: '您可在首页待付款中查看，也可继续添加打印',
				leftText: '返回首页',
				rightText: '继续添加'
			}
		};
	},
	onLoad(option) {
		//orderType 2:百度网盘
		if (option.orderType) {
			this.orderType = option.orderType;
		}
		this.getOrderDetail(option.orderNo);
	},
	methods: {
		/**
		 * 完成支付
		 * @param {Object} orderId
		 */
		completePay(orderId) {
			this.showPay = false;
			uni.reLaunch({
				url: `/pages/index/order/success/success?orderId=${orderId}`
			});
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
		},

		/* 提交订单 */
		submitOrder() {
			onSubmitOrder(this.orderDetail.order_no, () => {
				this.showConfirm = true;
			});
		},

		/**
		 * 控制菜单栏打开值
		 * @param {Object} id  产品ID
		 */
		setMenu(id) {
			if (this.menuGoodId === Number(id)) {
				this.menuGoodId = 0;
				return;
			}
			this.menuGoodId = Number(id);
		},

		/* 支付 */
		toPay() {
			this.showPay = true;
		},

		/* 添加文件上传 */
		addFile() {
			switch (Number(this.orderType)) {
				case 1:
					wx.chooseMessageFile({
						count: 5 - this.orderDetail.goods_list.length,
						type: 'file',
						success: res => {
							this.uploadFile(res.tempFiles);
						}
					});
					break;
				case 2:
					uni.navigateTo({
						url: `../baidu/baidu?orderNo=${this.orderDetail.order_no}`
					});
					break;
				default:
					uni.navigateTo({
						url: `../../selectFile/selectFile?type=print&orderNo=${
							this.orderDetail.order_no
						}`
					});
					break;
			}
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
				this.orderDetail = await resetPrice(submitParams);
				this.formatGoods(this.orderDetail.goods_list);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 获取规格信息列表
		 * @param {Number} group_id  定价组ID 0：文档打印
		 */
		async getSpecList() {
			try {
				this.spec = await specList({ group_id: 0 });
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 根据订单编号获取订单详情
		 * @param {Object} orderNo  订单编号
		 */
		async getOrderDetail(orderNo) {
			try {
				this.orderDetail = await preOrderDetail({ order_no: orderNo });
				this.formatGoods(this.orderDetail.goods_list);
				this.getSpecList();
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		/**
		 * 格式化订单文件
		 * @param {Object} list  订单列表
		 */
		formatGoods(list) {
			let params = {
				order_no: this.orderDetail.order_no,
				goods_list: [],
				goods_sku: []
			};
			for (let el of list.values()) {
				params.goods_list.push({
					file_id: el.goods_id,
					start_page: el.goods_page_start,
					end_page: el.goods_page_end,
					total_num: el.total_num
				});
				params.goods_sku.push({
					goods_id: el.goods_id,
					sku_id: el.goods_sku_id
				});
			}
			this.submitParams = params;
		},

		/**
		 * 上传文件
		 * @param {Object} data	 上传文件
		 */
		async uploadFile(data) {
			this.showUpLoading = true;
			let params = {
				upload_type: 2,
				scene: 1,
				order_no: this.orderDetail.order_no
			};
			try {
				for (let [index, el] of data.entries()) {
					const name = el.name.substring(0, el.name.lastIndexOf('.'));
					params.reset_file_name = `${name}.pdf` || `文档${index + 1}.pdf`;
					await printFileUpload(el.path, params);
				}
				this.getOrderDetail(this.orderDetail.order_no);
			} catch (e) {
				this.showMessage(e.msg);
			} finally {
				this.showUpLoading = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.printing {
	padding-bottom: 130upx;
}

.specifications {
	padding-top: 18upx;
	padding-bottom: 5upx;
	border-bottom: 1px solid rgba(226, 225, 225, 1);
	.specification-item {
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

		.data {
			letter-spacing: 0upx;
		}
	}
}
.add {
	border-bottom: 1px solid rgba(226, 225, 225, 1);
	height: 200upx;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	z-index: 1;

	color: rgba(253, 35, 22, 1);
	.iconfont {
		font-weight: 500;
		font-size: 73upx;
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
	margin-bottom: 120upx;
}
.btns {
	position: fixed;
	bottom: 0;
	display: flex;
	width: 100%;
	.btn-class-black {
		width: 50%;
	}
	.btn-class-red {
		width: 50%;
	}
}
</style>
