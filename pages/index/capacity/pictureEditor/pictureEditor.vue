<template>
	<view class="cont">
		<view class="title">如人像未识别，请返回重试.</view>
		<view class="title">打印效果如下</view>

		<view
			class=" background-cont  draw_canvas share__canvas share__canvas3"
			:style="{ background: colorType }"
			id="poster"
		>
			<image
				:src="imgUrl"
				class="draw_canvas"
				mode="aspectFill"
				:data-url="imgUrl"
				data-mode="aspectFill"
				data-type="image"
			></image>
		</view>

		<canvas canvas-id="canvas3" class="share__canvass"></canvas>
		<view class="background-nav">
			<view class="nav-left">色彩选择</view>
			<view class="nav-right">
				<view
					class="nav-right-item"
					:class="selects === 2 ? 'selectsType' : ''"
					@click="btnColour(2)"
				>
					<text></text>
					<text>白色</text>
				</view>
				<view
					class="nav-right-item"
					:class="selects === 3 ? 'selectsType' : ''"
					@click="btnColour(3)"
				>
					<text></text>
					<text>蓝色</text>
				</view>
				<view
					class="nav-right-item"
					:class="selects === 4 ? 'selectsType' : ''"
					@click="btnColour(4)"
				>
					<text></text>
					<text>红色</text>
				</view>
			</view>
		</view>
		<view class="btns">
			<view class="btn-class-black" @click="save">仅保存电子照</view>
			<view class="btn-class-red" @click="drawCanvas">确认打印</view>
		</view>
		<!-- 合成图片 -->
		<view class=""></view>
		<view
			class="picture-box draw_canva share__canva share__canvas4"
			:style="{ padding: paddings }"
		>
			<view
				class="box-item  draw_canva"
				:style="{
					width: Number(cropWidth) === 453 ? '649px' : cropWidth + 'px',
					height: Number(cropHeight) === 693 ? '991px' : cropHeight + 'px'
				}"
				v-for="(item, index) in pictureNumber"
				:key="index"
			>
				<image
					:src="pictureUrl"
					class="draw_canva"
					mode="aspectFit"
					:data-url="pictureUrl"
					data-mode="aspectFit"
					data-type="image"
				></image>
			</view>
		</view>
		<canvas canvas-id="canvas4" class="share__canva"></canvas>
		<!-- 编辑裁剪上传的图片 -->
		<image-cropper
			:src="tempFilePathScr"
			:crop-width="cropWidth"
			:crop-height="cropHeight"
			:crop-fixed="true"
			@confirm="confirm"
			@cancel="cancel"
		></image-cropper>
		<up-loading v-if="showUpLoading" />
	</view>
</template>

