<template>
	<view class="index-content">
		<view class="index-content-header">
			<u-input class="select-region-input" v-model="region" type="select" border
				@click="showRegionSelect = true" />
			<u-picker v-model="showRegionSelect" mode="region" @confirm="handleSelectRegion"></u-picker>

			<u-search :show-action="true" action-text="搜索" :animation="true"></u-search>

			<u-icon class="check-ball-park-btn" name="map" size="50" @click="goToBallParkMap"></u-icon>
		</view>
		<scroll-view class="scroll-view moyi-te-a" @touchstart="cosmosMod.touchstart" @touchmove="cosmosMod.touchmove"
			:change:prop="cosmosMod.end" :prop="cosmos.propValue" @touchend="cosmosMod.touchend"
			:data-top="cosmos.scrollTop" id="cosmos-refresh-container" scroll-y upper-threshold="50">
			<view id="load-text" :style="'height:' + base.CustomBar + 'px'"
				class="load-text anim-text-lePeek text-center text-gray">
				<text class="anim-text" v-for="(item, index) in base.title" :key="index"
					:style="'animation-delay:' + (200 + index * 100) + 'ms;'">{{ item }}</text>
			</view>

			<view @tap="goToGameDetail(index)" class="cosmos-chat text-grey" v-for="(item, index) in cosmosList"
				:key="index">
				<view class="flex margin-tb padding-lr-xls">
					<view @tap.stop="" @tap="userOpen(index)" class="cu-avatar round lg"
						:style="'background-image:url(' + item.avatar + ');'">
						<image :src="item.frame" mode="widthFix"></image>
					</view>
					<view class="margin-auto padding-lr-sm">
						<text class="padding-right-sm ">{{ item.nickname }}</text>
						<text
							:class="['text-bold', item.gender == 0 ? 'text-pink  cuIcon-female' : 'text-blue  cuIcon-male']"></text>
					</view>
					<view class="flex-sub margin-auto"></view>

					<view class="flex cosmos-time">
						<view class="text-grey ">{{ $common.timeToDate(item.createtime) }}</view>
					</view>
				</view>
				<view class="cu-item cosmos-text margin-bottom-sm">{{ item.text }}</view>
				<view class="padding-lr-xls" @tap.stop="">
					<view :class="['grid', 'margin-auto', item.images_arr.length == 1 ? '' : 'col-3 grid-square']"
						v-if="item.images">
						<view @tap="previews(item.images_arr, indexs)" class="margin-tb-sm cosmos-image-item"
							v-for="(items, indexs) in item.images_arr" :key="indexs">
							<image lazy-load class="cosmos-image-item-image" :src="items" mode="aspectFill"></image>
						</view>
					</view>
					<view :class="['grid', 'margin-auto']" v-if="item.videoUrl">
						<view @tap="previews(item.images_arr, indexs)" class="margin-tb-sm cosmos-image-item">
							<!-- 							<video id="myVideo"
								src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"
								@error="videoErrorCallback" controls></video> -->
							<video style="z-index: 999;" :id="'video' + index" :src="item.videoUrl"
								@error="videoErrorCallback" controls></video>
						</view>
					</view>
				</view>
				<view class="padding-lr-xls grid col-4 border-bottom text-center">
					<view>
						<text class="cuIcon-attention text-xl"></text>
						<text class="margin-left-ss">{{ item.views > 0 ? item.views : '' }}</text>
					</view>
					<view>
						<text class="cuIcon-comment text-xl"></text>
						<text class="margin-left-ss">{{ item.reviews > 0 ? item.reviews : '' }}</text>
					</view>
					<view @tap.stop="" @tap="like(index)">
						<text :class="item.isLike ? 'cuIcon-likefill text-red' : 'cuIcon-like'"></text>
						<text class="margin-left-ss">{{ item.likes > 0 ? item.likes : '' }}</text>
					</view>
					<view @tap.stop=""><text class="cuIcon-more text-xl" @tap="cosmosMoreOperate(index)"></text></view>
				</view>
				<view class="cosmos-border"></view>
			</view>

			<view id="more-text" class="text-center text-white margin-auto">加载中...</view>
		</scroll-view>
		<u-tabbar :list="vuex_tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showRegionSelect: false,
				region: '南京',
				moreData: {
					show: false,
					type: 'cosmos',
					id: 0
				},
				modalName: null,
				base: {
					// avatar: this.$config.avatar,
					CustomBar: this.CustomBar,
					// title: this.$config.title
				},
				operate: {
					id: 1
				},
				preview: {
					list: ['https://image.aishencn.com/2020/03/17/095817937_81909778-bbs.jpg'],
					show: false,
					index: 0
				},
				cosmos: {
					scrollTop: 0,
					propValue: true,
					loadMore: false
				},
				cosmosList: [],
				cosmosMode: 'hot',
				tabScroll: 0,
				currentTab: 0,
				tabScrollItem: 0,
				currentTabItem: 0
			}
		},
		onLoad() {

		},
		created() {
			if (this.cosmosList.length == 0) {
				this.cosmosGetList();
			}
		},
		methods: {
			handleSelectRegion(v) {
				this.region = v.area.label
			},
			goToBallParkMap() {
				this.$u.route('/pages/map/ballParkMap');
			},
			// switchMode(mode = 'new') {
			// 	if (this.cosmosMode != mode) {
			// 		this.$api.getCosmosList({
			// 			mode: mode,
			// 		}, res => {
			// 			if (res.code) {
			// 				this.cosmosList = res.data;
			// 				this.cosmos.propValue = !this.cosmos.propValue;
			// 			} else {
			// 				this.$common.errorToShow('空空如也');
			// 			}
			// 		});
			// 	}
			// 	this.cosmosMode = mode
			// },
			like(index) {
				// this.cosmosList[index].isLike = !this.cosmosList[index].isLike;
				// this.$api.cosmosLike({
				// 		pid: this.cosmosList[index].id
				// 	},
				// 	res => {
				// 		if (res.code) {
				// 			this.cosmosList[index].isLike = res.data;
				// 			if (res.data) {
				// 				this.cosmosList[index].likes++;
				// 			} else {
				// 				this.cosmosList[index].likes--;
				// 			}
				// 		}
				// 	}
				// );
			},
			userOpen(index) {
				// this.$db.set('user', this.cosmosList[index]);
				// uni.navigateTo({
				// 	url: '/pages/user/index'
				// });
			},
			previews(list, index) {
				this.preview.index = index;
				this.preview.list = list;
				this.preview.show = !this.preview.show;
			},
			// puls() {
			// 	uni.navigateTo({
			// 		url: '/pages/cosmos/push'
			// 	});
			// },
			cosmosMoreOperate(id) {
				this.moreData.show = !this.moreData.show;
			},

			cosmosGetList(id) {
				// this.$api.getCosmosList({
				// 		id: id,
				// 		mode: this.cosmosMode,
				// 	},
				// 	res => {
				// 		if (res.code) {
				// 			this.cosmosList = [...this.cosmosList, ...res.data];
				// 			this.cosmos.loadMore = true;
				// 		}
				// 	}
				// );
				this.cosmosList = [{
						"id": 2439419,
						"user_id": 1,
						"age": 0,
						"gender": 0,
						"zodiac": 0,
						"flag": "",
						"secret": "all",
						"place": "麦哲伦星云",
						"views": 217,
						"likes": 1,
						"reviews": 0,
						"shares": 0,
						"text": "646465",
						"images": "",
						"weigh": 0,
						"collect": 0,
						"third_id": 0,
						"latitude": "0.000000",
						"longitude": "0.000000",
						"createtime": 1626757027,
						"updatetime": 1626757027,
						"deletetime": null,
						"status": "normal",
						"nickname": "dyctest",
						"avatar": "https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg",
						"bio": "士大夫11萨德1",
						"frame": "",
						"isLike": false,
						"like": [{
							"id": 953,
							"pid": 2439419,
							"user_id": 1,
							"createtime": 1626758380,
							"updatetime": 1626758380,
							"deletetime": null,
							"status": "normal",
							"status_text": "正常"
						}],
						"images_arr": [],
						"videoUrl": "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4 "
					}, 
					{
						"id": 2439422,
						"user_id": 1,
						"age": 0,
						"gender": 0,
						"zodiac": 0,
						"flag": "",
						"secret": "all",
						"place": "麦哲伦星云",
						"views": 144,
						"likes": 0,
						"reviews": 0,
						"shares": 0,
						"text": "333666999",
						"images": "https://www.google.com.hk/imgres?imgurl=http%3A%2F%2Fimage.biaobaiju.com%2Fuploads%2F20180211%2F01%2F1518284655-tbVFsHcGLN.jpg&imgrefurl=https%3A%2F%2Fwww.biaobaiju.com%2Fhongnvhaizi%2F15044.html&tbnid=SYt3rRVFBiUsRM&vet=12ahUKEwi_zM6Gi5XyAhXBwYsBHUhDAs8QMygXegUIARDLAQ..i&docid=1L9Y42hFgZZkjM&w=640&h=1136&q=%E5%9B%BE%E7%89%87&ved=2ahUKEwi_zM6Gi5XyAhXBwYsBHUhDAs8QMygXegUIARDLAQ",
						"weigh": 0,
						"collect": 0,
						"third_id": 0,
						"latitude": "0.000000",
						"longitude": "0.000000",
						"createtime": 1627030112,
						"updatetime": 1627030112,
						"deletetime": null,
						"status": "normal",
						"nickname": "dyctest",
						"avatar": "https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg",
						"bio": "士大夫11萨德1",
						"frame": "",
						"isLike": false,
						"like": [

						],
						"images_arr": [
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210723\/074d9a0e1dd48b4477e59830f6c5df79.jpg"
						]
					},
					{
						"id": 2439421,
						"user_id": 1,
						"age": 0,
						"gender": 0,
						"zodiac": 0,
						"flag": "",
						"secret": "all",
						"place": "麦哲伦星云",
						"views": 188,
						"likes": 0,
						"reviews": 0,
						"shares": 0,
						"text": "测试1",
						"images": "https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/d50a9261b4b03a7b9b2383381f2387a6.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/662dc58680df3aa14241ec473dde3e49.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/02aca9498f0a7b2dcdbe1cb6a04fd100.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/6bbad06d3c2c34f89125f06493bc6912.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/67bfab435014d391bbe31d3395c0434c.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/cb78341520b7a70cd98a9ddf07d6e769.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/db49f741d9a8f8a96dfc97767e2ee072.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/e353b16205fd045664d4e77cc25a65a4.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/581f6e4e47f2611c8a83898f371f1c33.jpg",
						"weigh": 0,
						"collect": 0,
						"third_id": 0,
						"latitude": "0.000000",
						"longitude": "0.000000",
						"createtime": 1626760546,
						"updatetime": 1626760546,
						"deletetime": null,
						"status": "normal",
						"nickname": "dyctest",
						"avatar": "https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg",
						"bio": "士大夫11萨德1",
						"frame": "",
						"isLike": false,
						"like": [

						],
						"images_arr": [
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/d50a9261b4b03a7b9b2383381f2387a6.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/662dc58680df3aa14241ec473dde3e49.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/02aca9498f0a7b2dcdbe1cb6a04fd100.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/6bbad06d3c2c34f89125f06493bc6912.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/67bfab435014d391bbe31d3395c0434c.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/cb78341520b7a70cd98a9ddf07d6e769.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/db49f741d9a8f8a96dfc97767e2ee072.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/e353b16205fd045664d4e77cc25a65a4.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/581f6e4e47f2611c8a83898f371f1c33.jpg"
						]
					},
					{
						"id": 2439420,
						"user_id": 1,
						"age": 0,
						"gender": 0,
						"zodiac": 0,
						"flag": "",
						"secret": "all",
						"place": "麦哲伦星云",
						"views": 191,
						"likes": 1,
						"reviews": 3,
						"shares": 0,
						"text": "",
						"images": "https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg",
						"weigh": 0,
						"collect": 0,
						"third_id": 0,
						"latitude": "0.000000",
						"longitude": "0.000000",
						"createtime": 1626760294,
						"updatetime": 1626760294,
						"deletetime": null,
						"status": "normal",
						"nickname": "dyctest",
						"avatar": "https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg",
						"bio": "士大夫11萨德1",
						"frame": "",
						"isLike": false,
						"like": [{
							"id": 961,
							"pid": 2439420,
							"user_id": 1,
							"createtime": 1627515773,
							"updatetime": 1627515773,
							"deletetime": null,
							"status": "normal",
							"status_text": "正常"
						}],
						"images_arr": [
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210720\/b5330a5712991d5ad21d1c4717656679.jpg"
						]
					},
					{
						"id": 2439418,
						"user_id": 1,
						"age": 0,
						"gender": 0,
						"zodiac": 0,
						"flag": "",
						"secret": "all",
						"place": "麦哲伦星云",
						"views": 575,
						"likes": 1,
						"reviews": 1,
						"shares": 0,
						"text": "",
						"images": "https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210706\/990ef7bb5426606ed61d077f36311998.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210706\/990ef7bb5426606ed61d077f36311998.jpg",
						"weigh": 0,
						"collect": 0,
						"third_id": 0,
						"latitude": "0.000000",
						"longitude": "0.000000",
						"createtime": 1625501645,
						"updatetime": 1625501645,
						"deletetime": null,
						"status": "normal",
						"nickname": "dyctest",
						"avatar": "https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg",
						"bio": "士大夫11萨德1",
						"frame": "",
						"isLike": false,
						"like": [{
							"id": 951,
							"pid": 2439418,
							"user_id": 1,
							"createtime": 1626708906,
							"updatetime": 1626708906,
							"deletetime": null,
							"status": "normal",
							"status_text": "正常"
						}],
						"images_arr": [
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210706\/990ef7bb5426606ed61d077f36311998.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210706\/990ef7bb5426606ed61d077f36311998.jpg"
						]
					},
					{
						"id": 2439417,
						"user_id": 1,
						"age": 0,
						"gender": 0,
						"zodiac": 0,
						"flag": "",
						"secret": "all",
						"place": "麦哲伦星云",
						"views": 583,
						"likes": 1,
						"reviews": 10,
						"shares": 0,
						"text": "山东传媒职业学院播音主持系戏剧表演专业毕业大戏即将开演，敬请期待！！",
						"images": "https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210705\/a444dffd1424dd1267d19a56a3442ff0.jpg,https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210705\/079213527876d63bafa8fcf76f0bd23c.jpg",
						"weigh": 0,
						"collect": 0,
						"third_id": 0,
						"latitude": "0.000000",
						"longitude": "0.000000",
						"createtime": 1625474086,
						"updatetime": 1625474086,
						"deletetime": null,
						"status": "normal",
						"nickname": "dyctest",
						"avatar": "https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg",
						"bio": "士大夫11萨德1",
						"frame": "",
						"isLike": false,
						"like": [{
							"id": 957,
							"pid": 2439417,
							"user_id": 1,
							"createtime": 1627356824,
							"updatetime": 1627356824,
							"deletetime": null,
							"status": "normal",
							"status_text": "正常"
						}],
						"images_arr": [
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210705\/a444dffd1424dd1267d19a56a3442ff0.jpg",
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210705\/079213527876d63bafa8fcf76f0bd23c.jpg"
						]
					},
					{
						"id": 2439416,
						"user_id": 1,
						"age": 0,
						"gender": 0,
						"zodiac": 0,
						"flag": "",
						"secret": "all",
						"place": "麦哲伦星云",
						"views": 540,
						"likes": 1,
						"reviews": 3,
						"shares": 0,
						"text": "欢迎使用菁彩山传树洞",
						"images": "https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210705\/92296f8bbd02d7a6c56039071eb2b559.jpg",
						"weigh": 0,
						"collect": 0,
						"third_id": 0,
						"latitude": "0.000000",
						"longitude": "0.000000",
						"createtime": 1625474024,
						"updatetime": 1625474024,
						"deletetime": null,
						"status": "normal",
						"nickname": "dyctest",
						"avatar": "https://img-pre.ivsky.com/img/tupian/pre/201402/18/pikachu.jpg",
						"bio": "士大夫11萨德1",
						"frame": "",
						"isLike": false,
						"like": [{
							"id": 952,
							"pid": 2439416,
							"user_id": 1,
							"createtime": 1626708930,
							"updatetime": 1626708930,
							"deletetime": null,
							"status": "normal",
							"status_text": "正常"
						}],
						"images_arr": [
							"https:\/\/moyioss.oss-cn-shanghai.aliyuncs.com\/uploads\/20210705\/92296f8bbd02d7a6c56039071eb2b559.jpg"
						]
					}
				]
			},
			goToGameDetail(index) {
				// this.$db.set('cosmos', this.cosmosList[index]);
				// uni.navigateTo({
				// 	url: '/pages/cosmos/details'
				// });
			},
			cosmosTrigger(i) {
				switch (i) {
					case 0:
						// 松开刷新
						break;
					case 1:
						// 触发刷新
						this.cosmosGetList()
						this.cosmos.propValue = !this.cosmos.propValue;
						// this.$api.getCosmosList({}, res => {
						// 	if (res.code) {
						// 		this.cosmosList = res.data;
						// 		this.cosmos.propValue = !this.cosmos.propValue;
						// 	} else {
						// 		this.$common.errorToShow('空空如也');
						// 	}
						// });
						break;
					case 2:
						// const query = uni.createSelectorQuery().in(this);
						// query
						// 	.select('#more-text')
						// 	.boundingClientRect(data => {
						// 		if (data.top < 1500) {
						// 			if (this.cosmos.loadMore) {
						// 				this.cosmos.loadMore = false;
						// 				this.cosmosGetList(this.cosmosList.length ? this.cosmosList[this.cosmosList
						// 					.length - 1].id : 0);
						// 			}
						// 		}
						// 	})
						// 	.exec();
						break;
					case 3:
						//
						// if (this.cosmos.loadMore) {
						// 	this.cosmos.loadMore = false;
						// 	this.cosmosGetList(this.cosmosList[this.cosmosList.length - 1].id);
						// }
						// this.cosmosList[this.cosmosList.length-1];

						// console.log('开始预加载',this.cosmosList[this.cosmosList.length-1])
						break;

					default:
						break;
				}
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
		}
	}
