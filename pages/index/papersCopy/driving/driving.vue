<template>
	<view>
		<view class="hint">证件与背景颜色请尽量区分</view>
		<view class="item-select ">
			<image
				:src="identityFront.imgUrl"
				mode=""
				v-if="identityFront.imgUrl"
				class="identity-img"
				@click="compileImg('正面')"
			></image>
			<view class="" v-else>
				<view class="item-select-hint">正面</view>
				<image
					src="../../../../static/img/add.png"
					mode=""
					@click="addImg('正面')"
				></image>
				<view class="item-select-text" @click="addImg('正面')">
					添加驾驶证或行驶证正面照
				</view>
			</view>
		</view>
		<view class="item-select">
			<image
				:src="identityContrary.imgUrl"
				mode=""
				v-if="identityContrary.imgUrl"
				class="identity-img"
				@click="compileImg('反面')"
			></image>
			<view class="" v-else>
				<view class="item-select-hint">反面</view>
				<image
					src="../../../../static/img/add.png"
					mode=""
					@click="addImg('反面')"
				></image>
				<view class="item-select-text" @click="addImg('反面')">
					添加驾驶证或行驶证反面照
				</view>
			</view>
		</view>
		<view class="watermark">
			<view class="watermark-left">可选择添加水印</view>
			<view class="watermark-right">
				<view class="watermark-right-top" @click="btnWatermark('仅限')">
					<text
						class="select-icon"
						:style="{
							background: watermarkTypeY ? ' #FD2316' : '',
							border: watermarkTypeY ? '1px solid #FD2316' : '1px solid #707070'
						}"
					></text>
					<text>仅限</text>
					<input type="text" value="" v-model="watermarkInput" @click.stop="" />
					<text>使用</text>
				</view>
				<view class="watermark-right-bottom" @click="btnWatermark('当天')">
					<text
						class="select-icon"
						:style="{
							background: watermarkTypeD ? '#FD2316' : '',
							border: watermarkTypeD ? '1px solid #FD2316' : '1px solid #707070'
						}"
					></text>
					<text>当天日期</text>
				</view>
			</view>
		</view>
		<!-- 编辑裁剪上传的图片 -->
		<image-cropper
			:src="tempFilePathScr"
			:compileImgindex="compileImgindex"
			@confirm="confirm"
			@cancel="cancel"
		></image-cropper>
		<confirm-modal
			title="确认打印"
			textTwo="请确认您已经预览过所有图片。"
			text="为了确保文件的完整性，"
			@clickLeft="closeModal"
			@clickRight="confirms"
			v-if="confirmsType"
		></confirm-modal>
		<canvas canvas-id="myCanvas" class="myCanvas"></canvas>
		<view class="btn-class-red" @click="btnorder">确认</view>
		<up-loading v-if="showUpLoading" />
	</view>
</template>

