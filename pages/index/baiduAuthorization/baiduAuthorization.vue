<template>
	<view>
		<web-view  :src="srcs"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				srcs:''
			};
		},
		onLoad(e) {
			this.srcs=e.src
		},
	}
	
</script>

<style lang="scss">

</style>
