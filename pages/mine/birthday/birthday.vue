<template>
	<view>
		<view class="not-birthday" v-if="birthdayType == 1">
			<view class="not-birthday-title">请选择您出生年月</view>
			<picker
				mode="date"
				:start="startDate"
				:end="endDate"
				@change="bindDateChange"
			>
				<view class="not-birthday-text">
					<text>{{ dateYear }}</text>
					<text>年</text>
					<text>{{ dateMonth }}</text>
					<text>月</text>
					<text>{{ dateDay }}</text>
					<text>日</text>
				</view>
			</picker>

			<view class="btn-class-red" @click="queryUserSetBirthday">确认</view>
			<view class="hint">
				<view class="hint-item">
					<text>硕士生日特权</text>
					<text>生日当天可领取生日礼包，礼包内含1元打印券一张</text>
				</view>
				<view class="hint-item">
					<text>博士生日特权</text>
					<text>生日当周可领取一次生日礼包，礼包内含1元、4元打印券一张</text>
				</view>
				<view class="hint-item">
					<text>博士后生日特权</text>
					<text>
						生日当月可领取一次生日礼包，礼包内含1元、4元、10元打印券一张
					</text>
				</view>
			</view>
		</view>
		<view
			class="yes-birthday"
			v-if="birthdayType == 5 || birthdayType == 4 "
		>
			<view class="yes-birthday-header"><text>祝您生日快乐！</text></view>
			<view
				class="yes-birthday-item"
				v-for="(item, index) in couponList"
				:key="index"
			>
				<image src="../../../static/img/logo.png" mode=""></image>
				<view class="yes-birthday-item-right">
					<view class="item-right-top">
						<view class="item-right-top-left">
							<text>{{ item.name }}</text>
							<text>￥{{ item.reduce_price }}</text>
						</view>
						<view class="item-right-top-right">
							<text>{{ birthdayType == 5 ? '未领取' : '已领取' }}</text>
						</view>
					</view>
					<view class="item-right-bottom">
						<view class="item-right-bottom-left">领取时间</view>
						<view class="item-right-bottom-right">
							{{ dates(item.start_time) }}-{{ dates(item.end_time) }}
						</view>
					</view>
				</view>
			</view>

			<view
				class="btn-class-red"
				:class="birthdayType == 5 ? '' : 'already'"
				@click="querycouponReceive"
			>
				{{ birthdayType == 5 ? '点击领取' : '已领取' }}
			</view>
		</view>

		<view class="yes-birthday" v-if="birthdayType == 7 || birthdayType == 6">
			<view class="yes-birthday-header">
				<text>生日已过，代金券已失效</text>
			</view>
			<view class="yes-birthday-lose">
			<image src="../../../static/img/shixiaoqia.png" mode=""></image>
			<text>已失效</text>
			</view>
		</view>

		<view class="distance" v-if="birthdayType == 3">
			<view class="distance-time">
				<text>{{ dateYear }}</text>
				<text>年</text>
				<text>{{ dateMonth }}</text>
				<text>月</text>
				<text>{{ dateDay }}</text>
				<text>日</text>
			</view>
			<view class="distance-day">
				<view class="day-left">距离您的生日</view>
				<view class="day-right">{{over_days}}天</view>
			</view>
			<view class="hint">
				<view class="hint-item">
					<text>硕士生日特权</text>
					<text>生日当天可领取生日礼包，礼包内含1元打印券一张</text>
				</view>
				<view class="hint-item">
					<text>博士生日特权</text>

					<text>生日当周可领取一次生日礼包，礼包内含1元、4元打印券一张</text>
				</view>
				<view class="hint-item">
					<text>博士后生日特权</text>
					<text>
						生日当月可领取一次生日礼包，礼包内含1元、4元、10元打印券一张
					</text>
				</view>
			</view>
		</view>
		<!--提示信息 -->
		<toast-modal text="领取成功" v-if="toastModal"></toast-modal>
	</view>
</template>

<script>
import {
	userBirthday,
	couponReceive,
	userSetBirthday
} from '@/common/api/mine.js';

