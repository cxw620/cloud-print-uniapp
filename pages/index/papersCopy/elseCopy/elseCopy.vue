<template>
	<view>
		<view class="upimg">
			<view class="title">
				<text>请尽量平铺文件</text>
				<text>请尽量在深色背景下拍摄</text>
			</view>
			<view class="upimg-cont" v-if="tempFilePath">
				<image :src="tempFilePath" class="images"></image>
			</view>
			<view class="upimg-cont" v-else>
				<image
					src="../../../../static/img/add.png"
					mode=""
					class="add"
					@click="addImgs"
				/>
				<text class="photograph-icon-text" @click="addImgs">
					{{ index === '3' ? '请添加营业执照' : '请添加证书' }}
				</text>
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
			tempFilePath: '',
			index: '1',
			showUpLoading: false
		};
	},
	onLoad(e) {
		this.index = e.index;
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
		async btnorder() {
			this.showUpLoading = true;
			try {
				let params = { upload_type: 1, scene: 5 };
				if (Number(this.index) === 3) {
					params.reset_file_name = '营业执照.png';
				} else {
					params.reset_file_name = '证书.png';
				}
				//上传文件 生成订单
				const result = await printFileUpload(this.tempFilePath, params);
				uni.navigateTo({
					url: `../order/order?orderNo=${result.order_no}`
				});
			} catch (e) {
				//TODO handle the exception
			} finally {
				this.showUpLoading = false;
			}

			// this.confirmsType = true;
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
		addImgs() {
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
			this.tempFilePath = e.detail.tempFilePath;
			if (e.detail.compileImgindex !== 9999 && e.detail.compileImgindex) {
				// 1：正面图片编辑 2:反面图片编辑
				this.tempFilePath = e.detail.tempFilePath;

				// if (e.detail.compileImgindex === 1) {
				// 	this.identityFront.imgUrl = e.detail.tempFilePath;
				// 	this.identityFront.notImgUrl = e.detail.src;
				// } else {
				// 	this.identityContrary.imgUrl = e.detail.tempFilePath;
				// 	this.identityContrary.notImgUrl = e.detail.src;
				// }
			} else {
				// if (this.type === '正面') {
				// 	this.identityFront.imgUrl = e.detail.tempFilePath;
				// 	this.identityFront.notImgUrl = e.detail.src;
				// } else {
				// 	this.identityContrary.imgUrl = e.detail.tempFilePath;
				// 	this.identityContrary.notImgUrl = e.detail.src;
			}
			// }
			this.compileImgindex = 9999;
			this.tempFilePathScr = '';
		},
		//修改取消的方法
		cancel(e) {}
	}
};
</script>

<style lang="scss" scoped>
.upimg {
	.upimg-cont {
		width: 595upx;
		height: 842upx;
		background: rgba(255, 255, 255, 1);
		border: 2upx solid rgba(206, 206, 206, 1);
		box-shadow: 0px 6upx 12upx rgba(0, 0, 0, 0.16);
		opacity: 1;
		margin: 0 auto;
		margin-top: 38upx;
		.images {
			width: 100%;
			height: 100%;
		}
		&:nth-of-type(1) {
			image {
			}
		}
	}
	.title {
		width: 100%;

		background: rgba(228, 228, 228, 1);
		opacity: 1;
		padding-top: 24upx;
		padding-bottom: 24upx;

		padding-left: 70upx;
		box-sizing: border-box;

		text {
			margin-top: 0;
			display: block;
			font-size: 24upx;
			font-weight: 600;
			color: rgba(253, 35, 22, 1);
			&:nth-of-type(1) {
				margin-bottom: 14upx;
			}
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
.btn-class-red {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
}
</style>
