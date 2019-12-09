<template>
	<view class="tabs">
		<view
			v-for="(item, index) in tabList"
			:key="item.title"
			@click="toContent(index)"
		>
			<tabs :tab="item" />
		</view>
	</view>
</template>

<script>
import Tabs from '../../../../components/tabs/tabs.vue';
export default {
	components: { Tabs },
	data() {
		return {
			tabList: [
				{
					title: '身份证复印',
					desc: '身份证正反面快捷复印到一页纸',
					icon: 'iconzu10'
				},
				{
					title: '驾驶/行驶证复印',
					desc: '驾驶证正反面快捷复印到一页纸',
					icon: 'iconzu17'
				},
				{
					title: '银行卡复印',
					desc: '银行卡正面快捷复印到一页纸',
					icon: 'iconzu12'
				},
				{
					title: '营业执照复印',
					desc: '营业执照正面快捷复印到一页纸',
					icon: 'iconzu23'
				},
				{
					title: '证书复印',
					desc: '荣誉证书复印',
					icon: 'iconzu20'
				}
			]
		};
	},
	methods: {
		/**跳转证件复印内容
		 * @param {Object} index 缩印
		 * 0：身份证 1：驾驶/行驶证 2：银行卡 3：营业执照 4：证书
		 */
		toContent(index) {
			switch (index) {
				case 0:
					uni.navigateTo({
						url: '../idCard/idCard'
					});
					break;
					case 1:
						uni.navigateTo({
							url: '../driving/driving'
						});
						break;
						case 2:
							uni.navigateTo({
								url: '../bankCard/bankCard'
							});
							break;
							default:
							uni.navigateTo({
								url: '../elseCopy/elseCopy?index='+index
							});
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
