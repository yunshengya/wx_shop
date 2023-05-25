<template>
	<view class="backTop" :style="{ 'opacity': isShow }" @click="toTop">
    <slot>
      <image :src="require('./top.png')" style="width: 100%;height: 100%;" mode="widthFix" />
    </slot>
	</view>
</template>

<script>
export default {
  props: {
    // 滑动多远显示回到顶部按钮
    scroll: {
      type: Number,
      default: 400
    },
    // 回到顶部的过渡时间
    duration: {
      type: Number,
      default: 300
    }
  },
  computed: {
    isShow() {
      return this.$parent.scrollTop > this.scroll ? 1 : 0
    }
  },
  data() {
    return {
      isShowToTop: true
    }
  },
  methods: {
    toTop() {
      // 先隐藏回到顶部按钮,再进行回到顶部
      this.isShowToTop = false 
      uni.pageScrollTo({
        scrollTop: 0,
        duration: this.duration
      })
    }
  }
}
</script>

<style>
	.backTop {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
    position: fixed;
		right: 40rpx;
		bottom: 130upx;
		z-index: 999;
    transition: .3s;
	}
</style>
