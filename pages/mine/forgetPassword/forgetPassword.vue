<template>
	<view>
		<view class="input-item">
			<view class="item-label">手机号</view>
			<input
				type="number"
				value=""
				v-model="phone"
				placeholder="请输入手机号"
				placeholder-style="placeholders"
			/>
		</view>

		<view class="input-item">
			<view class="item-label">验证码</view>
			<input
				type="number"
				value=""
				placeholder-style="placeholders"
				v-model="codeVal"
			/>
			<view
				class="item-btn"
				@click="queryUserGetCode"
				:class="codeType ? '' : 'code-time-class'"
			>
				{{ codeText }}
			</view>
		</view>

		<view class="btn-class-red" @click="btnChangPad">确认</view>
	</view>
</template>

<script>
import {
	userGetCode,
	userForgetPwdCode,
	userForgetPwdSub,
	firstPwdSub
} from '@/common/api/mine.js';
export default {
	data() {
		return {
			phone: '',
			codeType: false,
			codeText: '获取验证码',
			codeVal: '',
			rescodeVal: '',
			forgetPwdType: 1
		};
	},
	onLoad(e) {
		//获取上个页面的传值 1：第一次设置密码  2：忘记密码
		if (e.forgetPwdType) {
			this.forgetPwdType = e.forgetPwdType;
		}
	},
	methods: {
		async queryUserGetCode() {
			try {
				if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.phone)) {
					this.showMessage('手机号输入有误');
					return;
				}
				//判断是否获取验证码中，如果是那禁止点击
				if (this.codeType) {
					return false;
				}
				//忘记密码
				if (this.forgetPwdType == 2) {
					await userForgetPwdCode({
						mobile: this.phone
					});
				} else {
					//第一次设置密码
					await userGetCode({
						phone: this.phone
					});
				}
				let times = 60; //验证码重新发送需要多少秒
				let codeTiem = setInterval(() => {
					if (times <= 1) {
						this.codeType = false;
						this.codeText = '获取验证码';
						clearInterval(codeTiem);
						return;
					}
					this.codeType = true;
					this.codeText = times + 's';
					times--;
				}, 1000);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		async btnChangPad() {
			if (!this.codeVal) {
				this.showMessage('验证码不能为空');
				return;
			}
			if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.phone)) {
				this.showMessage('手机号输入有误');
				return;
			}
			try {
				const param = {
					mobile: this.phone,
					code: this.codeVal
				};
				let result = '';
				let url = `../changePassword/changePassword?passwordType=2&codeVal=${
					this.codeVal
				}&phone=${this.phone}`;
				if (Number(this.forgetPwdType) === 2) {
					result = await userForgetPwdSub(param);
					url = url + '&forgetPwdType=2';
				} else {
					result = await firstPwdSub(param);
				}
				console.log(result);
				if (result) {
					uni.navigateTo({
						url
					});
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.input-item {
	display: flex;
	align-items: center;
	padding-right: 70upx;
	width: 100%;
	box-sizing: border-box;

	justify-content: space-between;
	margin-top: 60upx;

	&:nth-of-type(1) {
		margin-top: 72upx;
	}

	&:nth-of-type(2) {
		margin-bottom: 68upx;
		justify-content: space-between;
		input {
			width: 278upx;
		}

		.item-btn {
			width: 204upx;
			height: 82upx;
			background: rgba(204, 204, 204, 1);
			border: 2upx solid rgba(112, 112, 112, 1);
			opacity: 1;
			text-align: center;
			font-size: 28upx;
			font-weight: 200;
			line-height: 82upx;
			color: rgba(249, 249, 249, 1);
		}
	}

	.item-label {
		font-size: 32upx;
		font-weight: 600;
		color: rgba(39, 36, 35, 1);
		box-sizing: border-box;
		padding-left: 70upx;
	}

	input {
		font-size: 28upx;
		width: 500upx;
		height: 82upx;
		text-align: center;
		background: rgba(255, 255, 255, 1);
		border: 2upx solid rgba(112, 112, 112, 1);
		opacity: 1;
	}
}

.btn-class-red {
	width: 610upx;
	border-radius: 30upx;
	margin: 0 auto;
}

.placeholders {
	font-size: 26upx;
	font-weight: 400;
	color: rgba(177, 177, 177, 1);
}
.code-time-class {
	background: rgba(253, 35, 22, 1) !important;
	border: rgba(253, 35, 22, 1) !important;
}
</style>
