<template>
	<view class="mine">
		<view class="mine-header">
			<view class="header-top">
				<view class="header-top-left">
					<view class="title">历史积分</view>
					<text>{{ info.points }}</text>
				</view>
				<view class="header-top-right">
					<view class="title">剩余可兑换积分</view>
					<text>{{ info.point }}</text>
				</view>
			</view>
			<!-- 等级详情 -->
			<view class="header-grade">
				<view class="grade-top">
					<view class="grade-top-left">
						<text>{{ info.greade_name }}</text>
						<text>/{{ info.discount }}折</text>
					</view>
					<view class="grade-top-right">
						<text>共享特权</text>
						<text>{{ info.discount }}折</text>
					</view>
				</view>
				<!-- 等级进度 -->
				<view class="grade-slider">
					<view class="slider-bak"></view>
					<view class="slider-bak-number">{{ info.expend_money }}</view>
					<view class="slider-gone" :style="{ width: widths + '%' }">
						<view class="gone-icon-cont">
							<view class="gone-icon"></view>
							<view class="gone-number">{{ info.point }}</view>
						</view>
					</view>
				</view>
				<!-- 等级积分期限 -->
				<view class="grade-integral">
					<view class="grade-integral-left">
						<view class="grade-integral-text">距离保级积分</view>
						<view class="grade-integral-text">
							{{ info.relegation_integral }}
						</view>
					</view>
					<view class="grade-integral-broder"></view>
					<view class="grade-integral-right">
						<view class="grade-integral-text">当前等级有效期</view>
						<view class="grade-integral-text">{{ info.expire_time }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 当月积分 -->
		<view class="theintegral" v-if="cartogram">
			<view class="theintegral-title">当月积分</view>
			<view class="theintegral-cont">
				<view class="theintegral-canvasRing">
					<canvas
						canvas-id="canvasRing"
						id="canvasRing"
						class="charts"
						:width="cWidth * pixelRatio"
						:height="cHeight * pixelRatio"
						:style="{ width: cWidth + 'px', height: cHeight + 'px' }"
						@touchstart="touchPie($event, 'canvasRing')"
					></canvas>
				</view>
				<view class="theintegral-right">
					<view class="theintegral-message-item">
						<view class="item-li"></view>
						<text>消费积分</text>
						<text>{{ Number(ptint) === 0 ? 0 : Number(ptint) }}</text>
					</view>
					<view class="theintegral-message-item">
						<view class="item-li" style="background: #0E9DDD;"></view>
						<text>粉丝积分</text>
						<text>{{ Number(link) === 0 ? 0 : Number(link) }}</text>
					</view>
					<view class="theintegral-message-item">
						<view class="item-li" style="background: #FF6200;"></view>
						<text>邀请积分</text>
						<text>{{ Number(invite) === 0 ? 0 : Number(invite) }}</text>
					</view>
					<view class="sumTo">
						<text>当月总计</text>
						<text>{{ invite + link + ptint }}</text>
					</view>
				</view>
			</view>
		</view>
		<view
			class="theintegral-list"
			:class="cartogram ? '' : 'theintegral-class'"
		>
			<view class="theintegral-list-title">积分记录</view>
			<view
				class="theintegral-list-item"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="item-left">
					<text>{{ item.time }}</text>
					<text>{{ item.describe }}</text>
				</view>
				<view
					class="item-right"
					:style="{
						color:
							Number(item.point_type) === 30
								? '#FF0E00'
								: Number(item.point_type) === 21
								? '#0E9DDD'
								: '#FAB700'
					}"
				>
					{{ item.point_symbol }}{{ item.value }}
				</view>
			</view>
		</view>

		<view class="btn-class-red" @click="btnAdvance">积分兑换</view>
	</view>
</template>

<script>
import { userMyGreade, userPointRecord } from '@/common/api/mine.js';
import { baiduGetDocumentList } from '@/common/api/index.js';
import uCharts from '@/components/u-charts/u-charts.js';
var _self;
var canvaRing = null;

