<template>
	<view class="ball-park-map-container">
		<map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers"
			@markertap="clickMark" @callouttap="clickMark">
		</map>
		<view class="video-container">
			<!-- <live-player src="http://47.101.195.206:8888/live/34020000001320000001@34020000001320000001.flv" autoplay
				@statechange="statechange" @error="error" style="width: 300px; height: 225px;" /> -->
			<!-- <video src="http://vjs.zencdn.net/v/oceans.mp4" controls></video> -->
			<video src="http://47.101.195.206:8089/Panoramic-View.mp4" controls></video>
			<view class="ball-park-detail">
				<text>球场名称：{{selectedBallPark.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					id: 1, // 使用 marker点击事件 需要填写id
					name: '天安门球场1',
					width: 30,
					height: 30,
					latitude: 39.909,
					longitude: 116.39742,
					// alpha: 0.5,
					iconPath: '../../static/map-point2.png',
					callout: {
						content: '球场1',
						color: '#fff',
						bgColor: '#19be6b',
						display: 'ALWAYS',
						textAlign: 'center',
						padding: 20,
						borderRadius: 5
					}
				}, {
					id: 2,
					name: '其他球场1',
					width: 30,
					height: 30,
					latitude: 39.90,
					longitude: 116.39,
					// alpha: 0.5,
					iconPath: '../../static/map-point2.png',
					callout: {
						content: '球场2',
						color: '#fff',
						bgColor: '#fa3534',
						display: 'ALWAYS',
						textAlign: 'center',
						padding: 20,
						borderRadius: 5
					}
				}],
				selectedBallPark: {}
			}
		},
		methods: {
			clickMark(e) {
				this.selectedBallPark = this.covers.filter(cover => cover.id === e.detail.markerId)[0]
			},
			statechange(e) {
				console.log('live-player code:', e.detail.code)
			},
			error(e) {
				console.error('live-player error:', e.detail.errMsg)
			}
		}
	}
</script>

<style lang="scss">
	.ball-park-map-container {
		.video-container {
			video {
				width: 100%;
			}

			.ball-park-detail {}
		}
	}
</style>
