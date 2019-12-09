<template>
	<view>
		<view class="card" v-for="item in list" :key="item.printer_id">
			<device :isList="true" :info="item" />
		</view>
	</view>
</template>

<script>
import Device from '@/components/device/device.vue';
import { getMachineList } from '@/common/api/device';

export default {
	components: { Device },
	data() {
		return {
			list: []
		};
	},
	onLoad(option) {},
	onShow() {
		this.getDevices();
	},
	methods: {
		async getDevices() {
			try {
				const res = await getMachineList({
					coordinate: `${uni.getStorageSync('latitude')},
					${uni.getStorageSync('longitude')}`,
					page: 1,
					per_page: 20,
					type: 1
				});
				if (res.length) {
					this.list = res;
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.card {
	width: 670upx;
	height: 290upx;
	box-shadow: 0 6upx 12upx rgba(208, 118, 118, 0.16);
	border-radius: 20upx;
	margin: 42upx auto;
	display: flex;
	align-items: center;
}
</style>
