<template>
	<view class="device-info" @click="openMap">
		<view class="left">
			<image v-if="!isList" src="/static/img/map_logo.png" />
			<image v-else src="/static/img/logo.png" />
		</view>
		<view class="right">
			<view>{{ info.printer_name }}</view>
			<view>
				<view>{{ info.distance }}m</view>
				<view>{{ info.address }}</view>
			</view>
			<view>
				<text
					v-for="(item, index) in info.attach"
					:key="item"
					:style="{ color: colors[index] }"
				>
					{{ item }}
				</text>
			</view>
			<view>{{ info.summary }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		isList: {
			type: Boolean,
			default: false
		},
		info: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			colors: ['#FD2316', '#FD2316', '#FF9422']
		};
	},
	methods: {
		openMap() {
			uni.openLocation({
				latitude: Number(this.info.latitude),
				longitude: Number(this.info.longitude),
				name: this.info.printer_name,
				address: this.info.address,
				success: res => {
					console.log(res);
				},
				fail: err => {
					console.log(err);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.device-info {
	min-height: 222upx;
	display: flex;
	align-items: center;

	.left image {
		width: 132upx;
		height: 132upx;
		margin: 0 48upx;
	}

	.right {
		& > view {
			&:nth-child(1) {
				color: #222222;
				font-size: 28upx;
				font-weight: bold;
			}
			&:nth-child(2) {
				display: flex;
				color: #979797;
				font-size: 22upx;
				height: 22upx;
				line-height: 22upx;
				margin-top: 20upx;
				margin-bottom: 20upx;
				& > view {
					&:nth-child(1) {
						border-right: 1upx solid #c7c7c7;
						padding-right: 20upx;
						box-sizing: border-box;
						margin-right: 20upx;
					}
					&:nth-child(2) {
						width: 260upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
			&:nth-child(3) {
				font-size: 20upx;
				text {
					border-width: 1upx;
					border-style: solid;
					border-radius: 10upx;
					margin-right: 12upx;
					display: inline-block;
					padding: 2upx 20upx;
				}
			}
			&:nth-child(4) {
				font-size: 22upx;
				color: #979797;
				margin-top: 15upx;
			}
		}
	}
}
</style>
