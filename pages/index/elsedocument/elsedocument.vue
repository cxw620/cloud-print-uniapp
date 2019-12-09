<template>
	<view><image :src="imageUrl" mode="widthFix" class="else-image" /></view>
</template>

<script>
import { helpsGethelp } from '@/common/api/index.js';
export default {
	data() {
		return {
			imageUrl: ''
		};
	},
	onLoad(e) {
		this.gethelpsGethelp(e);
	},
	methods: {
		async gethelpsGethelp(e) {
			try {
				const result = await helpsGethelp({ page_type: e.type });
				this.imageUrl = result.list.date.path;
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.else-image {
	width: 100%;
}
</style>
