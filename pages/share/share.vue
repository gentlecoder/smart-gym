<template>
	<view class="share-container">
		<view class="cu-card case" :style="'padding-top:'+CustomBar+'px'">
			<view class="cu-item shadow padding-bottom-sm">
				<view class="cu-form-group my-textarea">
					<textarea maxlength="500" @input="textareaAInput" placeholder="说点什么吧"></textarea>
				</view>
				<view class="grid col-4 grid-square flex-sub padding-lr-sm">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage"
						:data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<imgCount">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-item shadow">
				<view class="cu-form-group">
					<picker @change="PickerChange" data-list="secret" :value="secretIndex" :range="secretList">
						<view class="">
							{{secretIndex>-1?secretList[secretIndex]:'其他'}}
						</view>
					</picker>
				</view>
			</view>

			<view class="cu-item shadow">
				<view class="cu-form-group">
					<picker @change="PickerChange" data-list="notice" :value="noticeIndex" :range="noticeList">
						<view class="">
							{{noticeIndex>-1?noticeList[noticeIndex]:'其他'}}
						</view>
					</picker>
				</view>
			</view>

			<!-- 	<view class="cu-item shadow ">
				<view class="cu-form-group">
					<button @click="subscrib()">点击订阅</button>
				</view>
			</view>
			 -->
		</view>

		<view class="bottom-card">
			<view class="cu-btn radius" @tap="startPush()">
				<text class="padding-tb-sm">发布帖子</text>
			</view>
		</view>
		<u-tabbar :list="vuex_tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollLeft: 0,
				CustomBar: this.CustomBar,
				textareaAValue: '',
				imgList: [],
				imgCount: 9,
				// 隐私设置列表
				secretList: ['动态公开'],
				secretLists: ['all'],
				secretIndex: 0,

				noticeList: ['订阅回复', '无须通知'],
				noticeLists: ['replyNotice', 'noNotice'],
				noticeIndex: 0,
				// Reply notice



				loadTitle: '请稍后',
				formData: {
					images: '',
					text: '',
					secret: 'all',
					flag: '',
				}
			}
		},
		methods: {
			startPush() {
				let imgList = this.imgList;
				let images = '';
				let cdn = this.$config.cdnUrl;
				let total = 0;
				if (!this.textareaAValue && !imgList.length) {
					this.$common.errorToShow('无须多言？');
					return
				}

				// #ifdef MP-WEIXIN
				if (this.$db.get('subscribe', true, 0) != 2) {
					let tmplIds = this.$db.get('subscribe_reply_notice');
					uni.requestSubscribeMessage({
						tmplIds: [tmplIds],
						success: (res) => {
							if (res[tmplIds] == 'accept') {
								this.$db.set('subscribe', 1)
							} else {
								this.$db.set('subscribe', 2)
							}
						}
					})
				}
				// #endif


				uni.showLoading({
					title: this.loadTitle
				})
				if (imgList.length) {
					for (var i = 0; i < imgList.length; i++) {
						// console.log('外i'+i);
						this.$api.uploadFile(imgList[i], (res) => {
							console.log('内total' + total);
							if (res.code == 1) {
								if (total) images = images + ',';
								images = images + cdn + res.data.url
								total++;
								this.loadTitle = '正在上传' + total;
								if (total == imgList.length) {
									this.formData.images = images;
									this.sendPush();
								}
							} else {
								this.errorPush(res.msg)
							}
						}, (error) => {
							this.errorPush(error.response)
						})
					}
				} else {
					this.sendPush();
				}
			},
			sendPush() {
				this.formData.text = this.textareaAValue
				this.formData.secret = this.secretLists[this.secretIndex];
				this.$api.cosmosPush(this.formData, (res) => {
					console.log('res', res);
					this.$common.errorToShow(res.msg)
					if (res.code) {
						setTimeout(() => {
							uni.navigateBack({})
						}, 300);
					}
				})
				// console.log('正准备', this.formData);
			},
			errorPush(msg) {
				this.$common.errorToShow(msg);
			},
			PickerChange(e) {
				switch (e.target.dataset.list) {
					case 'secret':
						this.secretIndex = e.detail.value
						break;
					default:
						this.$db.set('subscribe', Number(e.detail.value) + 1)
						this.noticeIndex = e.detail.value
						// 订阅 通知  
						break;
				}
			},
			subscrib() {
				// let sub = ;
				// console.log('sub',sub)

				// return
				// // 
				// let tmplIds = this.$db.get('subscribe_reply_notice');
				// // console.log('start_subscrib')
				// // uni.requestSubscribeMessage({
				// //   tmplIds: [tmplIds],
				// //   success (res) { 
				// // 	  console.log('res',res)
				// //   }
				// // })

				// // return
				// if(tmplIds){
				// 	uni.requestSubscribeMessage({
				// 	  tmplIds: [tmplIds],
				// 	  success (res) { 
				// 		// 'accept'、'reject'、'ban'
				// 		console.log(res[tmplIds]);
				// 	  }
				// 	})
				// }

			},
			textareaAInput(e) {
				this.textareaAValue = e.detail.value
			},
			ChooseImage() {
				// this.copns
				uni.chooseImage({
					count: this.imgCount,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},

		},
		onLoad(e) {
			if (this.$db.get('subscribe', true, 0) == 2) {
				this.noticeIndex = 1;
			}
		}
	}
</script>

<style>
	.share-container {
		height: calc(100vh - 84rpx);
	}

	.cu-card {
		height: 100vh;
	}

	.my-textarea {
		min-height: 4.6em;
		max-height: 9.2em;
	}
</style>
