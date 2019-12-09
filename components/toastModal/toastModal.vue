<template>
	<view class="toast-modal">{{text}}</view>
</template>

<script>
export default {
	props: {
		text: {
			type: String,
			default: ''
		}
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.toast-modal {
	position: fixed;
	top: 270upx;
	left: 50%;
	margin-left: -335upx;
	z-index: 200;
	width: 670upx;
	height: 364upx;
	box-shadow: 0 6upx 12upx rgba(208, 118, 118, 0.16);
	background-color: rgba(55, 53, 52, 0.54);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20upx;
	font-size: 36upx;
	color: #fff;
}
</style>
