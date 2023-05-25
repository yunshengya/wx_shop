export default {
  data() {
    return { scrollTop: 0 }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  }
}