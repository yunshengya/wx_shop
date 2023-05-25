<template>
	<view class="content">
		<!-- <u-navbar leftIcon=" " title="商城" placeholder bgColor="#f5f5f5" /> -->
		<u-search shape="round" placeholder="请输入关键字"></u-search>
		<u-skeleton :loading="loading" rowsHeight="9999" rowsWidth="100vw" rows="50" :animate="true">
			<u-swiper height="280" :list="bannerList" autoplay circular indicator indicatorMode="line" bgColor="#ffffff"
				previousMargin="60" keyName="FaceSrc" nextMargin="60" @click="bannerClick" />
			<view class="sort">
				<u-scroll-list :indicator="true" indicatorColor="#fff0f0" indicatorActiveColor="#f56c6c">
					<view class="sort_content">
						<view>
							<view v-for="(item, index) in sortList" :key="index" v-if="index<5">
								<image :src="item.LogoSrc"></image>
								<text class="u-line-1">{{item.Name}}</text>
							</view>
						</view>
						<view>
							<view v-for="(item, index) in sortList" :key="index" v-if="index>=5">
								<image :src="item.LogoSrc"></image>
								<text class="u-line-1">{{item.Name}}</text>
							</view>
						</view>
					</view>
				</u-scroll-list>
			</view>
			<view class="goods">
				<wContainer :columnNumber="columnNumber">
					<wItem v-for="(item, index) in productsList" :key="index">
						<view class="box">
							<image class="image" :src="item.FaceSrc" mode="widthFix"></image>
							<view class="title">{{ item.Name }}</view>
						</view>
					</wItem>
				</wContainer>
			</view>
		</u-skeleton>
		<lt-back-top />
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	import wContainer from '@/uni_modules/simple-waterfall/components/simple-waterfall/w-container.vue'
	import wItem from '@/uni_modules/simple-waterfall/components/simple-waterfall/w-item.vue'
	import LtBackTop from '@/components/lt-back-top/lt-back-top.vue'
	// 导入mixin
	import backMixins from '@/components/lt-back-top/back-mixins.js'
	export default {
		mixins: [backMixins],
		components: {
			wContainer,
			wItem,
			LtBackTop
		},
		data() {
			return {
				bannerList: [],
				productsList: [],
				sortList: [],
				loading: true,
				columnNumber: 2
			}
		},
		onLoad() {
			request.get('https://api5.hanfugou.com/Shop/GetShopListForPublic?page=1&count=10&ishot=true').then(({
				Data
			}) => {
				this.sortList = Data
				this.bannerList = Data[0].Products
				console.log(Data, this.productsList)
				Data.forEach(v => {
					this.productsList.push(...v.Products)
				})
				this.productsList.sort(() => Math.random() - 0.5)
			}).finally(() => {
				this.loading = false
			})
		},
		methods: {
			bannerClick(e) {
				console.log(e)
			}
		}
	}
</script>

<style scoped lang="scss">
	@import 'index.scss'
</style>
