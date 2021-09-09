<template>
	<view>
		<view @click="play('http://192.168.2.157:8899/1.html')">Play video!</view>
		<u-tabbar :list="vuex_tabbar" :mid-button="true"></u-tabbar>
		<!-- <video id="myVideo" src="http://47.101.195.206:8888/live/34020000001320000001@34020000001320000001.flv" @error="videoErrorCallback" controls></video> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			play(videoUrl) {
				this.$u.route('/pages/player/player', {
					videoUrl,
					title: 'xx球场xx比赛直播11'
				});
			}
		}
	}
</script>

<style>

</style>
