<template>
	<view class="" v-if='hidden==2'>


		<view class="mask" catchtouchmove="preventTouchMove"></view>
		<view class="view-modal">
			<view class="modal-text input-text">
				<image src="/static/img/smiling.png" mode="" class='smiling' v-if='isUsre==1'></image>
				<image src="/static/img/crying.png" mode="" class='smiling' v-if='isUsre==2'></image>
			</view>

			<view class="modal-text-input">
				{{isUsre==1?'绑定成功':'绑定失败'}}
			</view>
			<view class="input-btn" @click="clickClose">确定</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {

			};
		},
		props: {
			title: {
				type: String,
				default: '绑定支付宝'
			},
			confrimType: {
				type: Number,
				default: 1
			},

			hidden: {
				type: Number,
				default: 0
			},
			isUsre: {
				type: String,
				default: ''
			}

		},

		methods: {

			clickClose() {

				this.$emit('close')

			},

		}
	};
</script>
<style lang="scss" scoped>
	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		z-index: 9000;
		opacity: 0.7;
	}


	.view-modal {
		position: absolute;
		top: 208upx;
		z-index: 201;
		min-height: 352upx;
		width: 100%;
		background-color: #fff;
		text-align: center;
		z-index: 9999;

		.modal-text {

			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: #0f0c0b;

			.smiling {
				width: 60px;
				height: 60px;
				display: inline-block;
				margin-top: 20px;
			}
		}

		.input-btn {
			width: 202upx;
			height: 66upx;
			background: rgba(253, 35, 22, 1);
			border: 1px solid rgba(253, 35, 22, 1);
			font-size: 26upx;
			font-weight: 200;
			line-height: 66upx;
			color: rgba(255, 255, 255, 1);
			text-align: center;
			margin: 20px auto 0;
			margin-bottom: 40upx;
		}

		.input-text {
			height: 180upx;
		}

		.modal-text-input {
			padding-left: 94upx;
			padding-right: 72upx;
			box-sizing: border-box;
			margin-top: 10px;

			.input-item {
				display: flex;
				align-items: center;
				margin-bottom: 36upx;

				.item-left {
					font-size: 26upx;
					font-weight: 200;
					text-align: left;
					color: rgba(15, 12, 11, 1);
					margin-bottom: 22upx;
				}

				.item-input {
					width: 410upx;
					margin-left: 10upx;
					height: 66upx;
					background: rgba(255, 255, 255, 1);
					border: 1px solid rgba(183, 183, 183, 1);
				}

				&:nth-of-type(2) {
					display: block;

					.item-input {
						width: 100%;
						margin-left: 0;

						.item-left {
							margin-bottom: 0;
						}
					}
				}
			}
		}

		.modal-btn {
			display: flex;
			justify-content: center;

			&>view {
				width: 202upx;
				height: 66upx;
				border: 1upx solid #fd2316;
				font-size: 26upx;
				line-height: 66upx;
				margin: 0 42upx;

				&:nth-child(1) {
					color: #0f0c0b;
				}

				&:nth-child(2) {
					background-color: #fd2316;
					color: #fff;
				}
			}
		}
	}
</style>
