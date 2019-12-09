<template>
	<view>
		<!-- 设置或修改支付密码 -->
		<view class="input-item" v-if="passwordType === 1">
			<view class="item-label">旧密码</view>
			<input
				type="number"
				value=""
				placeholder="请输入旧密码"
				v-model="oldpwd"
				:password="true"
				maxlength="6"
				placeholder-style="placeholders"
			/>
		</view>
		<view class="input-item">
			<view class="item-label">新密码</view>
			<input
				type="number"
				value=""
				placeholder="请输入6位纯数字"
				:password="true"
				maxlength="6"
				v-model="onepwd"
			/>
		</view>
		<view class="input-item">
			<view class="item-label">确认密码</view>
			<input
				type="number"
				value=""
				placeholder="请再次输入新密码"
				:password="true"
				maxlength="6"
				v-model="twopwd"
			/>
		</view>
		<view class="forget" v-if="passwordType === 1" @click="forgetPwdBtn">
			忘记密码？
		</view>
		<view class="btn-class-red" @click="queryUserSetPwd">确认</view>
		<ToastModal :text="text" v-if="toastModalType"></ToastModal>
	</view>
</template>

<script>
import { userSetPwd, userEditPwd, userForgetPwd } from '@/common/api/mine.js';
import { isNumber } from '@/common/js/utils.js';

export default {
	data() {
		return {
			passwordType: 1,
			codeVal: '',
			onepwd: '',
			twopwd: '',
			phone: '',
			oldpwd: '',
			toastModalType: false,
			text: '密码设置成功',
			forgetPwdType: 1
		};
	},
	onLoad(e) {
		this.passwordType = Number(e.passwordType);
		this.forgetPwdType = Number(e.forgetPwdType);
		this.codeVal = e.codeVal;
		this.phone = e.phone;
	},
	methods: {
		//点击忘记密码
		forgetPwdBtn() {
			uni.redirectTo({
				url: '../forgetPassword/forgetPassword?forgetPwdType=2'
			});
		},
		// 设置密码
		async queryUserSetPwd() {
			try {
				if (this.passwordType === 1) {
					if (this.oldpwd.length !== 6) {
						this.showMessage('请输入6位密码');
						return;
					}
				}

				if (!isNumber(this.onepwd)) {
					this.showMessage('请输入六位数字');
					return;
				}
				if (this.onepwd !== this.twopwd) {
					this.showMessage('两次支付密码输入不一致');
					return;
				}

				let post = {
					onepwd: this.onepwd,
					twopwd: this.twopwd
				};
				if (this.passwordType === 1) {
					// 修改密码 （知道旧密码）
					post.oldpwd = this.oldpwd;
					const result = await userEditPwd(post);
					if (result == '修改成功') {
						this.text = result;
						this.toastModalType = true;
						setTimeout(() => {
							this.toastModalType = false;
							uni.switchTab({
								url: '../../tabbar/mine/mine'
							});
						}, 2000);
					}
				} else {
					// 修改密码 （不知道旧密码或第一次添加）

					post.phone = this.phone;
					post.code = this.codeVal;
					if (this.forgetPwdType === 2) {
						//不知道旧密码
						const result = await userForgetPwd(post);
						if (result === '修改成功') {
							this.text = result;
							this.toastModalType = true;
							setTimeout(() => {
								this.toastModalType = false;
								uni.switchTab({
									url: '../../tabbar/mine/mine'
								});
							}, 2000);
						}
					} else {
						const result = await userSetPwd(post);
						if (result === '设置密码成功') {
							this.text = result;
							this.toastModalType = true;
							setTimeout(() => {
								this.toastModalType = false;
								uni.switchTab({
									url: '../../tabbar/mine/mine'
								});
							}, 2000);
						}
					}
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

	justify-content: space-between;
	margin-top: 60upx;

	&:nth-of-type(1) {
		margin-top: 72upx;
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
		width: 428upx;
		height: 82upx;
		text-align: center;
		background: rgba(255, 255, 255, 1);
		border: 2upx solid rgba(112, 112, 112, 1);
		opacity: 1;
	}
}

.forget {
	text-align: right;
	font-size: 24upx;
	font-weight: 200;
	color: rgba(253, 35, 22, 1);
	padding-right: 70upx;
	margin-top: 24upx;
	margin-bottom: 84upx;
}

.btn-class-red {
	width: 610upx;
	border-radius: 30upx;
	margin: 0 auto;
	margin-top: 60upx;
}

.placeholders {
	font-size: 26upx;
	font-weight: 400;
	color: rgba(177, 177, 177, 1);
}
</style>
