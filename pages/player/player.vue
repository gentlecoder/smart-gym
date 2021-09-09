<template>
	<web-view :webview-styles="webviewStyles" :src="playUrl"></web-view>
</template>

<script>
	// var wv;//计划创建的webview
	export default {
		// onReady() {
		// 	// #ifdef APP-PLUS
		// 	var currentWebview = this.$scope
		// 	.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
		// 	setTimeout(function() {
		// 		wv = currentWebview.children()[0]
		// 		wv.setStyle({
		// 			top: 150,
		// 			height: 300
		// 		})
		// 	}, 1000); //如果是页面初始化调用时，需要延时一下
		// 	// #endif
		// },
		data() {
			return {
				playUrl: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.playUrl = this.vuex_liveVideoPlayUrl + '?title=' + option.title + '&videoUrl=' + option.videoUrl
		},
		methods: {},
		mounted() {}
	}
</script>

<style>
</style>
