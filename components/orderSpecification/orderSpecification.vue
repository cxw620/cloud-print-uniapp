<template>
	<view>

	</view>
</template>

<script>
export default {
	props: {
		dataSpecification: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {};
	},
	watch: {
		dataSpecification(val) {}
	},
	methods: {
		//色彩选择
		btnColourType(index) {
			this.dataSpecification.colourType = index;
		},
		//单双面
		btnSurfaceType(index) {
			this.dataSpecification.surfaceType = index;
		},
		//切换全部
		btnScopeType() {
			this.dataSpecification.scopeType = !this.dataSpecification.scopeType;
		},
		//加减分数
		btnCopies(index) {
			if (index === 1) {
				if (this.dataSpecification.copies !== 1) {
					this.dataSpecification.copies = this.dataSpecification.copies - 1;
				}
			} else {
				this.dataSpecification.copies = this.dataSpecification.copies + 1;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.property {
	box-sizing: border-box;
	padding-left: 52upx;
	padding-right: 44upx;
	padding-top: 26upx;
	border-bottom: 1px solid rgba(226, 225, 225, 1);
	.property-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24upx;
		font-weight: 200;
		color: rgba(35, 35, 35, 1);
		margin-bottom: 26upx;
		.data {
			display: flex;
			align-items: center;
			.data-radio {
				display: flex;
				align-items: center;
				&:nth-of-type(1) {
					margin-right: 28upx;
				}
				.data-radio-box {
					width: 25upx;
					height: 25upx;
					border: 1px solid rgba(228, 228, 228, 1);
					border-radius: 6upx;
					opacity: 1;
					margin-right: 8upx;
				}
			}
			.data-all {
				width: 86upx;
				height: 32upx;
				text-align: center;
				background: rgba(255, 255, 255, 1);
				border: 2upx solid rgba(228, 228, 228, 1);
				border-radius: 6upx;
				font-size: 24upx;
				font-weight: 200;
				line-height: 32upx;
				color: rgba(15, 12, 11, 1);
				margin-right: 44upx;
			}
			.data-sel {
				display: flex;
				align-items: center;
				input {
					display: block;
					width: 56upx;
					height: 32upx;
					line-height: 32upx;
					background: rgba(255, 255, 255, 1);
					border: 2upx solid rgba(228, 228, 228, 1);
					opacity: 1;
					border-radius: 6upx;
					// min-height: 32upx !important;
					padding-left: 10upx;
					padding-right: 10upx;
					box-sizing: border-box;
					margin-left: 6upx;
					margin-right: 6upx;
				}
			}
			.data-btns {
				font-size: 50upx;
				font-weight: 500;
				color: rgba(253, 35, 22, 1);
			}
			.data-number {
				display: block;
				width: 56upx;
				height: 32upx;
				background: rgba(255, 255, 255, 1);
				border: 2upx solid rgba(228, 228, 228, 1);
				opacity: 1;
				border-radius: 6upx;
				// min-height: 32upx;
				padding-left: 10upx;
				padding-right: 10upx;
				box-sizing: border-box;
				margin-left: 6upx;
				margin-right: 6upx;
			}
		}
	}
}
</style>
