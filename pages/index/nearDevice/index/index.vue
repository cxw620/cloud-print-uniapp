<template>
	<view class="device-map">
		<view class="top-card">
			<map
				class="map"
				:latitude="latitude"
				:longitude="longitude"
				scale="13"
				show-location
				:markers="covers"
				:polyline="polyline"
				@callouttap="callouTtap"
				@markertap="markerTap"
			></map>
		</view>
		<view class="bottom-card">
			<view class="top" @click="goList()">
				<view><image src="../../../../static/img/logo.png" /></view>
				<view>查看附近详情 ></view>
			</view>
			<device :info="cover" />
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
			qqmapsdk: null,
			latitude: '',
			longitude: '',
			covers: [],
			cover: {},
			choosed: {},
			polyline: []
		};
	},
	onLoad() {},

	onShow() {
		this.getLocation();
	},

	methods: {
		async getDevices() {
			try {
				const res = await getMachineList({
					coordinate: `${this.latitude},${this.longitude}`,
					page: 1,
					per_page: 20,
					type: 1
				});
				if (res.length) {
					this.cover = res[0];
					for (let el of res.values()) {
						el.id = el.printer_id;
						el.title = el.printer_name;
						el.iconPath = '/static/img/map_logo.png';
						el.width = 20;
						el.height = 20;
						el.label = {
							content: el.printer_name,
							color: '#000',
							fontSize: 12
						};
					}
					this.covers = res;
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},

		goList(device) {
			uni.navigateTo({
				url: '../list/list'
			});
		},

		/* 获取当前位置 */
		getLocation() {
			uni.getLocation({
				type: 'wgs84',
				success: res => {
					this.latitude = res.latitude;
					this.longitude = res.longitude;
					try {
						uni.setStorageSync('latitude', res.latitude);
						uni.setStorageSync('longitude', res.longitude);
					} catch (e) {
						console.log(e);
					}
					this.getDevices();
				}
			});
		},

		/* 视野发生变化时触发 */
		regionChange(e) {
			console.log(e);
		},

		/* 点击标记时触发 */
		markerTap(e) {
			this.cover = this.covers.find(value => {
				return value.printer_id === e.mp.markerId;
			});
		},

		/* 点击标记对应 */
		callouTtap(e) {
			console.log(e);
		}
	}
};
</script>

<style lang="scss" scoped>
.device-map {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100vh;
}

.top-card {
	flex: 1;
	.map {
		width: 100%;
		height: 100%;
	}
}

.bottom-card {
	width: 100%;
	height: 438upx;

	.top {
		display: flex;
		justify-content: space-between;
		color: #0f0c0b;
		font-size: 36upx;
		height: 130upx;
		align-items: center;
		padding: 0 38upx;
		border-bottom: 1px solid #e2e1e1;
		margin-bottom: 30upx;

		image {
			width: 70upx;
			height: 84upx;
		}
	}
}
</style>