</script>

<script module="cosmosMod" lang="wxs">
	var startY = 0;
	var startX = 0;
	var top = 0;
	var code = 0;
	var mit = 0;

	function touchstart(event, ins) {
		top = 0;
		if (code == 0) {
			mit = 0;
			ins.callMethod('cosmosTrigger', 2);
			var touch = event.touches[0] || event.changedTouches[0]
			startY = touch.pageY
			startX = touch.pageX
		}
	}

	function end(newValue, oldValue, ownerInstance, instance) {
		console.log('cosmos-refresh-container end')
		ownerInstance.selectComponent('#cosmos-refresh-container').setStyle({
			'transform': 'translateY(0)',
			'transition': 'ease 0.3s'
		})
		ownerInstance.selectComponent('#load-text').removeClass('anim-text-infinite')

		ownerInstance.selectComponent('#load-text').setStyle({
			'transform': 'scale(0)'
		})

		code = 0
	}

	function touchend(event, ins) {
		if (code == 0) {
			if (top < 140) {
				ins.selectComponent('#cosmos-refresh-container').setStyle({
					'transform': 'translateY(0)',
					'transition': 'ease 0.3s'
				})

				ins.selectComponent('#load-text').setStyle({
					'transform': 'scale(0)'
				})
			} else {
				ins.selectComponent('#load-text').setStyle({
					'transform': 'scale(1)'
				})
				ins.callMethod('cosmosTrigger', 1);
				code = 1
				ins.selectComponent('#cosmos-refresh-container').setStyle({
					'transform': 'translateY(60px)',
					'transition': 'ease 0.3s',
					'padding-bottom': '60px',
				})
				ins.selectComponent('#load-text').addClass('anim-text-infinite')

			}
		} else {

		}


	}

	function touchmove(event, ins) {
		if (code == 0) {
			var touch = event.touches[0] || event.changedTouches[0]
			var pageY = touch.pageY
			var pageX = touch.pageX
			var vew = ins.selectComponent('#cosmos-refresh-container')
			var dataset = vew.getDataset();
			top = pageY - startY
			var lr = pageX - startX
			if (dataset.top == 0) {
				if (top > 140) {
					if (mit == 0) {
						ins.callMethod('cosmosTrigger', 0);
					}
					mit = 1
				}
				vew.setStyle({
					'transform': 'translateY(' + (top) + 'px)',
					'padding-bottom': top + 'px',
				})
				ins.selectComponent('#load-text').setStyle({
					'transform': 'scale(' + (top > 100 ? 1 : top / 100) + ')'
				})
			} else {
				startY = pageY
			}
		}
	}
	module.exports = {
		end: end,
		touchend: touchend,
		touchstart: touchstart,
		touchmove: touchmove,
	}
</script>

<style lang="scss" scoped>
	.index-content {

		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: center;
		// padding: 40rpx;
		.index-content-header {
			display: flex;
			margin: 20rpx;

			.select-region-input {
				width: 200rpx;
				margin-right: 20rpx;
			}

			.check-ball-park-btn {
				margin-left: auto;
			}
		}
	}
</style>
