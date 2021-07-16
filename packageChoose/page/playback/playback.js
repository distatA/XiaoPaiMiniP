const app = getApp()
const util = require('../../../utils/utils_old_live.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    room_id: 0,
    playUrl: '',
    danmuList: [],
    height: app.globalData.statusBarHeight + 'px',
    schoolInfo: [],
    showDialog: false,
    showSider: false,
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      room_id: options.id
    })

    util.request({
      url: '/api/room/room_video',
      data: {
        room_id: options.id,
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            playUrl: res.data.data,
            schoolInfo: res.data.school_info_content
          })
        }
      }
    })
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  openSider: function () {
    this.setData({
      showSider: !this.data.showSider
    })
  },
  dialogHide() {
    this.setData({
      showDialog: false,
    })
    this.dialog.hide()
  },
  openAbout() {
    this.setData({
      showDialog: true,
    })
    this.dialog.show(0)
  },
  openFenshu() {
    this.setData({
      showDialog: true,
    })
    this.dialog.show(1)
  },
  openZhuanye() {
    this.setData({
      showDialog: true,
    })
    this.dialog.show(2)
  },
  openVr() {
    let that = this;
    wx.request({
      url: app.globalData.requestUrl + '/live/school_url',
      data: {
        "room_id": that.data.room_id
      },
      method: 'post',
      success: function (res) {
        wx.navigateTo({
          url: '../vr/vr?link=' + res.data.list.linkurl,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
})