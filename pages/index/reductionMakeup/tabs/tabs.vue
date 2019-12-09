<template>
	<view class="tabs">
		<view
			v-for="(item, index) in tabList"
			:key="item.title"
			@click="toContent(index)"
		>
			<tabs :tab="item" />
		</view>
		<upload-loading v-if="showUpLoading" />
	</view>
</template>

<script>
import Tabs from '@/components/tabs/tabs.vue';
import uploadLoading from '@/components/uploadLoading/uploadLoading.vue';
import { zoomPrintFileUpload } from '@/common/api/index.js';

export default {
	components: { Tabs, uploadLoading },
	data() {
		return {
			showUpLoading: false,
			tabList: [],
			type: '',
			reductionList: [
				{
					title: '微信文档缩印',
					desc: '选择微信聊天文档进行缩印',
					icon: 'iconzu11'
				},
				{
					title: '百度网盘文档缩印',
					desc: '选择百度网盘文档进行缩印',
					icon: 'iconzu2'
				},
				{
					title: '手机相册文档缩印',
					desc: '选择手机文档进行缩印',
					icon: 'iconzu18'
				}
			],
			makeupList: [
				{
					title: '微信文档拼版',
					desc: '选择微信聊天文档进行拼版打印',
					icon: 'iconzu11'
				},
				{
					title: '百度网盘文档拼版',
					desc: '选择百度网盘文档进行拼版打印',
					icon: 'iconzu2'
				},
				{
					title: '手机相册文档拼版',
					desc: '选择手机相册照片文档进行拼版打印',
					icon: 'iconzu18'
				}
			]
		};
	},
	onLoad(e) {
		this.type = e.type;
		this.tabList = e.type === 'makeup' ? this.makeupList : this.reductionList;
	},
	methods: {
		toContent(index) {
			if (this.type === 'makeup') {
				uni.navigateTo({
					url: '../makeup/index/index?makeupWay=' + index
				});
			} else {
				switch (index) {
					case 0:
						wx.chooseMessageFile({
							count: 1,
							type: 'file',
							success: res => {
								this.uploadFile(res.tempFiles[0]);
							}
						});
						break;
					case 1:
						uni.navigateTo({
							url: '../baidu/baidu'
						});
						break;
					case 2:
						uni.navigateTo({
							url: '../../selectFile/selectFile?type=reduction'
						});
						break;
				}
			}
		},
		/**
		 * 上传文件
		 * @param {Object} file	 上传文件
		 */
		async uploadFile(file) {
			this.showUpLoading = true;
			try {
				const result = await zoomPrintFileUpload(file.path, {
					reset_file_name: `${file.name.substring(
						0,
						file.name.lastIndexOf('.')
					)}.pdf`
				});
				console.log(result);
				uni.navigateTo({
					url: `../reduction/index/index?orderNo=${result.order_no}`
				});
			} catch (e) {
				this.showMessage(e.msg);
			} finally {
				this.showUpLoading = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tabs {
	padding-top: 44upx;
}
</style>
