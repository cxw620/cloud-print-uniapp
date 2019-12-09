<template>
	<view>
		<!-- 尺寸列表 -->
		<view class="capacity-item" v-for="(item, index) in tabList" :key="index">
			<view class="step"><view :class="['iconfont', item.icon]"></view></view>
			<view class="item-right">
				<view
					class="right-items"
					@click="addimg(item2.size)"
					v-for="(item2, index2) in item.sizeList"
					:key="index2"
				>
					<view class="right-items-left">
						<text>{{ item2.size }}</text>
						<text>{{ item2.mm }}</text>
					</view>
					<view class="iconfont iconxiaoyuhao-copy"></view>
				</view>
			</view>
		</view>
		<view class="capacity-item capacity-item3" @click="addimg('3寸')">
			<view class="step"><view class="iconfont iconzu43"></view></view>
			<view class="capacity-item-right">
				<view class="capacity-item-right-text">
					<text style="font-weight: 600;">3寸</text>
					<text>55x84mm</text>
				</view>
				<view class="iconfont iconxiaoyuhao-copy"></view>
			</view>
		</view>
		<!-- 签证照片 -->
		<view class="title">签证照片</view>
		<view class="capacity-item visa" @click="showMessage('该功能正在开发中')">
			<view class="step"><view class="iconfont iconzu22"></view></view>
			<view class="item-right">
				<view
					class="right-items"
					v-for="(item, index) in visaList"
					:key="index"
				>
					<view class="right-items-left">
						<text style="font-size:24upx;color:rgba(151,151,151,1);">
							{{ item.name }}
						</text>
						<text>{{ item.mm }}</text>
					</view>
					<view class="iconfont iconxiaoyuhao-copy"></view>
				</view>

				<view class="more">更多国家</view>
			</view>
		</view>

		<!-- 合成图片 -->

		<view
			class="picture-box draw_canva share__canva share__canvas4 "
			:style="{ padding: paddings }"
		>
			<view
				class="box-item  draw_canva"
				:style="{
					width:
						Number(cropWidth) === 453 ? '649' + 'px' : Number(cropWidth) + 'px',
					height:
						Number(cropHeight) === 693
							? '991' + 'px'
							: Number(cropHeight) + 'px'
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
import { helpsGethelp, uploadPortraitCutout,printFileUpload } from '@/common/api/index.js';
import {specList} from  '@/common/api/order.js';
import ImageCropper from '@/components/invinbg-image-cropper/invinbg-image-cropper.vue';
import Wxml2Canvas from '@/common/libs/wxml/index.js';
import upLoading from '@/components/uploadLoading/uploadLoading.vue';
export default {
	components: { ImageCropper,upLoading },
	data() {
		return {
			tempFilePathScr: '',
			upImg: '',
			sizeType: '',
			capacityType: null,
			specLists:[],
			showUpLoading:false,
			cropWidth: '260',
			cropHeight: '378',
			price_sku_id:null,
			pictureNumber: 16,
			pictureUrl: require('@/static/img/imgs.png'),
			paddings: '100px 0 0 200px',
			tabList: [
				{
					icon: 'iconzu42',
					sizeList: [
						{ size: '1寸', mm: '25x35mm' },
						{ size: '小1寸', mm: '22x32mm' },
						{ size: '大1寸', mm: '33x48mm' }
					]
				},
				{
					icon: 'iconzu',
					sizeList: [
						{ size: '2寸', mm: '35x49mm' },
						{ size: '小2寸', mm: '35x53mm' },
						{ size: '大2寸', mm: '35x53mm' }
					]
				}
			],
			visaList: [
				{ name: '美国签证', mm: '51x51mm' },
				{ name: '日本签证', mm: '51x51mm' },
				{ name: '韩国签证', mm: '51x51mm' },
				{ name: '泰国签证', mm: '51x51mm' }
			]
		};
	},
	onLoad(e) {
		console.log(e);
		this.capacityType = e.capacityType;
		this.getspecList()
	},
	methods: {
		/* 获取规格 */
		async getspecList(){
			try{
				const result=await specList({group_id:1});
				console.log(result)
				this.specLists=result.spec_list
			}catch(e){
				//TODO handle the exception
			}
		},
		async setUploadPortraitCutout(tempFilePath) {
			this.showUpLoading = true;
			try {
				const result = await uploadPortraitCutout(tempFilePath);
				console.log(result);
				uni.navigateTo({
					url:
						'../pictureEditor/pictureEditor?sizeType=' +
						this.sizeType +
						'&imgurl=' +
						result.alpha_url+'&price_sku_id='+this.price_sku_id
				});
			} catch (e) {
				this.showMessage(e.msg);
			}finally {
				this.showUpLoading = false;
			}
		},
		/* 裁剪证件照 */
		confirm(e) {
			this.pictureUrl = e.detail.tempFilePath;
				this.showUpLoading = true;
			console.log(e);
			this.drawCanvass();
		},
		/**
		 * 上传文件
		 * @param {Object} data	 上传文件
		 */
		async uploadimg(tempFilePath) {
			console.log(tempFilePath);
			this.showUpLoading=true
			try{
				let params = {
					upload_type: 1,
					scene: 6,
					reset_file_name: '智能证件照.png'
				};
				//上传文件 生成订单
				const result = await printFileUpload(tempFilePath, params);
				console.log(result);
				uni.navigateTo({
					url: `../order/order?orderNo=${result.order_no}&sizeType=${this.sizeType}&price_sku_id=${this.price_sku_id}`
				});
			}catch(e){
				//TODO handle the exception
			}finally {
				this.showUpLoading = false;
			}
	
		},
		drawCanvass() {
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
				error(res) {
					this.showUpLoading = false;
					uni.hideLoading();
				}
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
		cancel(e) {
			console.log(e);
		},
		//从聊天记录选择图片
		chooseMessageFile() {
			uni.chooseMessageFile({
				count: 1,
				type: 'image',
				success: res => {
					console.log(res.tempFiles[0].path);
					if (Number(this.capacityType) === 2) {
						this.tempFilePathScr = res.tempFiles[0].path;
					} else {
						this.setUploadPortraitCutout(res.tempFiles[0].path);
					}

					// this.tempFilePathScr = res.tempFiles[0].path;
				}
			});
		},
		//相册或者手机拍照图片
		chooseImage(index) {
			// 1：拍照 2：手机相册
			console.log(index);
			if (Number(this.capacityType) === 2) {
				index = 2;
			}
			let sourceType = index == 1 ? ['camera'] : ['album'];
			console.log(sourceType);
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: sourceType, //从相册选择
				success: res => {
					console.log(res.tempFilePaths[0]);
					if (Number(this.capacityType) === 2) {
						this.tempFilePathScr = res.tempFilePaths[0];
					} else {
						this.setUploadPortraitCutout(res.tempFilePaths[0]);
					}
				}
			});
		},

		addimg(e) {
			this.sizeType = e;
			let spec_sku_id=null
			switch (this.sizeType) {
			case '1寸':
				this.cropWidth = '295';
				this.cropHeight = '413';
				this.paddings = '200px 0 0 0';
				this.pictureNumber = 16;
				spec_sku_id=13
				break;
			case '小1寸':
				this.cropWidth = '260';
				this.cropHeight = '378';
				this.paddings = '260px 100px 0 100px';
				this.pictureNumber = 16;
						spec_sku_id=14
				break;
			case '大1寸':
				this.pictureNumber = 9;
				this.cropWidth = '390';
				this.cropHeight = '567';
				this.paddings = '200px 50px 0 50px';
						spec_sku_id=15
				break;
			case '2寸':
				this.pictureNumber = 9;
				this.cropWidth = '413';
				this.cropHeight = '579';
				this.paddings = '180px 50px 0 50px';
						spec_sku_id=16
				break;
			case '小2寸':
				this.pictureNumber = 9;
				this.cropWidth = '413';
				this.cropHeight = '531';
				this.paddings = '200px 50px 0 50px';
						spec_sku_id=17
				break;
			case '大2寸':
				this.pictureNumber = 9;
				this.cropWidth = '413';
				this.cropHeight = '620';
				this.paddings = '80px 50px 0 50px';
						spec_sku_id=18
				break;
			case '3寸':
				this.paddings = '550px 50px 0 50px';
				console.log(e.sizeType);
				this.cropWidth = '453';
				this.cropHeight = '693';
				this.pictureNumber = 2;
						spec_sku_id=19
				break;
			}
			console.log(this.specLists)
			for(let i in this.specLists){
				console.log(this.specLists[i])
				if(Number(this.specLists[i].spec_sku_id)===Number(spec_sku_id)){
					console.log(this.specLists[i].price_sku_id);
					this.price_sku_id=this.specLists[i].price_sku_id
				}
				
			}
			//用于判断是否是编辑
			this.compileImgindex = 9999;
			//选择照片的方式
			let itemList = ['微信聊天记录', '拍照', '手机相册'];
			if (Number(this.capacityType) === 2) {
				itemList = ['微信聊天记录', '手机相册'];
			}
			uni.showActionSheet({
				itemList: itemList,
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
		}
	}
};
</script>

<style lang="scss" scoped>
.capacity-item {
	width: 670upx;
	height: 254upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
	opacity: 1;
	margin: 0 auto;
	display: flex;
	margin-top: 40upx;
	border-radius: 20upx;

	.step {
		box-sizing: border-box;
		padding-top: 34upx;
		width: 219upx;

		.iconfont {
			font-size: 75upx;
			color: #fd2316;
			text-align: center;
		}
	}

	.item-right {
		box-sizing: border-box;
		padding-top: 5upx;
		width: 100%;

		.right-items {
			display: flex;
			border-bottom: 1px solid rgba(226, 225, 225, 1);
			height: 75upx;
			justify-content: space-between;

			// &:nth-of-type(3) {

			// }

			.right-items-left {
				width: 210upx;
				display: flex;
				justify-content: space-between;

				text {
					margin-top: 20upx;
					font-size: 24upx;
					font-family: Lantinghei SC;
					font-weight: 600;
					line-height: 32px;
					color: rgba(151, 151, 151, 1);
					opacity: 1;

					&:nth-of-type(2) {
						font-size: 20upx;
						font-weight: 200;
						color: rgba(151, 151, 151, 1);
					}
				}
			}

			&:nth-of-type(1) {
				.right-items-left {
					text {
						&:nth-of-type(1) {
							font-size: 34upx;

							color: rgba(34, 34, 34, 1);
						}
					}
				}
			}

			.iconfont {
				margin-top: 30upx;
				margin-right: 40upx;
			}
		}
	}

	.capacity-item-right {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
}

.capacity-item3 {
	display: flex;

	height: 116upx;

	.step {
		box-sizing: border-box;
		padding-top: 20upx;
		width: 219upx;

		.iconfont {
			font-size: 75upx;
			color: #fd2316;
			text-align: center;
		}
	}

	.capacity-item-right {
		box-sizing: border-box;
		padding-right: 40upx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		text {
			&:nth-of-type(2) {
				margin-left: 54upx;
				font-size: 20upx;
				font-weight: 200;
				color: rgba(151, 151, 151, 1);
			}
		}
	}
}

.title {
	padding-left: 48upx;
	margin-top: 30upx;
	margin-bottom: 10upx;
	box-sizing: border-box;
	font-size: 20upx;
	font-weight: 200;
	color: rgba(151, 151, 151, 1);
}

.visa {
	margin-top: 0;
	height: 372upx;

	.right-items {
		height: 68upx;

		.right-items-left {
			text {
				margin-top: 15upx;
			}
		}
	}

	.more {
		width: 100%;
		text-align: right;
		font-size: 20upx;
		box-sizing: border-box;
		padding-right: 46upx;
		font-weight: 200;
		margin-top: 20upx;
		color: rgba(151, 151, 151, 1);
	}
}

.broder-none {
	border: 0px !important;
}
// 安全域兼容样式
page {
	--safe-area-inset-top: 0px;
	--safe-area-inset-right: 0px;
	--safe-area-inset-bottom: 0px;
	--safe-area-inset-left: 0px;

	@supports (top: constant(safe-area-inset-top)) {
		--safe-area-inset-top: constant(safe-area-inset-top);
		--safe-area-inset-right: constant(safe-area-inset-right);
		--safe-area-inset-bottom: constant(safe-area-inset-bottom);
		--safe-area-inset-left: constant(safe-area-inset-left);
	}

	@supports (top: env(safe-area-inset-top)) {
		--safe-area-inset-top: env(safe-area-inset-top);
		--safe-area-inset-right: env(safe-area-inset-right);
		//--safe-area-inset-bottom: 12px;
		--safe-area-inset-bottom: env(safe-area-inset-bottom);
		--safe-area-inset-left: env(safe-area-inset-left);
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
	box-sizing: border-box;
	align-content: flex-start;
	flex-wrap: wrap;
	.box-item {
		// float: left;
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
