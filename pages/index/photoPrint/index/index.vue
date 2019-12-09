<template>
	<view class="imgage-upload-contc">
		<!-- 图片预览 -->
		<view class="" v-if="upImgList.length">
			<view class="title">打印效果预览，照片未显示部分会被裁掉</view>
			<view class="imgage-box">
				<view
					class="imgage-item"
					v-for="(item, index) in upImgList"
					:key="index"
				>
					<view class="imgage-cont">
						<image
							:src="item.imgUrl"
							mode=""
							@click.stop="compileImg(item, index)"
						></image>
						<view
							class="iconfont iconhao"
							@click.stop="removeImg(index)"
						></view>
						<view class="hint" @click.stop="compileImg(item, index)">
							点击图片编辑
						</view>
					</view>
					<!-- 					<view class="background-number">
						<view
							class="number-btn iconfont icon-hao"
							@click="btnSubtract(item)"
						></view>
						<text>{{ item.number }}</text>
						<view
							class="number-btn  iconfont iconhao"
							@click="btnPlus(item)"
						></view>
					</view> -->
				</view>
				<!-- 添加图片 -->
				<view
					class="imgage-item image-add"
					v-if="upImgList.length < 10"
					@click="addimg"
				>
					<view class="imgage-cont">
						<image src="../../../../static/img/add.png" mode=""></image>
						<text>添加图片</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 图片上传 -->
		<view class="upimg" v-else>
			<view class="title"><text>目前仅提供7寸照片打印</text></view>
			<image
				src="../../../../static/img/add.png"
				mode=""
				class="add"
				@click="addimg"
			/>
			<text class="photograph-icon-text" @click="addimg">点击上传照片</text>
		</view>
		<!-- 编辑裁剪上传的图片 -->
		<image-cropper
			:src="tempFilePathScr"
			crop-width="750"
			crop-height="986"
			:compileImgindex="compileImgindex"
			crop-fixed="true"
			@confirm="confirm"
			@cancel="cancel"
		></image-cropper>
		<!-- 底部按钮 -->
		<view class="btns">
			<view class="btn-class-black">上传照片（{{ upImgList.length }}/10）</view>
			<view class="btn-class-red" @click="toOrder">确认打印</view>
		</view>
		<upload-loading v-if="showUpLoading" />
	</view>
</template>

<script>
import ImageCropper from '@/components/invinbg-image-cropper/invinbg-image-cropper.vue';
import uploadLoading from '@/components/uploadLoading/uploadLoading.vue';
import { printFileUpload } from '@/common/api/index.js';

