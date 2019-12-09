<template>
	<view>
		<view class="" v-if="codeType == 1">
			<image :src="info" mode="" class="code-img"></image>
			<view class="share-hint">我的共享码</view>
			<view class="share-hint">朋友能享受我的折扣</view>
			<view class="describe">
				<view class="describe-top">
					<text>*</text>
					<text>共享特权制度</text>
				</view>
				<view class="describe-title">学士</view>
				<view class="describe-text">
					学士及以上等级可使用邀请码、二维码或微信邀请方式邀请新用户。
				</view>
				<view class="describe-title">硕士</view>
				<view class="describe-text">
					新用户首次消费后双方同时获得邀请福利：新用户获取5元萌新代金券；老用户获取5元代金券直接放入钱包，且额外可获取5积分
				</view>
				<view class="describe-title">博士</view>
				<view class="describe-text">
					博士可被最多50名伙伴关注，可获取伙伴所获积分的50%，同时可让伙伴共享本等级打印折扣；博士可自主关注唯一账号（硕士及以上等级），博士所获积分的50%划分提交至被关注人（消费所获积分直接划分50%至被关注人，获取的关注者积分再划分50%至被关注人），同时可共享被关注人等级的打印状态
				</view>
				<view class="describe-title">博士后</view>
				<view class="describe-text">
					博士后可被最多50名伙伴关注，可获取伙伴所获积分的50%，同时可让伙伴共享本等级打印折扣
				</view>
				<view class="describe-hint">
					注：广联关系不可超过3级（例：若C关注B，B关注A,则C不可被关注）
				</view>
			</view>
			<button
				open-type="share"
				class="btn-class-red"
				data-url="pages/mine/login/login"
				data-type="1"
			>
				立即邀请微信好友
			</button>
		</view>
		<view class="" v-if="codeType == 2">
			<image :src="info" mode="" class="code-img"></image>

			<view class="share-text">
				<text>我的奖励</text>
				<text>获得粉丝得到积分的50%</text>
				<text>我的贡献</text>
				<text>粉丝享受我的打折折扣</text>
			</view>

			<button
				open-type="share"
				class="btn-class-red"
				data-url="/pages/mine/login/login"
				data-type="2"
			>
				立即邀请微信好友
			</button>
		</view>
		<view class="" v-if="codeType == 3">
			<image :src="info" mode="" class="code-img"></image>

			<view class="share-text">
				<text>我的奖励</text>
				<text>使用偶像的印象打印折扣</text>
				<text>我的贡献</text>
				<text>我的积分的50%自动转到偶像账户</text>
			</view>
			<button open-type="share" class="btn-class-red">立即邀请微信好友</button>
		</view>
	</view>
</template>

