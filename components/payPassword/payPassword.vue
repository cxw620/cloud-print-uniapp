<template>
	<view class="pay-password" catchtouchmove="true">
		<view class="panel">
			<view>
				请输入支付密码
				<text @click="closeModal">x</text>
			</view>
			<view>
				<view v-for="item in 6" :key="item">
					{{ password[item] ? '*' : '' }}
				</view>
			</view>
			<view>
				<view @click="onNumber(item + 1)" v-for="item in 9" :key="item">
					{{ item + 1 }}
				</view>
				<view class="gray-bg"></view>
				<view @click="onNumber(0)">0</view>
				<view class="gray-bg" @click="delNumber">
					<image src="../../static/img/delete-pwd.png" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			password: ''
		};
	},
	methods: {
		closeModal() {
			this.password = '';
			this.$emit('closePassword');
		},

		onNumber(number) {
			this.password = (this.password + number).slice(0, 6);
			if (this.password.length === 6) {
				this.$emit('balancePay', this.password);
			}
		},

		delNumber() {
			this.password = this.password.slice(0, this.password.length - 1);
		}
	}
};
</script>

<style lang="scss" scoped>
.pay-password {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background-color: rgba(3, 3, 3, 0.51);
	display: flex;
	align-items: flex-end;
	z-index: 1000;
	.panel {
		width: 100%;
		height: 1000upx;
		background-color: #f9f9f9;
		position: relative;
		& > view {
			&:nth-child(1) {
				height: 108upx;
				line-height: 108upx;
				text-align: center;
				color: #454545;
				font-size: 36upx;
				font-weight: 600;
				border-bottom: 2upx solid #e3e3e3;
				text {
					position: absolute;
					right: 40upx;
				}
			}
			&:nth-child(2) {
				display: flex;
				width: 662upx;
				margin: 56upx auto 0;
				border: 2upx solid #ccc;
				& > view {
					width: 112upx;
					height: 96upx;
					line-height: 110upx;
					border-right: 2upx solid #ccc;
					background-color: #fff;
					text-align: center;
					color: #454545;
					font-weight: 600;
					font-size: 50upx;
					&:last-child {
						border-right-width: 0;
					}
				}
			}
			&:nth-child(3) {
				width: 100%;
				height: 448upx;
				position: absolute;
				bottom: 0;
				left: 0;
				background-color: #fff;
				display: flex;
				flex-wrap: wrap;
				& > view {
					width: 248upx;
					height: 112upx;
					text-align: center;
					line-height: 112upx;
					font-size: 52upx;
					font-weight: 600;
					color: #454545;
					border-top: 2upx solid #e8e8e8;
					border-right: 2upx solid #e8e8e8;
					&:active {
						background-color: #f0f0f0;
						opacity: 0.8;
					}

					image {
						width: 50upx;
						height: 32upx;
					}
				}

				.gray-bg {
					background-color: #e4e7ee;
				}
			}
		}
	}
}
</style>
