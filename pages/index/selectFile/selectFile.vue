<template>
	<view><web-view :src="src" @message="getMessage" /></view>
</template>

<script>
import { h5Url } from '@/common/api/http';
export default {
	onLoad(e) {
		this.type = e.type;
		if (e.type === 'preview') {
			this.src = `${h5Url}/preview.html?url=${e.url}`;
		} else {
			this.src = `${h5Url}/select_file.html?token=${
				this.token
			}&type=${this.type}&orderNo=${e.orderNo}`;
		}
	},
	data() {
		return {
			h5Url,
			src: '',
			type: '',
			token: uni.getStorageSync('token')
		};
	},
	onShow() {},
	methods: {
		getMessage() {}
	}
};
</script>

<style></style>