<script>
import { userInviteCode, intervalPoster } from '@/common/api/mine.js';
export default {
	data() {
		return {
			codeType: 2,
			info: '',
			shareInfo: ''
		};
	},
	onLoad(e) {
		this.codeType = e.codeType;
		console.log(this.codeType);
		switch (this.codeType) {
			case '1':
				uni.setNavigationBarTitle({
					title: '邀请好友'
				});
				break;
			case '2':
				uni.setNavigationBarTitle({
					title: '邀请粉丝'
				});
				break;

			case '3':
				uni.setNavigationBarTitle({
					title: '邀请偶像'
				});
				break;
		}
		// this.getuserInviteCode(this.codeType);
		if (this.codeType == 2) {
			this.getShare(this.codeType, 'pages/mine/interval/interval');
		} else if (this.codeType == 3) {
			this.getShare(this.codeType, 'pages/mine/interval/interval');
		} else if (this.codeType == 1) {
			this.getShare(this.codeType, 'pages/mine/interval/interval');
		}
	},
	methods: {
		// //获取邀请码  1：新用户  2粉丝  3偶像
		async getuserInviteCode(type, url) {
			try {
				const result = await userInviteCode({
					type: type,
					page: url,
					invite_id: ''
				});
				console.log(result);
				this.info = `data:image/png;base64,${result.info}`;
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		// 1：新用户  2粉丝  3偶像
		async getShare(type, url) {
			console.log(url);
			try {
				const result = await intervalPoster({
					type: type,
					page: url
				});
				this.shareInfo = result.posterInfo;
				this.getuserInviteCode(type, url);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		//去分享
		onShareAppMessage: function(e) {
			console.log(e);
			let that = this;
			return {
				title: that.shareInfo.name, // 默认是小程序的名称(可以写slogan等)
				path: `/pages/mine/interval/interval?user_id=${
					that.shareInfo.user_id
				}&codeType=${that.codeType}&name=${that.shareInfo.name}&discount=${
					that.shareInfo.discount
				}`, // 默认是当前页面，必须是以‘/’开头的完整路径
				imageUrl: that.shareInfo.pic_url //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.interval {
	height: 256upx;
	background: rgba(253, 35, 22, 1);
	opacity: 1;
	padding-left: 60upx;
	padding-right: 30upx;
	padding-top: 60upx;
	box-sizing: border-box;
	display: flex;
	justify-content: flex-start;
	.interval_logo {
		width: 84upx;
		height: 88upx;
		opacity: 1;
		margin-right: 42upx;
	}
	.interval-code {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24upx;
		width: 506upx;
		.code {
			font-size: 36upx;
			font-family: Lantinghei SC;
			font-weight: 600;
			line-height: 36upx;
			color: rgba(249, 249, 249, 1);
			opacity: 1;
		}
		.share {
			font-size: 26upx;
			font-family: Lantinghei SC;
			font-weight: 600;
			line-height: 36upx;
			color: rgba(249, 249, 249, 1);
			opacity: 1;
		}
	}
	.member {
		width: 506upx;
		font-size: 22upx;
		font-family: Lantinghei SC;
		font-weight: 600;
		line-height: 36upx;
		color: rgba(249, 249, 249, 1);
		opacity: 1;
		display: flex;
		justify-content: space-between;
	}
}
.code-img {
	width: 348upx;
	height: 348upx;
	display: block;
	margin: 0 auto;
	margin-bottom: 14upx;
	margin-top: 94upx;
}

.share-hint {
	text-align: center;
	font-size: 20upx;
	font-weight: 200;
	line-height: 32upx;
	color: rgba(51, 51, 51, 1);
}

.describe {
	padding-left: 76upx;
	padding-right: 54upx;
	padding-bottom: 110upx;
	box-sizing: border-box;

	.describe-top {
		display: flex;
		align-items: center;

		text {
			color: #fd2316;
			font-size: 60upx;

			&:nth-of-type(1) {
				margin-top: 10upx;
			}

			&:nth-of-type(2) {
				margin-left: 5upx;
				font-size: 20upx;
				font-weight: 200;
				color: rgba(51, 51, 51, 1);
			}
		}
	}

	.describe-title {
		font-size: 28upx;
		font-family: Lantinghei SC;
		font-weight: 200;
		line-height: 32upx;
		color: rgba(44, 41, 40, 1);
	}

	.describe-text {
		font-size: 20upx;
		font-weight: 200;
		line-height: 32upx;
		color: rgba(67, 67, 67, 1);
		margin-bottom: 16upx;
	}

	.describe-hint {
		padding-right: 20upx;
		font-size: 20upx;
		font-weight: 200;
		line-height: 32upx;
		color: rgba(51, 51, 51, 1);
	}
}

.btn-class-red {
	position: fixed;
	bottom: 0;
}

.share-text {
	margin-top: 130upx;

	text {
		display: block;
		text-align: center;
		font-size: 30upx;
		font-weight: 600;
		line-height: 60upx;
		color: rgba(15, 12, 11, 1);
	}
}
</style>
