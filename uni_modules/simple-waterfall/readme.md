#### 参数说明

| 参数名     | 说明          | 类型      | 可选值  | 默认值   |
|---------|-------------|---------|------|-------|
| columnNumber | 显示多少列  | Number | - | 3 |
| columnSpacing   | 列与列之间的间隔,单位px          | Number  | -    | 10     |
| rowSpacing   | 行与行之间的间隔,单位px        | Number  | -    | 10     |

#### 示例代码

```
<template>
	<view class="content">
		<view class="btns">
			<button @click="columnNumber = 2">2列</button>
			<button @click="columnNumber = 3">3列</button>
			<button @click="columnNumber = 4">4列</button>
			<button @click="columnNumber = 5">5列</button>
		</view>
		<wContainer :columnNumber="columnNumber">
			<wItem v-for="(item, index) in list" :key="index">
				<view class="box">
					<image class="image" :src="item.image" mode="widthFix"></image>
					<view class="title">{{ item.title }}</view>
				</view>
			</wItem>
		</wContainer>
	</view>
</template>

<script>
	import wContainer from '@/uni_modules/simple-waterfall/components/simple-waterfall/w-container.vue'
	import wItem from '@/uni_modules/simple-waterfall/components/simple-waterfall/w-item.vue'
	import {
		getList
	} from '@/mock/list.js'
	export default {
		components: {
			wContainer,
			wItem
		},
		data() {
			return {
				columnNumber: 2,
				page: 1,
				size: 20,
				list: [],
			}
		},
		onLoad() {
			this.load();
		},
		onReachBottom() {
			this.load();
		},
		onPullDownRefresh() {
			this.load(true);
		},
		methods: {
			async load(reset = false) {
				if (reset) {
					this.page = 1;
					this.size = 20;
					this.list = [];
				}
				const {
					page,
					size
				} = this;
				const list = await getList(this.page, this.size);
				this.list = this.list.concat(list);
				this.page++;
				uni.stopPullDownRefresh()
			},
		}
	}
</script>

<style>
	.content {
		padding: 30rpx;
	}

	.btns {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30rpx 0;
	}

	.btns button {
		margin: 0 30rpx;
		background-color: #393E51;
		color: #fff;
		padding: 20rpx 30rpx;
		line-height: 1;
		font-size: 24rpx;
	}

	.box {
		background-color: #fff;
		box-shadow: 3rpx 5rpx 57rpx 0px rgba(155, 131, 255, 0.2);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.image {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		vertical-align: bottom;
	}

	.title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #393E51;
		padding: 30rpx 16rpx;
	}
</style>

```