<template>
	<view class="login">
		<view><image src="../../../static/img/logo.png" /></view>
		<view>
			<button
				type="primary"
				openType="getUserInfo"
				lang="zh_CN"
				@getuserinfo="getUserInfo"
			>
				微信一键登陆
			</button>
		</view>
	</view>
</template>

<script>
import { userLogin } from '@/common/api/mine.js';

export default {
	data() {
		return {
			codeType: null
		};
	},
	onLoad(options) {
		console.log('-----------------')
		console.log(options);
			console.log('-----------------')
		// 4:代金卷
		if (options.codeType) {
			this.codeType = options.codeType;
		}
		// uni.setStorageSync('options_id', options.id);
		// uni.setStorageSync('type', options.type);
		// uni.setStorageSync('coupon_id', options.coupon);
		// uni.setStorageSync('price', options.price);
		// uni.setStorageSync('endTime', options.endTime);
		// uni.setStorageSync('giveTime', options.giveTime);
	},
	methods: {
		getUserInfo(e) {
			if (e.detail.errMsg === 'getUserInfo:ok') {
				uni.login({
					provider: 'weixin',
					success: res => {
						if (res.errMsg === 'login:ok') {
							this.login({
								code: res.code,
								user_info: e.detail.rawData,
								encrypted_data: e.detail.encryptedData,
								iv: e.detail.iv,
								signature: e.detail.signature,
								referee_id: wx.getStorageSync('refereeId')
							});
						}
					}
				});
			}
		},

		async login(data) {
			try {
				const result = await userLogin(data);
				uni.setStorageSync('token', result.token);
				uni.setStorageSync('user_id', result.user_id);
				uni.setStorageSync('is_new', result.is_new);
				if (this.codeType) {
					uni.reLaunch({
						url: `/pages/mine/interval/interval?codeType=${this.codeType}`
					});
				} else {
					uni.switchTab({
						url: '../../tabbar/index/index'
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
.login {
	& > view {
		&:nth-child(1) {
			text-align: center;
			padding-top: 200upx;
			margin-bottom: 200upx;

			image {
				width: 120upx;
				height: 120upx;
			}
		}

		&:nth-child(2) {
			padding: 0 50upx;
		}
	}
}
</style>
