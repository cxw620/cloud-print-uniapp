<template>
	<view class="selector-item">
		<view class="left-item">
			<view :class="['iconfont', tab.icon, 'left-icon']"></view>
			<view class="item-text">
				<text>{{ tab.title }}</text>
				<text>{{ tab.desc }}</text>
			</view>
		</view>
		<view class="iconfont iconxiaoyuhao-copy right-icon"></view>
	</view>
</template>

<script>
export default {
	props: {
		tab: {
			tyepe: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.selector-item {
	width: 670upx;
	height: 154upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	border-radius: 20upx;
	padding: 0 40upx 0 50upx;
	box-sizing: border-box;
	display: flex;
	margin: 0 auto;
	margin-bottom: 26upx;
	align-items: center;
	justify-content: space-between;

	.left-item {
		display: flex;

		align-items: center;
	}

	.right-icon {
		font-size: 30upx;
		color: rgba(151, 151, 151, 1);

		text-align: right;
	}
}

.left-icon {
	font-size: 75upx;
	color: #fd2316;
	margin-right: 42upx;
}

.item-text {
	text {
		display: block;

		font-size: 28upx;
		font-weight: 600;
		color: rgba(34, 34, 34, 1);

		&:nth-of-type(2) {
			font-size: 20upx;
			font-weight: 200;
			color: rgba(151, 151, 151, 1);
		}
	}
}
</style>
