<template>
	<view :class="W_ITEM" :style="[style]" :id="id">
		<slot></slot>
	</view>
</template>
<script>
	import {
		W_ITEM,
		CONTAINER,
		RESIZE
	} from './utils/constants';
	import {
		querySelector,
	} from './utils/utils';
	export default {
		inject: [CONTAINER],
		data() {
			return {
				W_ITEM,
				// #ifdef MP
				wxStyle: {},
				// #endif
				id: `${Date.now()}`
			}
		},
		computed: {
			style() {
				const {
					columnNumber,
					columnSpacing
				} = this[CONTAINER];
				const coulumnWidth = (columnNumber - 1) * columnSpacing;
				return {
					width: `calc((100% - ${coulumnWidth}px) / ${columnNumber})`,
					// #ifdef MP
					...this.wxStyle
					// #endif
				}
			}
		},
		methods: {
			resize(contentRect) {
				uni.$emit(RESIZE, contentRect);
			},
			// #ifdef MP
			setStyle(wxStyle = {}) {
				this.wxStyle = wxStyle;
			},
			// #endif
		}
	}
</script>

<!-- #ifndef MP -->
<script module="render" lang="renderjs">
	export default {
		mounted() {
			this.$ob = new ResizeObserver((entries) => {
				for (let entry of entries) {
					this.$ownerInstance.callMethod('resize', entry.contentRect);
				}
			});
			this.$ob.observe(this.$ownerInstance.$el);
		}
	}
</script>
<!-- #endif -->

<style>
	.w__item {
		position: absolute;
		transition: all .2s linear;
		opacity: 0;
	}
</style>