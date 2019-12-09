<template>
	<view>
		<view class="" v-if="authorization">
			<view class="input-class">
				<input type="text" value="" v-model="inputVal" />
				<image
					src="../../../../static/img/sousuo-3.png"
					mode=""
					@click.stop="queryBaiduSearch"
				></image>
				<view class=" btn" @click.stop="queryBaiduSearch">搜索</view>
			</view>

			<view class="list">
				<view
					class="list-item"
					v-for="(item, index) in list"
					:key="index"
					@click.stop="btnPitch(item)"
				>
					<view class="item-left">
						<file-icon :type="item.server_filename" />
						<view class="item-left-text">
							<text>{{ item.server_filename }}</text>
							<text>{{ dates(item.server_ctime) }}</text>
						</view>
					</view>
					<view class="item-right"><text v-if="item.pitchType"></text></view>
					<view class="btn-class-red" @click.stop="queryBaiduGetDetails">确定</view>
				</view>
			</view>
		</view>
		<view class="authorization" v-else>
			<image src="../../../../static/img/imgs.png" mode="aspectFill"></image>
			<button type="primary" open-type="contact" class="btn-class">
				立即绑定账号
			</button>
		</view>
	</view>
</template>

<script>
import {
	baiduGetDocumentList,
	baiduSearch,
	baiduGetDetails,
	baidudownloadFiles,
	zoomPrintFileUpload
} from '@/common/api/index.js';
import fileIcon from '@/components/fileIcon/fileIcon.vue';
export default {
	components: {
		fileIcon
	},
	data() {
		return {
			authorization: true,
			list: [],
			pitchIndex: 1,
			inputVal: '',
			page: 1,
			order_no: '',
			howMany: 0
		};
	},
	onLoad(option) {
		if (option.orderNo) {
			this.order_no = option.orderNo;
		}
	},
	onShow() {
		this.getBaiduGetDocumentList();
	},
	onLoad() {},
	onReachBottom() {
		this.page = this.page + 1;
		this.getBaiduGetDocumentList();
	},
	methods: {
		//选择文件
		btnPitch(item) {
			if (item.pitchType) {
				this.howMany = this.howMany - 1;
			} else {
				if (Number(this.howMany) > 1) {
					this.showMessage('文件最多选择1个');
					return;
				}
				this.howMany = this.howMany + 1;
			}
			item.pitchType = !item.pitchType;
		},
		// 处理时间格式
		dates(time) {
			let date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear() + '-';
			let M =
				(date.getMonth() + 1 < 10
					? '0' + (date.getMonth() + 1)
					: date.getMonth() + 1) + '-';
			let D = date.getDate() + ' ';
			let h = date.getHours() + ':';
			let m = date.getMinutes() + ':';
			let s = date.getSeconds();
			return Y + M + D + h + m + s;
		},
		//获取百度列表
		async getBaiduGetDocumentList() {
			try {
				const result = await baiduGetDocumentList({
					order: 'time',
					desc: 1,
					page_num: 10,
					page: this.page
				});
				
				//判断是否授权 1授权  -1没有授权
				if (result.type != 1) {
					this.authorization = false;
				} else {
					for (let val in result.list) {
						result.list[val].pitchType = false;
					}
					if (Number(this.page) === 1) {
						this.list = result.list;
					} else {
						this.list = this.list.concat(result.list);
					}
				}
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		//搜索
		async queryBaiduSearch() {
			try {
				const result = await baiduSearch({
					keyword: this.inputVal,
					page_num: 10,
					page: 1
				});
				console.log(result);
				for (let val of result.list.values()) {
					val.pitchType = false;
				}
				console.log(result.list);
				this.list = result.list;
			} catch (e) {
				console.log(e);
				this.showMessage(e.msg);
			}
		},
		//详情 获取下载路径
		async queryBaiduGetDetails() {
			try {
				let listArr = []; //储存选中数据
				let dowArr = []; //储存上传数据
				for (let val of this.list.values()) {
					console.log(val);
					if (val.pitchType) {
						listArr.push(val.fs_id);
					}
				}
				const result = await baiduGetDetails({
					fid: listArr.join(',')
				});
				for (let [index, vals] of result.list.entries()) {
					let post = {
						url: vals.dlink
					};
					uni.showLoading({
						title: '加载中...'
					});
					//下载到本地
					let result = await baidudownloadFiles(vals.dlink);
					//上传文件 生成订单
					const results = await zoomPrintFileUpload(result, {
						reset_file_name: `百度文档${index + 1}.pdf`
					});
				}
				uni.hideLoading();
				this.order_no = results;
				//跳转到订单页面
				uni.navigateTo({
					url: `/pages/index/reductionMakeup/reduction/index/index?orderNo=${
						results.order_no
					}`
				});
			} catch (e) {
				this.showMessage(e.msg);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.authorization {
	.btn-class {
		background: #fd2316;
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 99;
	}
	image {
		display: block;
		margin-bottom: 200upx;
		width: 100%;
	}
}
.list {
	padding-bottom: 200upx;
	.list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 670upx;
		height: 120upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6upx 12upx rgba(208, 118, 118, 0.16);
		border-radius: 20upx;
		margin: 0 auto;
		margin-bottom: 14upx;
		box-sizing: border-box;
		padding-left: 46upx;
		padding-right: 34upx;
		.item-left {
			display: flex;
			align-items: center;
			image {
				display: block;
				width: 69upx;
				height: 69upx;
				margin-right: 46upx;
			}
			.item-left-text {
				text {
					display: block;
					font-size: 24upx;
					color: rgba(34, 34, 34, 1);
					&:nth-of-type(1) {
						width: 300upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					&:nth-of-type(2) {
						margin-top: 16upx;
						font-size: 20upx;
						font-weight: 200;
						color: rgba(34, 34, 34, 1);
					}
				}
			}
		}
		.item-right {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 34upx;
			height: 34upx;
			border-radius: 50%;
			border: 2upx solid #fd2316;
			text {
				display: block;
				width: 20upx;
				height: 20upx;
				border-radius: 50%;
				background: #fd2316;
			}
		}
	}
}
.input-class {
	width: 586upx;
	height: 64upx;
	margin-top: 38upx;
	margin-bottom: 30upx;
	position: relative;
	background: rgba(255, 255, 255, 1);
	border: 2upx solid rgba(209, 209, 209, 1);
	border-radius: 32upx;
	margin-left: 48upx;
	display: flex;
	justify-content: space-between;
	align-items: center;

	input {
		display: block;
		width: 70%;
		box-sizing: border-box;
		padding-left: 30upx;
	}
	image {
		display: block;
		width: 32upx;
		height: 32upx;
		padding-left: 60upx;
		padding-right: 20upx;
	}
	.btn {
		position: absolute;
		right: -80upx;
		width: 100upx;
		height: 64upx;
		text-align: right;
		line-height: 64upx;
		font-size: 28upx;
		font-weight: 200;
		color: rgba(46, 46, 46, 1);
	}
}
.btn-class-red {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
	width: 100%;
}
</style>
