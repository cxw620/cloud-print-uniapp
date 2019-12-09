<template>
	<view class="mine">
		<view class="mine-header">
			<!-- 个人头像名称 -->
			<view class="header-top">
				<view class="header-top-left">
					<image :src="memberShipVal.avatarUrl" mode="" class="logo"
					></image>
					<view class="info"><view class="info-name">{{memberShipVal.nickName?memberShipVal.nickName:'登陆'}}</view></view>
				</view>
			</view>
			<!-- 等级详情 -->
			<view class="header-grade">
				<view class="grade-top">
					<view class="grade-top-left">
						<text>{{ memberShipVal.greade_name }}</text>
					</view>
					<view class="grade-top-right">
						<text>等级特权</text>
						<text>{{ memberShipVal.discount }}折</text>
					</view>
				</view>
				<!-- 等级进度 -->
				<view class="grade-slider">
					<view class="slider-bak"></view>
					<view class="slider-bak-number">
						{{ memberShipVal.expend_money }}
					</view>
					<view class="slider-gone" :style="{ width: widths + '%' }">
						<view class="gone-icon-cont">
							<view class="gone-icon"></view>
							<view class="gone-number">{{ memberShipVal.point }}</view>
						</view>
					</view>
				</view>
				<!-- 等级积分期限 -->
				<view class="grade-integral">
					<view class="grade-integral-left">
						<view class="grade-integral-text">距离保级积分</view>
						<view class="grade-integral-text">
							{{ memberShipVal.relegation_integral }}
						</view>
					</view>
					<view class="grade-integral-broder"></view>
					<view class="grade-integral-right">
						<view class="grade-integral-text">当前等级有效期</view>
						<view class="grade-integral-text">
							{{ memberShipVal.expire_time }}
						</view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="list-item">
					<text>等级</text>
					<text>积分</text>
					<text>折扣</text>
				</view>
				<view class="list-item">
					<text>萌新</text>
					<text>0-9</text>
					<text>无</text>
				</view>
				<view class="list-item">
					<text>学士</text>
					<text>10-499</text>
					<text>9折</text>
				</view>
				<view class="list-item">
					<text>硕士</text>
					<text>500-4999</text>
					<text>8折</text>
				</view>
				<view class="list-item">
					<text>博士</text>
					<text>5000-49999</text>
					<text>7折</text>
				</view>
				<view class="list-item">
					<text>博士后</text>
					<text>50000-</text>
					<text>6折</text>
				</view>
			</view>
			<view class="member-hint">
				<view class="title">
					<text>*</text>
					<text>保级制度</text>
				</view>
				<view class="member-text">
					<text>
						会员等级有效期为一年（365天），若用户升级，新等级有效期从升级当天开始计算。
					</text>
					<text>
						若没有在当前有效期内升级，新等级有效期在次日开始计算，并变更为新等级（即根据积分获取情况保级或掉级）。
					</text>
					<text>硕士：当前有效期内累计通过消费获取200积分保级</text>
					<text>博士：当前有效期内累计通过消费获取500积分保级</text>
					<text>博士后：当前有效期内累计通过消费获取800积分保级</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { userMyGreade } from '@/common/api/mine.js';
export default {
	data() {
		return {
			widths: '60',
			registerType: false,
			memberShipVal: {} //接口返回数据
		};
	},
	onLoad() {
		//获取当前积分，当前等级
		this.getuserMyGreade();
	},
	methods: {
		//获取当前积分，当前等级
		async getuserMyGreade() {
			try {
				const result = await userMyGreade();
				console.log(result);
				this.memberShipVal = result.info;
				this.widths =
					(Number(result.info.point) / Number(result.info.expend_money)) * 100>100?100:(Number(result.info.point) / Number(result.info.expend_money)) * 100;
				console.log(this.widths);
				console.log(this.memberShipVal);
			} catch (e) {
				this.showMessage(e.msg);
			}
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
		margin-bottom: 28upx;
		.header-top-left {
			display: flex;
			align-items: center;
		}
	}

	.logo {
		width: 130upx;
		height: 130upx;
		margin-right: 28upx;
	}
	.message {
		width: 48upx;
		height: 49upx;
		margin-right: 66upx;
	}
	.info {
		.info-name {
			font-size: 36upx;
			font-family: Lantinghei SC;
			font-weight: 600;
			line-height: 36upx;
			color: rgba(255, 255, 255, 1);
			opacity: 1;
		}

		.info-btn {
			width: 112upx;
			height: 32upx;
			border: 2upx solid rgba(34, 34, 34, 1);
			opacity: 1;
			border-radius: 6upx;
			font-size: 18upx;
			font-weight: 200;
			color: rgba(34, 34, 34, 1);
			opacity: 1;
			display: flex;
			justify-content: center;
			margin-top: 6upx;
			align-items: center;

			.iconxiaoyuhao-copy {
				font-size: 24upx;
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

				text {
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
					display: block;
					font-size: 24upx;
					font-weight: 200;
					color: rgba(255, 255, 255, 1);
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
						width: 58upx;
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

.mine-residue {
	width: 670upx;
	height: 152upx;
	margin: 0 auto;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	border-radius: 20upx;
	margin-top: 30upx;
	display: flex;
	justify-content: center;
	align-items: center;

	.grade-residue-item {
		flex: 1;

		.title {
			font-size: 24upx;
			font-weight: 600;
			color: rgba(73, 73, 73, 1);
			text-align: center;
		}

		.cont {
			height: 78upx;
			border-right: 2upx solid rgba(240, 240, 240, 1);
			text-align: center;
			line-height: 78upx;
			font-size: 32upx;
			font-weight: 200;
			color: rgba(253, 35, 22, 1);
		}

		&:nth-of-type(3) {
			.cont {
				border: 0px;
			}
		}
	}
}
.list {
	width: 670upx;
	margin: 0 auto;
	margin-top: 52upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
	border-radius: 20upx;
	.list-item {
		height: 88upx;
		border-bottom: 1px solid rgba(240, 240, 240, 1);
		display: flex;
		align-items: center;
		text {
			font-size: 24upx;
			font-weight: 200;
			color: rgba(73, 73, 73, 1);
			height: 100%;
			text-align: center;
			line-height: 88upx;
			display: block;
			width: 154upx;
			border-right: 1px solid rgba(240, 240, 240, 1);
			&:nth-of-type(3) {
				border: none;
			}
			&:nth-of-type(2) {
				width: 326upx;
			}
		}
		&:nth-of-type(1) {
			text {
				font-weight: 600;
			}
		}
	}
}
.member-hint {
	margin-top: 40upx;
	padding-left: 76upx;
	padding-right: 54upx;
	box-sizing: border-box;
	.title {
		display: flex;
		align-items: center;
		text {
			display: block;
			&:nth-of-type(1) {
				font-size: 60upx;
				line-height: 32upx;
				font-weight: 600;
				color: rgba(253, 35, 22, 1);
				margin-top: 10upx;
			}
			&:nth-of-type(2) {
				font-size: 20upx;
				font-weight: 200;
				color: rgba(51, 51, 51, 1);
				margin-left: 14upx;
			}
		}
	}
	.member-text {
		text {
			display: block;

			font-size: 20upx;
			font-weight: 200;
			line-height: 32upx;
			color: rgba(51, 51, 51, 1);
			opacity: 1;
		}
	}
}
</style>
