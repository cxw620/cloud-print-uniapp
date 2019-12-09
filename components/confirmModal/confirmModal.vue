<template>
	<view class="">
		<view>
			<view class="confrim-modal" catchtouchmove="true">
				<view class="view-modal">
					<view class="modal-text">
						<view>{{ title }}</view>
						<view v-if="text">{{ text }}</view>
						<view v-if="textTwo">{{ textTwo }}</view>
					</view>
					<view class="modal-btn" v-if="!isTip">
						<view @click="clickLeft">{{ leftText }}</view>
						<view @click="clickRight">{{ rightText }}</view>
					</view>
					<view class="tip-btn" v-else @click="clickTip">我知道了</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '您确认删除吗？'
		},
		confrimType: {
			type: Number,
			default: 1
		},
		isTip: {
			type: Boolean,
			default: false
		},
		text: {
			type: String,
			default: ''
		},
		textTwo: {
			type: String,
			default: ''
		},
		leftText: {
			type: String,
			default: '取消'
		},
		rightText: {
			type: String,
			default: '确定'
		}
	},
	data() {
		return {
			alipay: {
				accountVal: '',
				orderVal: ''
			}
		};
	},
	methods: {
		clickTip() {
			this.$emit('clickTip');
		},

		clickRight() {
			this.$emit('clickRight');
			// if(this.confrimType===2){
			// 	this.$emit('clickRight',this.alipay);
			// }else{

			// }
		},
		clickLeft() {
			this.$emit('clickLeft');
		}
	}
};
</script>
<style lang="scss" scoped>
.confrim-modal {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	background-color: rgba(15, 12, 11, 0.67);
	z-index: 200;
	display: flex;
	align-items: flex-start;
	padding-top: 208upx;
	box-sizing: border-box;
}

.view-modal {
	// position: absolute;
	// top: 208upx;
	// z-index: 201;
	min-height: 352upx;
	width: 100%;
	background-color: #fff;
	text-align: center;

	.modal-text {
		height: 235upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: #0f0c0b;
		& > view {
			&:nth-child(1) {
				font-size: 40upx;
				font-weight: bold;
			}
			&:nth-child(2) {
				font-size: 26upx;
				margin-top: 30upx;
			}
			&:nth-child(3) {
				font-size: 26upx;
			}
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
		margin: 0 auto;
		margin-bottom: 40upx;
	}
	.input-text {
		height: 180upx;
	}
	.modal-text-input {
		padding-left: 94upx;
		padding-right: 72upx;
		box-sizing: border-box;
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
		& > view {
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

	.tip-btn {
		width: 202upx;
		height: 66upx;
		border: 1upx solid #fd2316;
		font-size: 26upx;
		line-height: 66upx;
		background-color: #fd2316;
		color: #fff;
		margin: 0 auto;
	}
}
</style>