export default {
	components: { ImageCropper, uploadLoading },
	data() {
		return {
			compileImgindex: 9999, //编辑图索引
			tempFilePathScr: '', //需要编辑的图片
			cropFilePath: '',
			upImgList: [], //即将要上传的图片数组
			showUpLoading: false
		};
	},
	methods: {
		/* 确认打印 */
		toOrder() {
			if (!this.upImgList.length) {
				this.showMessage('请添加照片');
				return;
			}
			console.log(this.upImgList);
			this.uploadFile(this.upImgList);
		},

		/**
		 * 上传文件
		 * @param {Object} data	 上传文件
		 */
		async uploadFile(data) {
			this.showUpLoading = true;
			let params = { upload_type: 1, scene: 7 };
			try {
				let result = '';
				for (let [index, el] of data.entries()) {
					if (result.order_no) {
						params.order_no = result.order_no;
					}
					params.reset_file_name = `7寸照片${index + 1}${el.imgUrl.substring(
						el.imgUrl.lastIndexOf('.')
					)}`;
					result = await printFileUpload(el.imgUrl, params);
				}
				uni.navigateTo({
					url: `../order/order?orderNo=${result.order_no}`
				});
			} catch (e) {
				this.showMessage(e.msg);
			} finally {
              this.showUpLoading = false;
            }
		},

		//需要的打印图片的数量 加
		btnPlus(item) {
			item.number = item.number + 1;
		},

		//需要的打印图片的数量 减
		btnSubtract(item) {
			//判断数量是否等于1 如果是 那不能减
			if (item.number === 1) {
				return;
			}
			item.number = item.number - 1;
		},

		//编辑图片
		compileImg(item, index) {
			console.log(index);
			this.compileImgindex = index;
			this.tempFilePathScr = item.notImgUrl;
		},

		//删除图片
		removeImg(index) {
			console.log(index);
			this.upImgList.splice(index, 1);
			console.log(this.upImgList);
		},

		//编辑裁剪图片点击完成
		confirm(e) {
			if (e.detail.compileImgindex != 9999) {
				this.upImgList[e.detail.compileImgindex].imgUrl = e.detail.tempFilePath;
			} else {
				this.upImgList.push({
					imgUrl: e.detail.tempFilePath,
					number: 1,
					notImgUrl: e.detail.scr
				});
			}
			this.tempFilePathScr = '';
			// this.cropFilePath = e.detail.tempFilePath;

			console.log('编辑完成！');
			console.log(e);
			console.log('编辑完成!!!！');
		},

		//编辑裁剪图片点击取消
		cancel() {},

		//添加图片
		addimg() {
			//用于判断是否是编辑
			this.compileImgindex = 9999;
			//选择照片的方式
			uni.showActionSheet({
				itemList: ['微信聊天记录', '拍照', '手机相册'],
				success: res => {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					//0:聊天记录 1：拍照 2：手机相册
					if (res.tapIndex == 0) {
						this.chooseMessageFile();
					} else {
						this.chooseImage(res.tapIndex);
					}
				}
			});
		},

		//从聊天记录选择图片
		chooseMessageFile() {
			uni.chooseMessageFile({
				count: 1,
				type: 'image',
				success: res => {
					console.log(res.tempFiles[0].path);
					this.tempFilePathScr = res.tempFiles[0].path;
				}
			});
		},

		//相册或者手机拍照图片
		chooseImage(index) {
			// 1：拍照 2：手机相册
			console.log(index);
			let sourceType = index == 1 ? ['camera'] : ['album'];
			console.log(sourceType);
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: sourceType, //从相册选择
				success: res => {
					console.log(JSON.stringify(res));
					this.tempFilePathScr = res.tempFilePaths.shift();
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	height: 100%;
}
.imgage-upload-contc {
	position: relative;
	
	height: 100%;
	padding-bottom: 154upx;
}
.title {
	padding-left: 50upx;
	height: 62upx;
	background: rgba(228, 228, 228, 1);
	font-size: 24upx;
	font-weight: 200;
	line-height: 62upx;
	color: rgba(34, 34, 34, 1);
}
.imgage-box {
	display: flex;
	flex-wrap: wrap;
	padding-left: 50upx;
	padding-top: 40upx;
	box-sizing: border-box;

	.imgage-item {
		.imgage-cont {
			width: 308upx;
			height: 454upx;
			background: rgba(255, 255, 255, 1);
			border: 2upx solid rgba(253, 35, 22, 1);
			box-shadow: 0px 6upx 12upx rgba(0, 0, 0, 0.16);
			border-radius: 20upx;
			position: relative;
			margin-bottom: 20upx;

			image {
				width: 272upx;
				height: 402upx;
				margin: 0 auto;
				display: block;
				margin-top: 26upx;
			}

			.iconfont {
				width: 32upx;
				height: 32upx;
				background: #fd2316;
				display: block;
				text-align: center;
				line-height: 32upx;
				box-sizing: border-box;
				color: #fff;
				font-size: 22upx;
				border-radius: 50%;
				transform: rotate(50deg);
				position: absolute;
				right: 6upx;
				top: 10upx;
				z-index: 1;
			}

			.hint {
				position: absolute;
				bottom: 26upx;
				left: 0;
				right: 0;
				margin: auto;
				width: 272upx;
				height: 40upx;
				background: rgba(137, 137, 137, 1);
				opacity: 0.49;
				text-align: center;
				font-size: 24upx;
				font-weight: 200;
				line-height: 40upx;
				color: rgba(255, 255, 255, 1);
			}
		}
		.background-number {
			margin-bottom: 50upx;
			margin-top: 18upx;
			display: flex;
			align-items: center;
			justify-content: center;
			text {
				width: 62upx;
				height: 34upx;
				display: block;
				background: rgba(255, 255, 255, 1);
				border: 2upx solid rgba(228, 228, 228, 1);
				opacity: 1;
				font-size: 26upx;
				line-height: 34upx;
				box-sizing: border-box;
				padding-left: 10upx;
				padding-right: 6upx;
				border-radius: 6upx;
				min-height: 34upx;
				margin-left: 6upx;
				margin-right: 6upx;
			}
			.number-btn {
				color: #f5222d;
				font-size: 26upx;
			}
		}
		&:nth-of-type(1n) {
			margin-right: 35upx;
		}
	}
	.image-add {
		.imgage-cont {
			image {
				width: 89upx;
				height: 89upx;
				display: block;
				margin-top: 154upx;
			}
			text {
				font-size: 30upx;
				color: #979797;
				text-align: center;
				display: block;
				margin-top: 16upx;
			}
		}
	}
}
.btns {
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	.btn-class-black {
		flex: 1;
		color: #fff;
		background: rgba(253, 35, 22, 1);
		opacity: 0.59;
	}
	.btn-class-red {
		flex: 1;
	}
}

.upimg {
	.title {
		width: 100%;

		height: 80upx;
		background: rgba(228, 228, 228, 1);
		opacity: 1;
		line-height: 80upx;
		padding-left: 56upx;
		box-sizing: border-box;

		text {
			margin-top: 0;
			display: block;
			font-size: 24upx;
			font-weight: 600;
			color: rgba(253, 35, 22, 1);
		}
	}

	.iconfont {
		color: #fd2316;
	}

	text {
		margin-top: 32upx;
		display: block;
		font-size: 34upx;
		font-weight: 600;
		color: rgba(151, 151, 151, 1);
	}

	.photograph-icon {
		margin-top: 370upx;
		text-align: center;
	}

	.photograph-icon-text {
		text-align: center;
	}

	.add {
		width: 134upx;
		height: 134upx;
		display: block;
		margin: 0 auto;
		margin-top: 370upx;
	}
}
</style>