<script>
import ImageCropper from '@/components/invinbg-image-cropper/invinbg-image-cropper.vue';
import { printFileUpload } from '@/common/api/index.js';
import upLoading from '@/components/uploadLoading/uploadLoading.vue';
export default {
	components: { ImageCropper,upLoading },
	data() {
		return {
			tempFilePathScr: '', //编辑的图片
			compileImgindex: '', //编辑图片的索引
			identityFront: {}, //身份证正面
			identityContrary: {}, //身份证正面
			type: '', //身份证正反面
			watermarkTypeD: false,
			watermarkTypeY: false,
			watermarkInput: '', //仅限使用
			confirmsType: false,
			showUpLoading: false
		};
	},
	methods: {
		//
		confirms() {
			this.confirmsType = false;
			uni.navigateTo({
				url: '../printingOptions/printingOptions'
			});
		},
		//跳转订单页
		btnorder() {
			let that = this;
			let time = '';
			this.showUpLoading = true;
			let watermarkVal = '';
			console.log(this.watermarkTypeY);
			if (this.watermarkTypeY) {
				console.log(this.watermarkInput);
				if (this.watermarkInput.length > 5) {
					this.showMessage('水印仅限6个字');
					return;
				} else {
					watermarkVal = '仅限' + this.watermarkInput + '使用';
				}
			}

			if (this.watermarkTypeD) {
				let date = new Date();
				let Y = date.getFullYear();
				let M =
					date.getMonth() + 1 < 10
						? '0' + (date.getMonth() + 1)
						: date.getMonth() + 1;
				let D = date.getDate();
				console.log(Y + M + D);
				time = Y + '-' + M + '-' + D;
			}

			watermarkVal = time + watermarkVal;
			const ctx = uni.createCanvasContext('myCanvas');
			ctx.drawImage('../../../../static/img/bak.jpg', 0, 0, 595, 842);
			ctx.drawImage(this.identityFront.imgUrl, 176, 150, 249, 170);
			ctx.drawImage(this.identityContrary.imgUrl, 176, 450, 249, 170);
			ctx.setFontSize(15);
			ctx.fillStyle = 'rgba(255,255,255,0.5)';
			// ctx.fillStyle = '#000';
			ctx.fillText(watermarkVal, 220, 170);
			ctx.fillText(watermarkVal, 220, 470);
			ctx.draw();
			setTimeout(() => {
				uni.canvasToTempFilePath({
					width: 595,
					height: 842,
					fileType: 'jpg',
					canvasId: 'myCanvas',
					success(res) {
						console.log(res.tempFilePath);
						that.uploadimg(res.tempFilePath);
					}
				});
			}, 2000);

			// this.confirmsType = true;
		},
		async uploadimg(tempFilePath) {
			
			try {
				let params = {
					upload_type: 1,
					scene: 5,
					reset_file_name: '身份证.png'
				};
				//上传文件 生成订单
				const result = await printFileUpload(tempFilePath, params);
				console.log(result);
				uni.navigateTo({
					url: `../order/order?orderNo=${result.order_no}`
				});
			} catch (e) {
				//TODO handle the exception
			} finally {
				this.showUpLoading = false;
			}
		},
		//水印切换
		btnWatermark(type) {
			if (type === '仅限') {
				this.watermarkTypeY = !this.watermarkTypeY;
			} else {
				this.watermarkTypeD = !this.watermarkTypeD;
			}
		},
		//编辑图片
		compileImg(type) {
			this.type = type;
			if (this.type === '正面') {
				this.compileImgindex = 1;
				this.tempFilePathScr = this.identityFront.notImgUrl;
			} else {
				this.compileImgindex = 2;
				this.tempFilePathScr = this.identityContrary.notImgUrl;
			}
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
					console.log(JSON.stringify(res.tempFilePaths));
					this.tempFilePathScr = res.tempFilePaths.shift();
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
		//添加图片按钮
		addImg(type) {
			this.type = type;
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
		//修改完成的方法
		confirm(e) {
			//判断是否为编辑图片   9999：不是  1或2：是
			console.log(e);
			if (e.detail.compileImgindex !== 9999 && e.detail.compileImgindex) {
				// 1：正面图片编辑 2:反面图片编辑
				if (e.detail.compileImgindex === 1) {
					this.identityFront.imgUrl = e.detail.tempFilePath;
					this.identityFront.notImgUrl = e.detail.src;
				} else {
					this.identityContrary.imgUrl = e.detail.tempFilePath;
					this.identityContrary.notImgUrl = e.detail.src;
				}
			} else {
				if (this.type === '正面') {
					this.identityFront.imgUrl = e.detail.tempFilePath;
					this.identityFront.notImgUrl = e.detail.src;
				} else {
					this.identityContrary.imgUrl = e.detail.tempFilePath;
					this.identityContrary.notImgUrl = e.detail.src;
				}
			}
			this.compileImgindex = 9999;
			this.tempFilePathScr = '';
		},
		//修改取消的方法
		cancel(e) {}
	}
};
</script>

<style lang="scss" scoped>
.hint {
	box-sizing: border-box;
	padding-left: 62upx;
	height: 62upx;
	font-size: 28upx;
	background: rgba(228, 228, 228, 1);
	font-weight: 600;
	line-height: 62upx;
	color: rgba(253, 35, 22, 1);
}

.item-select {
	width: 626upx;
	height: 396upx;
	background: rgba(255, 255, 255, 1);
	border: 2upx solid rgba(112, 112, 112, 1);
	box-shadow: 0px 6upx 12upx rgba(0, 0, 0, 0.16);
	border-radius: 26upx;
	margin: 0 auto;
	margin-top: 60upx;

	.item-select-hint {
		width: 90upx;
		height: 34upx;
		background: rgba(253, 35, 22, 1);
		border: 0px solid rgba(253, 35, 22, 1);
		opacity: 1;
		border-radius: 20upx;
		font-size: 20upx;
		margin-top: 38upx;
		margin-left: 42upx;
		margin-bottom: 86upx;
		font-weight: 600;
		line-height: 34upx;
		text-align: center;
		color: rgba(255, 255, 255, 1);
	}

	image {
		width: 85upx;
		height: 85upx;
		display: block;
		margin: 0 auto;
		margin-bottom: 34upx;
	}

	.item-select-text {
		text-align: center;
		font-size: 30upx;
		font-weight: 600;
		color: rgba(15, 12, 11, 1);
	}
	.identity-img {
		width: 100%;
		height: 100%;
		border-radius: 20upx;
	}
}

.watermark {
	display: flex;
	margin-top: 42upx;
	font-size: 28upx;
	font-weight: 200;
	color: rgba(15, 12, 11, 1);
	box-sizing: border-box;
	padding-left: 62upx;
	padding-bottom: 120upx;
	margin-right: 64upx;
	justify-content: space-between;

	.watermark-right {
		.watermark-right-top {
			display: flex;
			align-items: center;
			input {
				width: 188upx;
				height: 38upx;
				min-height: 38upx;
				display: block;
				border-bottom: 2upx solid rgba(15, 12, 11, 1);
				opacity: 1;
			}
		}
		.watermark-right-bottom {
			display: flex;
			align-items: center;
			margin-top: 16upx;
		}
		.select-icon {
			display: block;
			width: 23upx;
			height: 23upx;
			opacity: 1;
			border-radius: 4upx;
			margin-right: 14upx;
			border: 1px solid #707070;
		}
	}
}
.btn-class-red {
	position: fixed;
	z-index: 99;
	bottom: 0;
}
.myCanvas {
	position: fixed;
	left: -2000px;
	width: 595px;
	height: 842px;
	background: #fff;
}
</style>
