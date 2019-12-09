<template>
	<view>
		<view class=""  v-if="fansType">
			<view class="fans-item" v-for="(item, index) in dateList" :key="index">
				<view class="item-left">
					<view class="item-left-number">{{ index }}</view>
					<image :src="item.avatarUrl" mode=""></image>
					<view class="item-info">
						<view class="item-info-name">{{ item.nickName }}</view>
						<view class="item-info-cont">
							<text>等级/{{ item.name }}</text>
							<text>积分/{{ item.points }}</text>  
							<text>粉丝/{{ item.fun_num }}</text>
						</view>
						<view class="item-info-cont-integral ">
							赠送积分：{{ item.fun_points }}
						</view>
					</view>
				</view>
				<view class="item-right " @click="btnDelFan(item)">×</view>
			</view>
		</view>
		<view class="onfans" v-else>
			<image src="../../../static/img/meiyourenwuyouguan.png" mode=""></image>
			<text>您还没有粉丝 请邀请粉丝</text>
		</view>

		<view class="fans-bottom">
			<view class="remark">
				<view class="remark-title">*</view>
				<view class="">
					<view class="remark-text">
						您最多可以有50名粉丝，粉丝将共享您的折扣优惠特权，
					</view>
					<view class="remark-text">
						同时，每名粉丝的新增积分的50%将自动赠送给您。
					</view>
					<view class="remark-text">
						双方可以自由关注或解除绑定，已赠送积分不会被退还。
					</view>
				</view>
			</view>

			<view class="btn" @click="addFans">发送邀请</view>
		</view>
		<confirm-modal
			:text="text"
			title="解绑粉丝"
			v-if="confirmModal"
			@clickRight="btnConfirm"
			@clickLeft="btnCloseModal"
		></confirm-modal>
		
	</view>
</template>

<script>
import { userFanList,userDelFan } from '@/common/api/mine.js';
export default {
	data() {
		return {
			fansType: true, //是否有粉丝
			text: '',
			confirmModal: false,
			user_id: null,
			dateList:[]
		};
	},
	onLoad() {
		this.getuserFanList();
	},
	methods: {
		btnCloseModal() {
			this.confirmModal = false;
		},
		btnConfirm() {
			this.queryuserDelFan();
			this.confirmModal = false;
		},
		//删除粉丝
		btnDelFan(item) {
			console.log(item)
				this.text=item.nickName + '将不能使用' + '您的折扣确定要解绑绑定吗？';
			this.user_id = item.user_id;
			this.confirmModal = true;
		},
		//邀请粉丝
		addFans() {
			uni.navigateTo({
				url: '../sharePrivilege/sharePrivilege?codeType=2'
			});
		},
		//删除粉丝
		async queryuserDelFan() {
			try {
				const result = await userDelFan({
					user_id: this.user_id
				});
				console.log(result);
				this.showMessage('删除成功')
				this.getuserFanList();

			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		//获取粉丝列表
		async getuserFanList() {
			try {
				const result = await userFanList({});
				console.log(result);
				if (result.info.type == 10) {
					this.dateList = result.info.date;
				} else {
					this.fansType = false;
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.fans-item {
	display: flex;
	justify-content: space-between;
	width: 670upx;
	height: 120upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	margin: 0 auto;
	border-radius: 20upx;
	margin-bottom: 12upx;

	&:nth-of-type(1) {
		margin-top: 20upx;
	}

	.item-left {
		display: flex;
		align-items: center;

		.item-left-number {
			padding-left: 28upx;
			padding-right: 38upx;
			font-size: 28upx;
			font-weight: 200;
			color: rgba(151, 151, 151, 1);
		}

		image {
			width: 83upx;
			height: 83upx;
			margin-right: 15upx;
			border-radius: 50%;
		}

		.item-info {
			.item-info-name {
				font-size: 24upx;
				font-weight: 600;
				color: rgba(34, 34, 34, 1);
			}

			.item-info-cont {
				display: flex;
				font-size: 20upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);

				text {
					margin-right: 30upx;
				}
			}

			.item-info-cont-integral {
				font-size: 20upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
			}
		}
	}

	.item-right {
		color: #979797;
		font-size: 35upx;
		margin-top: 0upx;
		margin-right: 14upx;
	}
}

.fans-bottom {
	position: fixed;
	bottom: 0;
	width: 100%;
}

.remark {
	width: 100%;
	background: rgba(228, 228, 228, 1);
	display: flex;
	padding-top: 14upx;
	padding-left: 46upx;
	padding-bottom: 8upx;
	box-sizing: border-box;
	.remark-title {
		font-size: 60upx;
		font-weight: 600;
		line-height: 30upx;
		color: rgba(253, 35, 22, 1);
		margin-top: 10upx;
		margin-right: 20upx;
	}

	.remark-text {
		font-size: 16upx;
		font-weight: 200;
		line-height: 24upx;
		color: rgba(34, 34, 34, 1);
		opacity: 1;
	}
}

.btn {
	width: 100%;

	height: 110upx;
	background: rgba(253, 35, 22, 1);
	opacity: 1;
	line-height: 110upx;
	text-align: center;
	font-size: 28upx;
	font-weight: 200;
	color: rgba(255, 255, 255, 1);
}
.onfans {
	image {
		display: block;
		margin: 0 auto;
		width: 373upx;
		height: 372upx;
		margin-top: 194upx;
		margin-bottom: 46upx;
	}
	text {
		display: block;
		text-align: center;
		font-size: 26upx;
		font-weight: 400;
		color: rgba(69, 69, 69, 1);
	}
}
</style>
