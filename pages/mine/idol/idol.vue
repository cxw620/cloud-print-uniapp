<template>
	<view class="mine">
		<!-- 有我的偶像 -->
		<view class="mine-header" v-if="idolType">
			<!-- 个人头像名称 -->
			<view class="header-top">
				<view class="" style="display: flex;align-items: center;">
					<image :src="date.avatarUrl" mode="" class="logo"></image>
					<view class="info">
						<view class="info-name">{{ date.nickName }}</view>
					</view>
				</view>
				<view class="header-btn" @click="delIdol">解除绑定</view>
			</view>
			<!-- 等级详情 -->
			<view class="header-grade">
				<view class="grade-top">
					<view class="grade-top-left">
						<text>{{ date.name }}</text>
					</view>
					<view class="grade-top-right">
						<text>共享特权</text>
						<text>{{ date.equity }}折</text>
					</view>
				</view>

				<view class="details">
					<view class="details-name">{{ date.nickName }}</view>
					<view class="details-cont">是您关注的偶像</view>
					<view class="details-cont">
						您可以共享其
						<text>{{ date.equity }}折</text>
						优惠特权，
					</view>
					<view class="details-cont">
						同事，将自己增加积分的
						<text>50%</text>
						赠送给偶像。
					</view>
				</view>
			</view>
		</view>
		<!-- 没有偶像 -->
		<view class="idol-header" v-else>
			<image src="../../../static/img/meiyourenwuyouguan.png" mode=""></image>
			<text>您还没有偶像 请邀请偶像</text>
			<view class="btn-class-red" @click="addInvite">发送邀请</view>
		</view>
		<view class="remark">
			<view class="remark-title">*</view>
			<view class="remark-text">
				您可以自由关注唯一账号(等级须高于自己)为偶像，
			</view>
			<view class="remark-text">你可以享受其折扣优惠特权，</view>
			<view class="remark-text">同时，您的增加积分的50%将自动赠送给偶像。</view>
			<view class="remark-text">您可以自由关注或解除绑定。</view>
			<view class="remark-text">若您解除绑定，已赠送积分不会被退还。</view>
			<view class='remark-text'>{{potion}}</view>
		</view>
		<confirm-modal :text="text" title="解除绑定" v-if="confirmModal" @clickRight="btnConfirm" @clickLeft='btnCloseModal'></confirm-modal>
	</view>
</template>

