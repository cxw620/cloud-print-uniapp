<template>
	<view class="loading" catchtouchmove="true">
		    <view>
		        <view><image :src="require('@/static/img/file_load.png')"></view>
		        <view><image :src="require('@/static/img/progress.gif')"></view>
		        <view>文件加密上传中</view>
		    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
	height: 100vh;
  background-color: rgba(15, 12, 11, 0.67);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30upx;
  font-weight: 600;
	z-index: 999;

  & > view {
    text-align: center;

    & > view {
      &:nth-child(1) {
        image {
          width: 136upx;
          height: 175upx;
        }
      }

      &:nth-child(2) {
        margin-top: 50upx;
        margin-bottom: 90upx;

        image {
          width: 510upx;
          height: 20upx;
        }
      }
    }
  }
}
</style>
