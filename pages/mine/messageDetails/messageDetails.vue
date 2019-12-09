<template>
	<view>
		<view class="details-cont">
			<view class="cont-time">{{messageObj.create_time}}</view>
			<text>
			{{messageObj.content}}
			</text>
		</view>
	</view>
</template>
<script>
import { newsNewsDetail, newsReadToNews } from '@/common/api/mine.js';
export default {
	data() {
		return {
			message_id: '',
			messageObj:{}
		};
	},
	onLoad(e) {
		//获取消息id
		this.message_id = e.message_id;
		this.getnewsNewsDetail();
		this.querynewsReadToNews();
	},
	methods: {
		/* 更改消息为已读 */
		async querynewsReadToNews() {
			try {
				const result = await newsReadToNews({
					message_id: this.message_id
				});
				console.log(result);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		/* 消息详情 */
		async getnewsNewsDetail() {
			try {
				const result = await newsNewsDetail({
					message_id: this.message_id
				});
				
				console.log(result);
				this.messageObj=result.data
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.details-cont {
	width: 670upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 20upx;
	padding-bottom: 40upx;
	padding-top: 20upx;
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	margin: 0 auto;
	margin-top: 20upx;
	.cont-time {
		width: 222upx;
		height: 48upx;
		text-align: center;
		line-height: 48upx;
		background: #f8f8f8;
		font-size: 16upx;
		color: #606060;
		margin: 0 auto;
		margin-bottom: 30upx;
	}
	text {
		display: block;
		color: #222;
		line-height: 1.5;
		font-size: 22upx;
		padding-left: 60upx;
		padding-right: 60upx;
	}
}
</style>