<script>
import Wxml2Canvas from '@/common/libs/wxml/index.js';
import ImageCropper from '@/components/invinbg-image-cropper/invinbg-image-cropper.vue';
import { printFileUpload, preOrderDetail } from '@/common/api/index.js';
import upLoading from '@/components/uploadLoading/uploadLoading.vue';
export default {
	components: {
		ImageCropper,
		upLoading
	},
	data() {
		return {
			imgUrl: '',
			colorType: '#D23630',
			selects: 4,
			sizeType: '',
			tempFilePathScr: '',
			cropWidth: '295',
			cropHeight: '413',
			pictureNumber: 16,
			pictureUrl: require('@/static/img/imgs.png'),
			paddings: '100px 0 0 100px',
			saveType: false,
			showUpLoading: false,
			price_sku_id:null
		};
	},
	onShow() {},
	onLoad(e) {
		this.price_sku_id = e.price_sku_id;
		console.log(e);
		switch (e.sizeType) {
			case '1寸':
				this.cropWidth = '295';
				this.cropHeight = '413';
				this.paddings = '200px 0 0 0';
				this.pictureNumber = 16;
				break;
			case '小1寸':
				this.cropWidth = '260';
				this.cropHeight = '378';
				this.paddings = '260px 100px 0 100px';
				this.pictureNumber = 16;
				break;
			case '大1寸':
				this.pictureNumber = 9;
				this.cropWidth = '390';
				this.cropHeight = '567';
				this.paddings = '200px 50px 0 50px';
				break;
			case '2寸':
				this.pictureNumber = 9;
				this.cropWidth = '413';
				this.cropHeight = '579';
				this.paddings = '180px 50px 0 50px';
				break;
			case '小2寸':
				this.pictureNumber = 9;
				this.cropWidth = '413';
				this.cropHeight = '531';
				this.paddings = '200px 50px 0 50px';
				break;
			case '大2寸':
				this.pictureNumber = 9;
				this.cropWidth = '413';
				this.cropHeight = '620';
				this.paddings = '80px 50px 0 50px';
				break;
			case '3寸':
				this.paddings = '550px 50px 0 50px';
				console.log(e.sizeType);
				this.cropWidth = '453';
				this.cropHeight = '693';
				this.pictureNumber = 2;
				break;
		}
		console.log(this.cropWidth, this.cropHeight);
		// e.imgurl;
		this.sizeType = e.sizeType;
		uni.downloadFile({
			url: e.imgurl,
			success: res => {
				console.log(res.tempFilePath);
				this.imgUrl = res.tempFilePath;
			}
		});
	},
	methods: {
		/**
		 * 根据订单编号获取订单详情
		 * @param {Object} orderNo  订单编号
		 */
		async getOrderDetail(orderNo) {
			try {
				const orderDetail = await preOrderDetail({ order_no: orderNo });
				console.log(orderDetail);
				// this.formatGoods(this.orderDetail.goods_list);
			} catch (e) {
				this.showMessage(e.msg);
			}
		},
		/* 保存照片到相册 */
		save() {
			let self = this;
			let canvas_widht = uni.upx2px(670);
			let canvas_height = uni.upx2px(936);
			console.log(canvas_widht, canvas_height);
			let drawImage3s = new Wxml2Canvas({
				width: 670,
				height: 936,
				element: 'canvas3',
				background: this.colorType,
				progress(percent) {},
				finish(url) {
					console.log(url);
					wx.saveImageToPhotosAlbum({
						filePath: url,
						success(data) {
							wx.showToast({
								title: '保存成功',
								icon: 'success',
								duration: 2000
							});
						},
						fail: function(err) {
							console.log(err);
							if (err.errMsg) {
								console.log('当初用户拒绝，再次发起授权');
								wx.getSetting({
									success(res) {
										console.log(res.authSetting);
										if (!res.authSetting['scope.writePhotosAlbum']) {
											wx.authorize({
												scope: 'scope.writePhotosAlbum',
												success() {
													// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
													// recorderManager.start(options);
												},
												fail(err) {
													console.log(err);
													wx.showModal({
														title: '警告',
														content:
															'您点击了拒绝授权,将无法正常保存,点击确定重新获取授权。',
														success: function(res) {
															if (res.confirm) {
																wx.openSetting({
																	success: res => {
																		console.log(res);
																		if (
																			!res.authSetting['scope.writePhotosAlbum']
																		) {
																		} else {
																		}
																	}
																});
															}
														}
													});
												}
											});
										} else {
										}
									}
								});
							}
						},
						complete(res) {
							console.log(res);
						}
					});
				},
				error(res) {}
			});

			let data = {
				list: [
					{
						type: 'wxml',
						class: '.share__canvas3 .draw_canvas',
						limit: '.share__canvas3',
						x: 0,
						y: 0
					}
				]
			};

			drawImage3s.draw(data);
		},
		/**
		 * 上传文件
		 * @param {Object} data	 上传文件
		 */
		async uploadimg(tempFilePath) {
			try {
				let params = {
					upload_type: 1,
					scene: 6,
					reset_file_name: '智能证件照.png'
				};
				//上传文件 生成订单
				const result = await printFileUpload(tempFilePath, params);
				console.log(result);
				uni.navigateTo({
					url: `../order/order?orderNo=${result.order_no}&sizeType=${
						this.sizeType
					}&price_sku_id=${this.price_sku_id}`
				});
			} catch (e) {
				//TODO handle the exception
			} finally {
				this.showUpLoading = false;
			}
			console.log(tempFilePath);
		},
		/* 裁剪证件照 */
		confirm(e) {
			console.log(e.detail.tempFilePath);
			this.pictureUrl = e.detail.tempFilePath;
			console.log(e);
			this.drawCanvass();
		},
		drawCanvass() {
			this.showUpLoading = true;
			let that = this;
			let drawImage3 = new Wxml2Canvas({
				width: 1500,
				height: 2100,
				element: 'canvas4',
				background: '#fff',
				progress(percent) {},
				finish(url) {
					console.log(url);

					that.uploadimg(url);
				},
				error(res) {}
			});

			let data = {
				list: [
					{
						type: 'wxml',
						class: '.share__canvas4 .draw_canva',
						limit: '.share__canvas4',
						x: 0,
						y: 0
					}
				]
			};

			drawImage3.draw(data);
		},
		drawCanvas() {
			let self = this;
			let canvas_widht = uni.upx2px(670);
			let canvas_height = uni.upx2px(936);
			console.log(canvas_widht, canvas_height);
			let drawImage3s = new Wxml2Canvas({
				width: 670,
				height: 936,
				element: 'canvas3',
				background: this.colorType,
				progress(percent) {},
				finish(url) {
					console.log(url);
					self.tempFilePathScr = url;
				},
				error(res) {}
			});

			let data = {
				list: [
					{
						type: 'wxml',
						class: '.share__canvas3 .draw_canvas',
						limit: '.share__canvas3',
						x: 0,
						y: 0
					}
				]
			};

			drawImage3s.draw(data);
		},

		// 选择背景颜色
		btnColour(e) {
			console.log(e);
			this.selects = e;
			switch (e) {
				case 1:
					this.colorType = 'none';
					break;
				case 2:
					this.colorType = '#fff';
					break;
				case 3:
					this.colorType = '#0098ff';
					break;
				case 4:
					this.colorType = '#D23630';
					break;
			}
			console.log(this.colorType);
		}
	}
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 24upx;
	font-weight: 200;
	color: rgba(34, 34, 34, 1);
	margin-left: 50upx;
	margin-bottom: 20upx;
	margin-top: 18upx;
}
.share__canvass {
	position: fixed;
	bottom: -1000upx;
	width: 670upx;
	height: 936upx;
}
.background-cont {
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	width: 670upx;
	height: 936upx;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	margin: 0 auto;

	image {
		width: 100%;
		height: 100%;
	}
}

