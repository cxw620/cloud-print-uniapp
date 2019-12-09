<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('/common/css/iconfont.css');
	page{
		background: #F9F9F9;
	}
	.uni-slider-handle-wrapper{
		height: 12upx !important;
	}
	.btn-class-red{
		width:100%;
		height:110upx;
		background:rgba(253,35,22,1);
		font-size:28upx;
		font-weight:200;
		text-align: center;
		line-height:110upx;
		color:rgba(255,255,255,1);
	}
	.btn-class-black{
		width:100%;
		height:110upx;
		background:rgba(173,169,169,1);
		font-size:28upx;
		font-weight:200;
		text-align: center;
		line-height:110upx;
		color:#0F0C0B;
	}

</style>
