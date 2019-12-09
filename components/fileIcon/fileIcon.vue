<template>
	<view class="file-icon">{{ type | formatType }}</view>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			default: 'PDF'
		}
	},
	data() {
		return {};
	},
	methods: {},
	filters: {
		formatType(type) {
			if (type) {
				return type.substring(type.lastIndexOf('.') + 1).toUpperCase();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.file-icon {
	width: 67upx;
	height: 86upx;
	background: url(../../static/img/file_bg.png) no-repeat;
	background-size: 100% 100%;
	text-align: center;
	color: #fd2316;
	line-height: 135upx;
	font-size: 22upx;
	font-weight: bold;
	margin-right: 16upx;
}
</style>
