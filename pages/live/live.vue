<template>
	<view class="live-container">
		<uni-list>
			<uni-list-item v-for="(item,index) in liveList" :key="index" direction="column">
				<!-- 自定义 header -->
				<view slot="header" class="live-box-header">
					<!-- <image class="slot-image" src="/static/logo.png" mode="widthFix"></image> -->
				</view>
				<!-- 自定义 body -->
				<view slot="body" class="live-box-body">
					<view @click="play(item.videoUrl)">
						<u-image width="100%" height="300rpx" :src="item.preImgUrl"></u-image>
						<view class="live-box-mask">
							<u-icon name="play-right" class="play-icon"></u-icon>
						</view>
						<view class="live-box-detail">
							<view class="live-box-detail-user">
								<u-avatar :src="item.uploaderAvatar" size="80" class="live-box-detail-avatar">
								</u-avatar>
								<text>xxxx</text>
							</view>
							<view class="live-box-detail-operation">
								<u-icon name="chat" size="50" class="live-box-detail-operation-btn"></u-icon>
								<u-icon name="zhuanfa" size="50" class="live-box-detail-operation-btn"></u-icon>
								<u-icon name="heart" size="50" class="live-box-detail-operation-btn"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<!-- 自定义 footer-->
				<view slot="footer" class="live-box-footer">
					<!-- <image class="slot-image" src="/static/logo.png" mode="widthFix"></image> -->
				</view>
			</uni-list-item>
		</uni-list>
		<u-toast ref="uToast" />
		<u-tabbar :list="vuex_tabbar"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				liveList: []
			}
		},
		methods: {
			play(videoUrl) {
				this.$u.route('/pages/player/player', {
					videoUrl,
					title: 'xx球场xx比赛直播11'
				});
			}
		},
		mounted() {
			this.$u.api.getLiveList().then(res => {
				this.liveList = res.streams.map(stream => {
					let tmp = {}
					tmp.videoUrl = this.vuex_liveVideoBaseUrl + stream.app + '/' + stream.name + '.flv'
					tmp.preImgUrl =
						'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/6acec660-4f31-11eb-a16f-5b3e54966275.jpg'
					tmp.uploaderAvatar = 'https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg'
					return tmp
				})
			}).catch(e => {
				this.$refs.uToast.show({
					title: '接口请求失败',
					type: 'error',
				})
			})
		}
	}
</script>

<style lang="scss">
	.live-container {
		height: 100vh;
		padding: 20rpx 0;
		background-color: $u-bg-color;

		.live-box-body {
			margin: 40rpx;

			.live-box-mask {
				position: absolute;
				width: 100%;
				height: calc(100% - 100rpx);
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(0, 0, 0, .5);

				.play-icon {
					font-size: 50rpx;
					color: #fff;
				}
			}

			.live-box-detail {
				padding: 0 20rpx;
				flex-direction: row;
				justify-content: space-between;
				height: 120rpx;
				background-color: #fff;

				.live-box-detail-user {
					flex-direction: row;
					align-items: center;
				}

				.live-box-detail-avatar {
					display: flex;
					align-items: center;
					margin-right: 20rpx;
				}

				.live-box-detail-operation {
					flex-direction: row;
					.live-box-detail-operation-btn {
						margin: 0 20rpx;
					}
				}

				// border: 1px solid $u-border-color;
			}
		}
	}
</style>