.background-nav {
	width: 670upx;
	height: 110upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	border-radius: 20upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;
	margin-top: 40upx;
	margin-bottom: 110upx;

	.nav-left {
		margin-left: 10upx;
		font-size: 24upx;
		font-weight: 200;
		color: rgba(34, 34, 34, 1);
	}

	.nav-right {
		display: flex;

		.nav-right-item {
			display: flex;

			text {
				display: block;

				&:nth-of-type(1) {
					width: 25upx;
					height: 25upx;
					border-radius: 6upx;
					border: 1px solid #e4e4e4;
				}

				&:nth-of-type(2) {
					margin-left: 8upx;
					margin-right: 28upx;
					font-size: 24upx;
					font-weight: 200;
					color: rgba(34, 34, 34, 1);
				}
			}
		}
	}
}
.cont {
	position: relative;
	padding-bottom: 50upx;
}
.btns {
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	.btn-class-black {
		background: #fff;
		color: #000000;
		flex: 1;
	}
	.btn-class-red {
		flex: 1;
	}
}
.selectsType {
	text {
		&:nth-of-type(1) {
			background: #fd2316;
			border: #fd2316;
		}
	}
}
.picture-box {
	position: fixed;
	left: -2000px;
	width: 1500px;
	height: 2100px;
	background: #fff;
	display: flex;
	justify-content: center;
	align-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
	box-sizing: border-box;
	.box-item {
		margin: 6px !important;
		image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
}
.share__canva {
	position: fixed;
	left: -2000px;
	width: 1500px;
	height: 2100px;
}
</style>
