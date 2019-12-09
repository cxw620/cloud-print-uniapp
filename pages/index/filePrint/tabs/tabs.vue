<template>
	<!-- 文档打印选项卡页面 -->
	<view class="tabs">
		<view
			v-for="(item, index) in tabList"
			:key="item.title"
			@click="toContent(index)"
		>
			<tabs :tab="item" />
		</view>
		<!-- 从其他应用转存微信打印 -->
		<view class="selector-else">
			<view class="selector-else-title">从其他应用转存微信打印</view>
			<view
				class="else-item"
				v-for="item in otherAppList"
				:key="item.title"
				@click="toOther(item.type)"
			>
				<view :class="['iconfont', item.icon, 'left-icon']" />
				<view class="item-text">
					<text>{{ item.title }}</text>
					<text>{{ item.desc }}</text>
				</view>
			</view>
		</view>
		<up-loading v-if="showUpLoading" />
	</view>
</template>
<script>
import Tabs from '@/components/tabs/tabs.vue';
import { printFileUpload } from '@/common/api/index.js';
import upLoading from '@/components/uploadLoading/uploadLoading.vue';

export default {
	components: { Tabs, upLoading },
	data() {
		return {
			showUpLoading: false,
			tabList: [
				{
					title: '微信文档打印',
					desc: '选择微信聊天文档打印',
					icon: 'iconzu11'
				},

				{
					title: '百度网盘文档打印',
					desc: '选择百度网盘大文件便捷打印',
					icon: 'iconzu2'
				},
				{
					title: '手机相册文档打印',
					desc: '选择手机相册照片文档打印',
					icon: 'iconzu4'
				}
			],
			otherAppList: [
				{
					title: 'WPS文档打印',
					desc: '选择WPS文档导入微信',
					icon: 'iconzu15',
					type: 4
				},
				{
					title: 'QQ文档打印',
					desc: '选择QQ文档导入微信',
					icon: 'iconzu21',
					type: 2
				},
				{
					title: '邮箱文档打印',
					desc: '选择邮箱内文档导入微信',
					icon: 'iconzu8',
					type: 3
				},
				{
					title: '全能扫描王文档打印',
					desc: '选择全能王文档导入微信',
					icon: 'iconzu14',
					type: 5
				}
			]
		};
	},
	methods: {
		/**
		 * 跳转内容页面
		 * @param {Object} index 选项索引
		 * 0：微信文档 1：百度网盘 2：手机自带
		 */
		toContent(index) {
			switch (index) {
				case 0:
					wx.chooseMessageFile({
						count: 5,
						type: 'file',
						success: res => {
							this.uploadFile(res.tempFiles);
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
						url: '../../selectFile/selectFile?type=print'
					});
					break;
				default:
					break;
			}
		},

		/**
		 * 跳转其他应用操作提示页面
		 * @param {Object} type  类型
		 */
		toOther(type) {
			uni.navigateTo({
				url: `../../elsedocument/elsedocument?type=${type}`
			});
		},

		/**
		 * 上传文件
		 * @param {Object} data	 上传文件
		 */
		async uploadFile(data) {
			this.showUpLoading = true;
			let params = { upload_type: 2, scene: 1 };
			try {
				let result = '';
				for (let [index, el] of data.entries()) {
					if (result.order_no) {
						params.order_no = result.order_no;
					}
					const name = el.name.substring(0, el.name.lastIndexOf('.'));
					params.reset_file_name = `${name}.pdf` || `文档${index + 1}.pdf`;
					result = await printFileUpload(el.path, params);
				}
				uni.navigateTo({
					url: `/pages/index/filePrint/order/order?orderNo=${
						result.order_no
					}&orderType=1`
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
.left-icon {
	font-size: 75upx;
	color: #fd2316;
	margin-right: 42upx;
}

.item-text {
	text {
		display: block;

		font-size: 28upx;
		font-weight: 600;
		color: rgba(34, 34, 34, 1);

		&:nth-of-type(2) {
			font-size: 20upx;
			font-weight: 200;
			color: rgba(151, 151, 151, 1);
		}
	}
}
.selector-else {
	.selector-else-title {
		font-size: 20upx;
		font-weight: 200;
		color: rgba(151, 151, 151, 1);
		padding-left: 46upx;
		box-sizing: border-box;
		margin-bottom: 10upx;
	}

	.else-item {
		width: 670upx;
		height: 116upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 4upx 4upx 20upx rgba(208, 118, 118, 0.16);
		opacity: 1;
		border-radius: 20upx;
		margin: 0 auto;
		box-sizing: border-box;
		display: flex;
		padding-left: 50upx;
		margin-bottom: 12upx;
		align-items: center;
	}
}
</style>
