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
import UploadLoading from '@/components/uploadLoading/uploadLoading.vue';
import { getAccessToken } from '@/common/api/mine.js';
import { printFileUpload } from '@/common/api/index.js';

export default {
	components: { Tabs, UploadLoading },
	data() {
		return {
			tabList: [
				{
					title: '微信卡包',
					desc: '从微信卡包添加发票',
					icon: 'iconzu9'
				},
				{
					title: '微信文件',
					desc: '从微信聊天记录选择发票',
					icon: 'iconzu7'
				}
			],
			showUpLoading: false
		};
	},
	methods: {
		/**
		 * 点击选项卡
		 * @param {Object} index 索引
		 */
		toContent(index) {
			if (index) {
				// 选择微信聊天记录文件
				wx.chooseMessageFile({
					count: 5,
					type: 'file',
					success: res => {
						const fileType = ['pdf', 'pdfx'];
						for (const el of res.tempFiles) {
							if (
								!fileType.includes(
									el.name.substring(el.name.lastIndexOf('.') + 1)
								)
							) {
								this.showMessage('文件格式只支持PDF');
								return;
							}
						}
						this.uploadFile(res.tempFiles);
					}
				});
			} else {
				// 选择微信发票
				uni.chooseInvoice({
					success: res => {
						const invoiceInfo = JSON.parse(res.invoiceInfo);
						if (invoiceInfo && invoiceInfo.length > 5) {
							this.showMessage('选择发票数量不能超过五张');
							return;
						}
						this.uploadInvoice(invoiceInfo);
					}
				});
			}
		},

		/**
		 * 上传发票
		 * @param {Object} invoiceInfo
		 */
		async uploadInvoice(invoiceInfo) {
			try {
				this.showUpLoading = true;
				let result = '';
				const token = await getAccessToken();
				for (let el of invoiceInfo.values()) {
					const [err, res] = await uni.request({
						url: `https://api.weixin.qq.com/card/invoice/reimburse/getinvoiceinfo?access_token=${token}`,
						method: 'POST',
						data: {
							card_id: el.card_id,
							encrypt_code: el.encrypt_code
						}
					});
					if (res && res.data.errcode === 0) {
						const [downloadErr, downloadRes] = await uni.downloadFile({
							url: res.data.user_info.pdf_url
						});
						if (downloadRes.tempFilePath) {
							let params = { upload_type: 2, scene: 2 };
							if (result.order_no) {
								params.order_no = result.order_no;
							}
							params.reset_file_name = `${res.data.payee}.pdf`;
							result = await printFileUpload(downloadRes.tempFilePath, params);
						}
					}
				}
				uni.navigateTo({
					url: `/pages/index/filePrint/order/order?orderNo=${result.order_no}&orderType=4`
				});
			} catch (e) {
				this.showMessage(e.msg);
			} finally {
              this.showUpLoading = false;
            }
		},

		/**
		 * 上传文件
		 * @param {Object} data	 上传文件
		 */
		async uploadFile(data) {
			this.showUpLoading = true;
			let params = { upload_type: 2, scene: 2 };
			try {
				let result = '';
				for (let el of data) {
					if (result.order_no) {
						params.order_no = result.order_no;
					}
					params.reset_file_name = el.name;
					result = await printFileUpload(el.path, params);
				}
				this.showUpLoading = false;
				uni.navigateTo({
					url: `/pages/index/filePrint/order/order?orderNo=${result.order_no}&orderType=4`
				});
			} catch (e) {
				this.showMessage(e.msg);
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
