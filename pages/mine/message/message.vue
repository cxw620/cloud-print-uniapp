<template>
	<view>
		<view
			class="message-item"
			@click="btn(item)"
			v-for="(item, index) in list"
			:key="index"
		>
			<view class="item-left">
				<image src="../../../static/img/copybg.png" mode=""></image>
				<view class="left-text">
					<text>{{ item.message_title }}</text>
					<text>{{ item.content }}</text>
				</view>
			</view>
			<view class="item-right">{{ item.create_time }}</view>
		</view>
	</view>
</template>

<script>
import { NewsNewsList } from '@/common/api/mine.js';
export default {
	data() {
		return {
			page: 1,
			list: []
		};
	},
	onLoad() {},
	onShow() {
		this.page = 1;
		this.getNewsNewsList();
	},
	methods: {
		/* 滚动到底加载 */
		onReachBottom() {
			this.page = this.page + 1;
			this.getNewsNewsList();
		},
		/* 消息列表 */
		async getNewsNewsList() {
			try {
				const result = await NewsNewsList({ page: this.page, per_page: 10 });
				console.log(result);
				if (Number(this.page) === 1) {
					this.list = result.list.data;
				} else {
					this.list = this.list.concat(result.list.data);
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		btn(item) {
			console.log(item.message_id)
			uni.navigateTo({
				url: '../messageDetails/messageDetails?message_id=' + item.message_id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.message-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	padding-left: 20upx;
	border-radius: 20upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	margin: 0 auto;
	margin-top: 30upx;
	width: 670upx;
	height: 110upx;
	.item-left {
		display: flex;
		align-items: center;
		image {
			display: block;
			width: 60upx;
			height: 56upx;
		}
		.left-text {
			margin-left: 30upx;
			text {
				font-size: 24upx;
				color: #222;
				display: block;
			}
		}
	}
	.item-right {
		color: #979797;
		font-size: 16upx;
		padding-right: 20upx;
	}
}
</style>
