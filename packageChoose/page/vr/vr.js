const app = getApp();
Page({
  data: {
    link: ''
  },
  onLoad: function (options) {
    this.setData({
      link: options.link
    })
  },
})