<script>
	import mrhardTabbar from '@/components/mrhard-tabbar/mrhard-tabbar.vue';
	import confirmModal from '@/components/confirmModal/confirmModal.vue';
	import {
		userMyIdol,
		userDelIdol
	} from '@/common/api/mine.js';
	export default {
		components: {
			mrhardTabbar,
			confirmModal
		},
		data() {
			return {
				widths: '60',
				idolType: true,
				date: {},
				text: '',
				confirmModal: false,
				potion: ''
			};
		},
		onLoad(options) {
			this.getuserMyIdol();


			uni.setStorageSync('options_id', options.id)
			uni.setStorageSync('type', options.type)




		},
		methods: {
			//点击邀请（没有偶像）
			addInvite() {
				uni.navigateTo({
					url: '../sharePrivilege/sharePrivilege?codeType=3'
				});
			},
			//点击取消
			btnCloseModal() {
				this.confirmModal = false;
			},
			//点击确认
			btnConfirm() {
				this.queryuserDelIdol();
				
			},
			//解除绑定事件
			delIdol() {
				this.text =
					'您将不能使用' + this.date.nickName + '的折扣您确定要解除绑定吗？';
				this.confirmModal = true;
			},
			// 获取偶像信息
			async getuserMyIdol() {
				try {
					const result = await userMyIdol({});
					console.log(result);
					if (result.info.type == 10) {
						this.date = result.info.date;

					} else {
						this.idolType = false;
					}
				} catch (e) {
					this.showMessage(e.msg);
				}
			},
			//我的偶像解除绑定
			async queryuserDelIdol() {
				try {
					const result = await userDelIdol({
						dealer_id: this.date.user_id
					});
					this.confirmModal = false;
					this.getuserMyIdol();
				} catch (e) {
					this.showMessage(e.msg);
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.mine-header {
		background: #fd2316;
		box-sizing: border-box;
		padding-top: 15upx;
		height: 250upx;

		.header-top {
			display: flex;
			justify-content: space-between;
			padding-left: 48upx;
			align-items: center;
			margin-bottom: 28upx;

			.header-btn {
				width: 112upx;
				height: 32upx;
				border: 2upx solid rgba(34, 34, 34, 1);
				border-radius: 6upx;
				font-size: 18upx;
				font-weight: 200;
				line-height: 32upx;
				color: rgba(34, 34, 34, 1);
				text-align: center;
				margin-right: 56upx;
			}
		}

		.logo {
			width: 130upx;
			height: 130upx;
			margin-right: 28upx;
		}

		.info {
			.info-name {
				font-size: 36upx;
				font-family: Lantinghei SC;
				font-weight: 600;
				line-height: 36upx;
				color: rgba(255, 255, 255, 1);
				opacity: 1;
			}

			.info-btn {
				width: 112upx;
				height: 32upx;
				border: 2upx solid rgba(34, 34, 34, 1);
				opacity: 1;
				border-radius: 6upx;
				font-size: 18upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
				opacity: 1;
				display: flex;
				justify-content: center;
				margin-top: 6upx;
				align-items: center;

				.iconxiaoyuhao-copy {
					font-size: 24upx;
				}
			}
		}

		.header-grade {
			width: 670upx;
			height: 352upx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
			opacity: 1;
			border-radius: 20upx;
			margin: 0 auto;

			.grade-top {
				height: 80upx;
				background: linear-gradient(170deg,
					rgba(15, 12, 11, 1) 0%,
					rgba(60, 58, 57, 1) 59%,
					rgba(47, 7, 7, 1) 100%);
				box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
				opacity: 1;
				border-top-right-radius: 20upx;
				border-top-left-radius: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 35upx;
				box-sizing: border-box;

				.grade-top-left {
					display: flex;

					align-items: center;

					text {
						font-size: 28upx;
						font-weight: 600;
						color: rgba(255, 255, 255, 1);

						&:nth-of-type(2) {
							font-size: 24upx;
							margin-left: 6upx;
							font-weight: 200;
							color: rgba(253, 35, 22, 1);
						}
					}
				}

				.grade-top-right {
					display: flex;

					align-items: center;

					text {
						font-size: 24upx;
						font-weight: 200;
						color: rgba(196, 154, 87, 1);

						&:nth-of-type(2) {
							margin-left: 20upx;
							font-size: 28upx;
							font-weight: 600;
							color: rgba(255, 255, 255, 1);
						}
					}
				}
			}

			.details {
				box-sizing: border-box;
				padding-top: 28upx;
				padding-left: 38upx;

				.details-name {
					font-size: 24upx;
					font-weight: 600;
					line-height: 40upx;
					color: rgba(253, 35, 22, 1);
				}

				.details-cont {
					font-size: 24upx;
					font-family: Lantinghei SC;
					font-weight: 600;
					line-height: 48upx;
					color: rgba(73, 73, 73, 1);
					opacity: 1;

					text {
						color: #fd2316;
					}
				}
			}
		}
	}

	.idol-header {
		width: 100%;

		image {
			width: 373upx;
			height: 372upx;
			display: block;
			margin: 0 auto;
			margin-top: 180upx;
			margin-bottom: 52upx;
		}

		text {
			display: block;
			width: 100%;
			text-align: center;
			font-size: 26upx;
			font-weight: 400;
			color: rgba(69, 69, 69, 1);
		}
	}

	.remark {
		position: fixed;
		bottom: 148upx;
		padding-left: 76upx;

		.remark-title {
			font-size: 60upx;
			font-weight: 600;
			line-height: 30upx;
			color: rgba(253, 35, 22, 1);
		}

		.remark-text {
			font-size: 20upx;
			font-weight: 200;
			line-height: 40upx;
			color: rgba(34, 34, 34, 1);
		}
	}

	.btn-class-red {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 33;
	}
</style>
