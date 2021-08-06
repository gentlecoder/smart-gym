<template>
	<view class="recommend-container">
		<!-- 		<u-empty mode="list">
		</u-empty> -->
		<!-- <scroll-view scroll-top="0" scroll-y="true" class="scroll-Y"> -->
			<!-- <view @tap="previews" style="display: flex;"> -->
				<video id="myVideo" src="http://vjs.zencdn.net/v/oceans.mp4" @error="videoErrorCallback" controls></video>
			<!-- </view> -->
		<!-- </scroll-view> -->
		<u-tabbar :list="vuex_tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		methods:{
			previews() {
				
			}
		}
	}
</script>

<style>
	.recommend-container {
		height: calc(100vh - 84rpx);
	}
</style>