export default {
	data() {
		return {
			birthdayType:null ,
			array: ['中国', '美国', '巴西', '日本'],
			index: 0,
			date: '', //选择日期时间（总）
			dateYear: '2000', //时间显示 年
			dateMonth: '01', //时间显示 月
			dateDay: '01', //时间显示 日
			ids: '', //领取生日礼品 id
			over_days: 0,
			couponList: '',
			toastModal: false
		};
	},
	onLoad() {
		this.getuserBirthday();
	},
	methods: {
		// 处理时间格式
		dates(time) {
			let date = new Date(time * 1000);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let nowDate = year + '年' + month + '月' + day + '日';
			return nowDate;
		},
		// 设置生日
		async queryUserSetBirthday() {
			try {
				let str = this.dateYear + '/' + this.dateMonth + '/' + this.dateDay;
				let date = new Date(str).getTime();
				const result = await userSetBirthday({
					birthday: date / 1000
				});
				this.showMessage('设置成功');
				setTimeout(()=>{
					uni.switchTab({
						url:'/pages/tabbar/mine/mine'
					},2000)
				})
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		//领取生日礼品
		async querycouponReceive() {
			try {
				// 已领取过
				if (this.birthdayType == 4) {
					return;
				}

				let idsArr = [];
				for (let item of this.couponList.values()) {
					console.log(item);
					idsArr.push(item.coupon_id);
				}
				console.log(idsArr.join(','));
				const result = await couponReceive({
					ids: idsArr.join(',')
				});
				console.log(result);
				if (result == '领取成功') {
					this.toastModal = true;
					setTimeout(() => {
						this.toastModal = false;
					}, 2000);
					this.birthdayType=4
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		//获取生日信息
		async getuserBirthday() {
			try {
				const result = await userBirthday({});
				console.log(result,'生日信息');

				switch (result.info.type) {
					case 1:
						//1：没有设置生日
						this.birthdayType = 1;
						break;
					case 2:
						//  2：当前等级没有生日礼品(在我的页面点击提示)

						break;
					case 3:
						//  3：生日未到
						this.birthdayType = 3;
						this.over_days = result.info.birthday.days;
						this.dateYear = result.info.birthday.year;
						this.dateMonth = result.info.birthday.month;
						this.dateDay = result.info.birthday.day;
						break;
					case 4:
						//  4：生日已到，已经领取
						this.birthdayType = 4;

						this.couponList = result.info.coupon;
						break;
					case 5:
						//  5：生日已到，没有领取；此时 coupon 下为代金券数据
						this.birthdayType = 5;
						this.couponList = result.info.coupon;

						break;
					case 6:
						//   6：生日已过，已经领取
						this.birthdayType = 6;
						this.couponList = result.info.coupon;
						break;
					case 7:
						//    7：生日已过，没有领取
						this.birthdayType = 7;
						this.couponList = result.info.coupon;
						break;
				}

			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		// 选择时间
		bindDateChange: function(e) {
			console.log(e);
			let dataArr = e.target.value.split('-');
			this.date = e.target.value;
			this.dateYear = dataArr[0];
			this.dateMonth = dataArr[1];
			this.dateDay = dataArr[2];
		}
	}
};
</script>

<style lang="scss" scoped>
.not-birthday {
	padding-top: 46upx;

	image {
		width: 50upx;
		height: 46upx;
		margin-left: 30upx;
		margin-bottom: 66upx;
	}

	.not-birthday-title {
		margin-left: 30upx;
		font-size: 26upx;
		font-weight: 200;
		color: rgba(15, 12, 11, 1);
		margin-bottom: 40upx;
	}

	.not-birthday-text {
		margin-left: 14upx;

		text {
			font-size: 28upx;
			font-weight: 600;
			color: rgba(15, 12, 11, 1);

			&:nth-of-type(odd) {
				margin-left: 16upx;
				margin-right: 16upx;
				padding: 6upx 24upx 6upx 24upx;
				background: rgba(249, 249, 249, 1);
				border: 2upx solid rgba(112, 112, 112, 1);
			}
		}
	}

	.btn-class-red {
		margin-top: 64upx;
	}
}

.yes-birthday {
	padding-bottom: 200upx;
	.yes-birthday-header {
		padding-top: 40upx;
		padding-bottom: 46upx;
		background: #fd2316;

		image {
			display: block;
			width: 50upx;
			height: 46upx;
			margin-left: 30upx;
		}

		text {
			display: block;
			margin-top: 52upx;
			font-size: 48upx;

			color: rgba(255, 255, 255, 1);

			text-align: center;
		}
	}
	.yes-birthday-item {
		box-sizing: border-box;
		padding-left: 66upx;
		padding-right: 72upx;
		padding-top: 92upx;

		display: flex;
		align-items: center;
		image {
			width: 85upx;
			height: 83upx;
			margin-right: 38upx;
		}
		.yes-birthday-item-right {
			width: 100%;

			.item-right-top {
				border-bottom: 2upx dashed rgba(173, 169, 169, 1);
				display: flex;
				justify-content: space-between;
				width: 100%;
				.item-right-top-left {
					text {
						display: block;
						font-size: 26upx;
						font-weight: 200;
						color: rgba(15, 12, 11, 1);
						&:nth-of-type(2) {
							margin-top: 10upx;
							font-size: 32upx;
							font-weight: 600;
							color: rgba(34, 34, 34, 1);
							margin-bottom: 8upx;
						}
					}
				}
				.item-right-top-right {
					text {
						font-size: 26upx;
						font-weight: 200;
						color: rgba(137, 135, 135, 1);
					}
				}
			}
			.item-right-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 10upx;
				font-size: 22upx;
				font-weight: 200;
				color: rgba(173, 169, 169, 1);
			}
		}
	}
	.btn-class-red {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
	}
}

.hint {
	box-sizing: border-box;
	padding-left: 80upx;
	padding-right: 70upx;
	margin-top: 54upx;

	.hint-item {
		margin-bottom: 40upx;
		text {
			display: block;
			&:nth-of-type(1) {
				font-size: 28upx;
				font-weight: 600;
				color: rgba(15, 12, 11, 1);
				margin-bottom: 10upx;
			}
			&:nth-of-type(2) {
				color: #0f0c0b;
				font-size: 26upx;
			}
		}
	}
}
.distance {
	padding-top: 72upx;
	.distance-time {
		display: flex;
		justify-content: center;
		text {
			display: block;
			margin-left: 20upx;
			margin-right: 20upx;

			font-size: 28upx;
			font-weight: 600;
			color: rgba(15, 12, 11, 1);
		}
	}
	.distance-day {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 38upx;
		padding-bottom: 28upx;
		border-bottom: 1px dashed #ada9a9;
		.day-left {
			font-size: 26upx;
			font-weight: 200;
			color: rgba(15, 12, 11, 1);
		}
		.day-right {
			font-size: 64upx;
			font-weight: 200;
			color: rgba(15, 12, 11, 1);
			margin-left: 36upx;
		}
	}
}
.already {
	background: rgba(173, 169, 169, 1);
}
.yes-birthday-lose{
	margin-top: 128upx;
	image{
		width: 303upx;
		height: 303upx;
		display: block;
		margin: 0 auto;

	}
	text{
		display: block;
		text-align: center;
		font-size:48upx;

		color:rgba(181,181,181,1);
	}
}
</style>
