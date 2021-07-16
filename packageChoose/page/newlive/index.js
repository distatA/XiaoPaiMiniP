const app = getApp()
const util = require('../../../utils/utils_old_live.js')
const util_new = require('../../../utils/utils_old_live.js')
Page({
  data: {
    initList: []
  },
  onLoad: function() {
    this.initIndexData()
  },
  addItem: function(e) {
    let itextnamed = e.currentTarget.dataset.textname
    let type = e.currentTarget.dataset.type
    let datetotal = e.currentTarget.dataset.totaldate
    let link_url = e.currentTarget.dataset.urllink

    console.log(e)

    // wx.setStorage({
    //   key: 'link_url',
    //   data: link_url,
    // })

    if (itextnamed) {
      wx.navigateTo({
        url: '../webview_active/webview_active?textname=' + itextnamed + '&typee' + type + "&link_url=" + encodeURIComponent(link_url),
      })
    }
  },
  initIndexData: function() {
    let that = this
    util_new.request_new({
      url: '/live/index',
      success: function(res) {
        let code = res.data.code
        if (code == 1) {
          if (res.data.list.length != 0) {
            that.setData({
              initList: res.data.list
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })



  },


  onShareAppMessage: function(ops) {
    var that = this;
    return {
      title: '2020高招咨询会',
      path: '/packageChoose/page/newlive/index',
    }
  }
})