export default {
	data() {
		return {
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			serverData: '',
			cartogram: true,
			widths: '50',
			info: {},
			list: [],
			ptint: '',
			invite: '',
			link: '',
			Ring: {
				series: [
					{
						area: [82, 245, 134, 256],
						color: '#FF6200',
						data: 0,
						index: 0,
						legendShape: 'circle',
						name: '当前积分',
						pointShape: 'circle',
						show: true,
						type: 'ring'
					},
					{
						area: [82, 245, 134, 256],
						color: '#FAB700',
						data: 0,
						index: 0,
						legendShape: 'circle',
						name: '粉丝积分',
						pointShape: 'circle',
						show: true,
						type: 'ring'
					},
					{
						area: [82, 245, 134, 256],
						color: '#0E9DDD',
						data: 0,
						index: 0,
						legendShape: 'circle',
						name: '邀请积分',
						pointShape: 'circle',
						show: true
					}
				]
			}
		};
	},
	onLoad() {
		/* 环形统计图 */
		_self = this;
		this.cWidth = uni.upx2px(250);
		this.cHeight = uni.upx2px(250);
		this.showRing('canvasRing', this.Ring);
		//获取当前积分，当前等级
		this.getuserMyGreade();
		//积分明细
		this.getuserPointRecord();
	},
	methods: {
		//积分明细
		async getuserPointRecord() {
			try {
				const result = await userPointRecord({});
				console.log(result);
				result.info.invite = 0;
				result.info.link = 80;
				result.info.ptint = 0;
				let tol = result.info.invite + result.info.link + result.info.ptint;
				console.log(tol);
				if (Number(tol) === 0) {
					this.cartogram = false;
				} else {
					console.log(tol);
					this.cartogram = true;
					let inviteNumber = (Number(result.info.invite) / Number(tol)) * 100;
					console.log(inviteNumber);
					let linkNumber = (Number(result.info.link) / Number(tol)) * 100;
					let ptintNumber = (Number(result.info.ptint) / Number(tol)) * 100;
					console.log(inviteNumber, linkNumber, ptintNumber);
					// ptint:消费   link：粉丝   invite：邀请
					this.Ring.series[0].data = inviteNumber;
					this.Ring.series[1].data = ptintNumber;
					this.Ring.series[2].data = linkNumber;
					this.invite = result.info.invite;
					this.link = result.info.link;
					this.ptint = result.info.ptint;
				}

				this.list = result.info.detail.data;
				console.log(this.list);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		//获取当前积分，当前等级
		async getuserMyGreade() {
			try {
				const result = await userMyGreade();
				console.log(result);
				let point =
					Number(result.info.point) / Number(result.info.expend_money)*100;
					console.log(point)
				this.widths = point < 1 ? 1 : point>100?100:point;
				this.info = result.info;
			} catch (e) {
				this.showMessage(e.msg);
				//TODO handle the exception
			}
		},
		showRing(canvasId, chartData) {
			canvaRing = new uCharts({
				$this: _self,
				canvasId: canvasId,
				type: 'ring',
				legend: true,
				extra: {
					pie: {
						offsetAngle: -45,
						ringWidth: 10 * _self.pixelRatio,
						labelWidth: 10
					}
				},
				background: '#FFFFFF',
				pixelRatio: _self.pixelRatio,
				series: chartData.series,
				animation: true,
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio,
				disablePieStroke: true,
				dataPointShape: false,
				legend: {
					show: false
				},
				dataLabel: false,
				show: false
			});
		},

		changeData() {
			canvaColumn.updateData({
				series: _self.serverData.ColumnB.series,
				categories: _self.serverData.ColumnB.categories
			});
		},
		//跳转到积分兑换
		btnAdvance() {
			uni.navigateTo({
				url: '../../mine/integralConversion/integralConversion'
			});

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
		box-sizing: border-box;
		padding-right: 108upx;
		margin-bottom: 10upx;

		.header-top-left {
			.title {
				margin-bottom: 12upx;
				font-size: 24upx;
				font-weight: 200;
				color: rgba(255, 255, 255, 1);
			}

			text {
				font-size: 80upx;
				font-weight: 200;
				color: rgba(255, 255, 255, 1);
			}
		}

		.header-top-right {
			.title {
				margin-bottom: 12upx;
				font-size: 24upx;
				font-weight: 200;
				color: rgba(255, 255, 255, 1);
			}

			text {
				font-size: 40upx;
				font-weight: 200;
				color: rgba(255, 255, 255, 1);
			}
		}
	}

	.header-grade {
		width: 670upx;

		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
		opacity: 1;
		border-radius: 20upx;
		margin: 0 auto;

		.grade-top {
			height: 80upx;
			background: linear-gradient(
				170deg,
				rgba(15, 12, 11, 1) 0%,
				rgba(60, 58, 57, 1) 59%,
				rgba(47, 7, 7, 1) 100%
			);
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
				height: 100%;
				text {
					display: block;
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

		.grade-slider {
			position: relative;

			.slider-bak {
				width: 100%;
				height: 12upx;
				background: rgba(206, 206, 206, 1);
				opacity: 1;
			}

			.slider-bak-number {
				width: 100%;
				text-align: right;
				box-sizing: border-box;
				margin-bottom: 20upx;
				padding-right: 20upx;

				font-size: 18upx;
				font-weight: 200;
				color: rgba(73, 73, 73, 1);
			}

			.slider-gone {
				position: absolute;
				left: 0;
				top: 0;

				height: 13upx;
				background: #ff343e;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				opacity: 1;

				.gone-icon-cont {
					position: relative;

					.gone-icon {
						width: 22upx;
						height: 22upx;
						position: absolute;
						right: -2upx;
						top: -13upx;
						border: 1px solid rgba(206, 206, 206, 1);
						background: #fff;
						border-radius: 50%;
					}

					.gone-number {
						position: absolute;
						left: -37upx;
						top: 15upx;
					padding: 0 5upx;
						height: 20upx;
						line-height: 20upx;
						background: rgba(255, 52, 62, 1);
						opacity: 1;
						display: block;
						text-align: center;
						border-radius: 6upx;
						font-size: 14upx;
						font-weight: 200;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}

		.grade-integral {
			border-top: 1px solid rgba(226, 225, 225, 1);

			display: flex;
			height: 72upx;
			position: relative;
			align-items: center;
			justify-content: space-between;

			.grade-integral-left {
				width: 50%;
				text-align: center;

				font-weight: 200;

				color: rgba(73, 73, 73, 1);
				opacity: 1;

				.grade-integral-text {
					font-size: 16upx;
				}
			}

			.grade-integral-broder {
				.grade-integral-text {
					font-size: 16upx;
					margin: 4upx 0;
				}

				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				height: 50upx;
				width: 1px;
				background: rgba(240, 240, 240, 1);
			}

			.grade-integral-right {
				width: 50%;
				text-align: center;
				font-size: 16upx;
				font-weight: 200;
				color: rgba(73, 73, 73, 1);
				opacity: 1;
			}
		}
	}
}

.theintegral {
	width: 670upx;
	height: 282upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	border-radius: 20upx;
	margin: 0 auto;
	margin-top: 160upx;

	.theintegral-title {
		padding-left: 28upx;
		padding-top: 10upx;
		box-sizing: border-box;
		font-size: 24upx;
		font-weight: 600;
		color: rgba(34, 34, 34, 1);
	}

	.theintegral-cont {
		padding-left: 30upx;
		display: flex;
		justify-content: space-between;

		.theintegral-right {
			width: 302upx;

			.theintegral-message-item {
				&:nth-of-type(3) {
					border-bottom: 2upx solid rgba(226, 225, 225, 1);
					padding-bottom: 10upx;
				}

				display: flex;
				align-items: center;
				line-height: 48upx;

				.item-li {
					width: 22upx;
					height: 22upx;
					background: rgba(250, 183, 0, 1);
					border-radius: 50%;
					margin-right: 16upx;
				}

				text {
					font-size: 24upx;
					font-weight: 200;
					color: rgba(34, 34, 34, 1);
					padding-right: 26upx;
				}
			}

			.sumTo {
				display: flex;
				padding-top: 18upx;
				justify-content: center;
				padding-right: 60upx;

				text {
					font-size: 24upx;
					font-weight: 600;
					margin-left: 10upx;
					margin-right: 10upx;
					color: rgba(34, 34, 34, 1);
				}
			}
		}
	}
}

.theintegral-list {
	width: 670upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	margin: 0 auto;
	margin-top: 28upx;
	margin-bottom: 150upx;
	border-radius: 20upx;

	.theintegral-list-title {
		padding-left: 28upx;
		font-size: 24upx;
		height: 60upx;
		line-height: 60upx;
		font-weight: 600;
		color: rgba(34, 34, 34, 1);
	}

	.theintegral-list-item {
		display: flex;
		border-top: 1px solid rgba(226, 225, 225, 1);
		height: 70upx;
		line-height: 70upx;
		align-items: center;
		padding-right: 46upx;
		box-sizing: border-box;
		justify-content: space-between;

		.item-left {
			padding-left: 28upx;
			display: flex;
			align-items: center;
			text {
				font-size: 24upx;
				font-weight: 200;
				color: rgba(34, 34, 34, 1);
				display: block;
				&:nth-of-type(1) {
					margin-right: 40upx;
				}
				&:nth-of-type(2){
				
					overflow: hidden;
					text-overflow:ellipsis;
					white-space:nowrap;
					width:260upx;
					height: 100%;
				}
				
				
			}
		}

		.item-right {
			font-size: 24upx;
			font-weight: 200;
			color: rgba(250, 183, 0, 1);
		}
	}
}

.btn-class-red {
	position: fixed;
	bottom: 0;

	left: 0;
	height: 110upx;
}
.theintegral-class {
	margin-top: 168upx;
}
</style>
