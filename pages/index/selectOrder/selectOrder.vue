<template>
	<view>

		<!-- 订单列表 -->
		<view class="list">
			<view class="list-item">
				<view class="item-state">
				</view>
				<view class="item-each">
					<view class="eachs" @click="btnDetails">
						<view class="eachs-left">
							<image src="../../../static/img/pdf.png" mode=""></image>
							<view class="eachs-left-text">
								<view class="name">专业英语复习资料…</view>
								<view class="describe">20191030-Weprint客户端</view>
								<view class="specification">
									<text>1页</text>
									<text>黑白</text>
									<text>单面</text>
								</view>
							</view>
						</view>
						<view class="eachs-right">
							<view class="number">x1</view>
							<view class="money">￥1.50</view>
						</view>
					</view>
					<view class="eachs">
						<view class="eachs-left">
							<image src="../../../static/img/doc.png" mode=""></image>
							<view class="eachs-left-text">
								<view class="name">专业英语复习资料…</view>
								<view class="describe">20191030-Weprint客户端</view>
								<view class="specification">
									<text>1页</text>
									<text>黑白</text>
									<text>单面</text>
								</view>
							</view>
						</view>
						<view class="eachs-right">
							<view class="number">x1</view>
							<view class="money">￥1.50</view>
						</view>
					</view>
				</view>
				<view class="item-bottom">
					<view class="describe">
						<view class="">2个文档</view>
						<view class="total">合计 <text>￥2.00</text></view>
					</view>
			
				</view>

			</view>
			<view class="list-item">
				<view class="item-state">
				</view>
				<view class="item-each">
					<view class="eachs" @click="btnDetails">
						<view class="eachs-left">
							<image src="../../../static/img/pdf.png" mode=""></image>
							<view class="eachs-left-text">
								<view class="name">专业英语复习资料…</view>
								<view class="describe">20191030-Weprint客户端</view>
								<view class="specification">
									<text>1页</text>
									<text>黑白</text>
									<text>单面</text>
								</view>
							</view>
						</view>
						<view class="eachs-right">
							<view class="number">x1</view>
							<view class="money">￥1.50</view>
						</view>
					</view>
					<view class="eachs">
						<view class="eachs-left">
							<image src="../../../static/img/doc.png" mode=""></image>
							<view class="eachs-left-text">
								<view class="name">专业英语复习资料…</view>
								<view class="describe">20191030-Weprint客户端</view>
								<view class="specification">
									<text>1页</text>
									<text>黑白</text>
									<text>单面</text>
								</view>
							</view>
						</view>
						<view class="eachs-right">
							<view class="number">x1</view>
							<view class="money">￥1.50</view>
						</view>
					</view>
				</view>
				<view class="item-bottom">
					<view class="describe">
						<view class="">2个文档</view>
						<view class="total">合计 <text>￥2.00</text></view>
					</view>
			
				</view>
			
			</view>
			<view class="btnsplace">
				<view class="btns">
					全部
				</view>
				</view>
		</view>
		<view class="btn-class-red">确认</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navlist: [{
						name: "待付款",
						state_type: true,
						number: 2,
						img: "../../../static/img/payment.png",
						img_sel: "../../../static/img/payment-sel.png"
					},
					{
						name: "待取件",
						state_type: false,
						img: "../../../static/img/collect.png",
						img_sel: "../../../static/img/collect-sel.png"
					},
					{
						name: "已完成",
						state_type: false,
						img: "../../../static/img/accomplish.png",
						img_sel: "../../../static/img/accomplish-sel.png"
					},
					{
						name: "已退款",
						state_type: false,
						number: 2,
						img: "../../../static/img/delete.png",
						img_sel: "../../../static/img/delete-sel.png"
					}
				], //导航数据
			};
		},
		methods: {
			//点击切换分类
			navBtn(index) {
				//切换分类
				for (let [i, item] of this.navlist.entries()) {
					if (i == index) {
						item.state_type = true
					} else {
						item.state_type = false
					}
				}
			},
			//跳转再次打印
			btnAgain(){
				uni.navigateTo({
					url:'../printingOptions/printingOptions'
				})
			},
			//跳转详情
			btnDetails(){
				uni.navigateTo({
					url:'../orderFormDetails/orderFormDetails'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>


	.list {
		.list-item {

			width: 670upx;
			margin: 0 auto;
			box-sizing: border-box;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
			border-radius: 20upx;
			padding-top: 20upx;
			padding-bottom: 1upx;
			margin-top: 38upx;

			.item-state {
			width:36upx;
			height:36upx;
			margin-left: 24upx;
			background:rgba(255,255,255,1);
			border:2upx solid rgba(201,196,196,1);
			border-radius:50%;
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
							margin-right: 24upx;
						}

						.eachs-left-text {
							.name {
								font-size: 24upx;
								font-weight: 200;
								color: rgba(34, 34, 34, 1);

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
	.btnsplace{
		display: flex;
		justify-content: flex-end;
		box-sizing: border-box;
		padding-top: 52upx;
		padding-right: 64upx;
	
	.btns{
		width:132upx;
		height:40upx;
		background:rgba(255,255,255,1);
		border:2upx solid rgba(253,35,22,1);
		opacity:1;
		border-radius:20upx;
		font-size:28upx;
		text-align: center;
		font-weight:200;
		line-height:40upx;
		color:rgba(255,34,41,1);
	}
	}
	.btn-class-red{
		position: fixed;
		bottom:0;
		width: 100%;
	}
</style>
