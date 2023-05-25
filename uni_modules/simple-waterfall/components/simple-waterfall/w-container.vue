<template>
	<!-- #ifndef MP -->
	<view :class="W_CONTAINER" :bus="renderOptions" :change:bus="render.layout">
		<slot></slot>
	</view>
	<!-- #endif -->
	<!-- #ifdef MP -->
	<view :class="W_CONTAINER" :id="W_CONTAINER">
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
	import {
		throttle,
		querySelector,
		sleep
	} from './utils/utils'
	import {
		W_CONTAINER,
		W_ITEM,
		CONTAINER,
		RESIZE
	} from './utils/constants';
	export default {
		provide() {
			return {
				[CONTAINER]: this
			}
		},
		props: {
			// 列的数量
			columnNumber: {
				type: Number,
				default: 3
			},
			// 列与列之间的间隔,单位px
			columnSpacing: {
				type: Number,
				default: 10
			},
			// 行与行之间的间隔,单位px
			rowSpacing: {
				type: Number,
				default: 10
			}
		},
		data() {
			return {
				W_CONTAINER,
				// #ifndef MP
				renderOptions: {},
				// #endif
				// #ifdef MP
				itemHeights: [],
				// #endif
			}
		},
		created() {
			this.$nextTick(() => {
				// #ifndef MP
				uni.$on(RESIZE, this.startRender);
				// #endif
				// #ifdef MP
				this.startWxRender();
				// #endif
			});
		},
		beforeDestroy() {
			uni.$off(RESIZE);
		},
		methods: {
			// #ifndef MP
			startRender: throttle(async function() {
				this.renderOptions = {
					...this.$props,
					_t: `${Date.now()}`
				}
			}, 100),
			// #endif
			// #ifdef MP
			async startWxRender() {
				for (;;) {
					await this.wxRender();
					await sleep(300);
				}
			},
			async wxRender() {
				const startIndex = await this.findChangeIndex(this.$children);
				if (undefined !== startIndex) {
					await this.startLayout(this.$children, startIndex, this.$props);
				}
			},
			async findChangeIndex(elItems) {
				const itemHeights = this.itemHeights;
				for (let i = 0; i < elItems.length; i++) {
					const element = elItems[i];
					let elementRect = await querySelector(`.${W_ITEM}`, element);
					if (!elementRect || itemHeights[i]?.height === 0 || itemHeights[i]?.height !== elementRect
						.height) {
						return i;
					}
				}
			},
			async startLayout(elItems, startIndex, props) {
				let itemHeights = this.itemHeights;
				let newHeights = itemHeights.slice(0, startIndex);
				for (let i = startIndex; i < elItems.length; i++) {
					const element = elItems[i];
					const elementRect = await querySelector(`.${W_ITEM}`, element);
					const height = elementRect.height;
					const columnIndex = await this.layoutItem(element, i, props, newHeights);
					newHeights.push({
						height,
						columnIndex,
						id: element.id
					});
				}
				this.itemHeights = newHeights;
			},
			async layoutItem(element, index, {
				columnNumber,
				columnSpacing,
				rowSpacing
			}, newHeights = []) {
				const columnInfo = this.getColumnInfo(newHeights, columnNumber);
				const elContainer = await querySelector(`.${W_CONTAINER}`, this);
				const containerWidth = elContainer.width;
				const coulumnSpacingWidth = (columnNumber - 1) * columnSpacing;
				const coulumnWidth = (containerWidth - coulumnSpacingWidth) / columnNumber;
				const left = (coulumnWidth + columnSpacing) * columnInfo.minColumnIndex;
				const top = columnInfo.minColumnTotal + rowSpacing * columnInfo.columns[columnInfo.minColumnIndex].list
					.length;
				element.setStyle({
					left: `${left}px`,
					top: `${top}px`,
					opacity: 1
				});
				return columnInfo.minColumnIndex;
			},
			getColumnInfo(arr, columnNumber) {
				let columns = {},
					minColumnIndex = 0,
					minColumnTotal = Infinity;
				for (let i = 0; i < columnNumber; i++) {
					const list = arr.filter(v => v.columnIndex === i);
					const total = list.reduce((i, j) => i + j.height, 0);
					columns[i] = {
						list,
						total,
					}
					if (minColumnTotal > total) {
						minColumnIndex = i;
					}
					minColumnTotal = Math.min(minColumnTotal, total);
				}
				return {
					columns,
					minColumnIndex,
					minColumnTotal
				};
			}
			// #endif
		},
	}
</script>
<!-- #ifndef MP -->
<script module="render" lang="renderjs">
	import {
		W_CONTAINER,
		W_ITEM,
	} from './utils/constants';
	import {
		sleep
	} from './utils/utils';
	export default {
		data() {
			return {
				itemHeights: [],
			}
		},
		methods: {
			async layout(props) {
				const elContainer = document.querySelector(`.${W_CONTAINER}`);
				if (elContainer) {
					const elItems = elContainer.querySelectorAll(`.${W_ITEM}`);
					const startIndex = this.findChangeIndex(elItems);
					this.startLayout(elItems, startIndex, props);
				}
			},
			findChangeIndex(elItems) {
				const itemHeights = this.itemHeights;
				for (let i = 0; i < elItems.length; i++) {
					const element = elItems[i];
					if (itemHeights[i]?.height !== element.offsetHeight) {
						return i;
					}
				}
				return 0;
			},
			startLayout(elItems, startIndex, props) {
				const itemHeights = this.itemHeights;
				const newHeights = itemHeights.slice(0, startIndex);
				for (let i = startIndex; i < elItems.length; i++) {
					const element = elItems[i];
					const height = element.offsetHeight;
					const columnIndex = this.layoutItem(element, i, props, newHeights);
					newHeights.push({
						height,
						columnIndex
					});
				}
				this.itemHeights = newHeights;
			},
			layoutItem(element, index, {
				columnNumber,
				columnSpacing,
				rowSpacing
			}, newHeights = []) {
				const columnInfo = this.getColumnInfo(newHeights, columnNumber);
				const elContainer = document.querySelector(`.${W_CONTAINER}`);
				const containerWidth = elContainer.offsetWidth;
				const coulumnSpacingWidth = (columnNumber - 1) * columnSpacing;
				const coulumnWidth = (containerWidth - coulumnSpacingWidth) / columnNumber;
				const left = (coulumnWidth + columnSpacing) * columnInfo.minColumnIndex;
				const top = columnInfo.minColumnTotal + rowSpacing * columnInfo.columns[columnInfo.minColumnIndex].list
					.length;
				element.style.left = `${left}px`;
				element.style.top = `${top}px`;
				element.style.opacity = 1;
				return columnInfo.minColumnIndex;
			},
			getColumnInfo(arr, columnNumber) {
				let columns = {},
					minColumnIndex = 0,
					minColumnTotal = Infinity;
				for (let i = 0; i < columnNumber; i++) {
					const list = arr.filter(v => v.columnIndex === i);
					const total = list.reduce((i, j) => i + j.height, 0);
					columns[i] = {
						list,
						total,
					}
					if (minColumnTotal > total) {
						minColumnIndex = i;
					}
					minColumnTotal = Math.min(minColumnTotal, total);
				}
				return {
					columns,
					minColumnIndex,
					minColumnTotal
				};
			}
		},
	}
</script>
<!-- #endif -->

<style scoped>
	.w__container {
		width: 100%;
		position: relative;
	}
</style>