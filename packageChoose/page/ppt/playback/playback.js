const app = getApp()
const util = require('../../../../utils/utils_old_live.js')
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
  data: {
    room_id: 0,
    playUrl: '',
    danmuList: [],
    height: app.globalData.statusBarHeight + 'px',
    schoolInfo: [],
    showDialog: false,
    showSider: false,
    imgs: [],
    timerList: [],
    startTime: 0,
    pptimgurl: '',
    currentImg: 0,
    timer: null,
    danmuIsOpen: true,
    shipinIsOpen: true,
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      room_id: options.id
    })
    util.request({
      url: '/api/room/ppt_room_video',
      data: {
        room_id: that.data.room_id,
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            playUrl: res.data.data,
            schoolInfo: res.data.school_info_content,
            imgs: res.data.ppt_imgs,
            timerList: res.data.ppt_imgs_times,
            startTime: new Date().getTime(),
            pptimgurl: app.globalData.loadUrl+ res.data.ppt_imgs[0].thumb,
            currentImg: res.data.ppt_imgs[0].id,
          })
          var seconds = 0;
          var timer = setInterval(function () {
            for (var i = 0; i < that.data.timerList.length; i++) {
              if (that.data.timerList[i].timer == seconds) {
                for (let j = 0; j < that.data.imgs.length; j++) {
                  if (that.data.timerList[i].pptid == that.data.imgs[j].id) {
                    that.setData({
                      currentImg: that.data.imgs[j].id,
                      pptimgurl: app.globalData.loadUrl+that.data.imgs[j].thumb
                    })
                  }
                }
              }
            }
            ++seconds;
          }, 1);
        }
      }
    })
  },
  onShow() {
    var that = this;
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  onUnload() {
    clearInterval(this.data.timer)
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onShipin: function () {
    var that = this;
    that.setData({
      shipinIsOpen: !that.data.shipinIsOpen
    })
  },
})