const util = require('../../../utils/utils_old_live.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    videoUrl: '',//视频地址
    imgUrl: '',//图片地址
    id: '',//直播间id
    name: '',//学校名
    info: [],
    showLoginDialog: false,
    showInfo: true,
  },
  videoPlay() {
    this.setData({
      showInfo: false
    })
  },
  collect() {
    var that = this;
    if (app.globalData.userInfo == null) {
      that.setData({
        showLoginDialog: true
      });
      return;
    }
    util.request({
      url: '/api/room/collect',
      data: {
        room_id: that.data.id,
        user_id: app.globalData.userInfo.id
      },
      success: function (res) {
        if (res.data.code == 1) {
          var is_collect = (res.data.is_collect == 1) ? true : false;
          that.setData({
            is_collect: is_collect,
          });
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfoSync()
    that.setData({
      height: wx.getSystemInfoSync().windowHeight - 64,
      videoUrl: options.video,
      id: options.id,
      name: options.name
    });
    let userid = 0;
    if (app.globalData.userInfo != null) {
      userid = app.globalData.userInfo.id
    }
    that.detail(options.id, userid)
  },
  detail(id, userid) {
    var that = this;
    util.request({
      url: '/api/room/thumb_room_video',
      data: {
        room_id: id,
        user_id: userid
      },
      success(res) {
        var is_collect = (res.data.is_collect == 1) ? true : false;
        that.setData({
          imgUrl: app.globalData.loadUrl + res.data.video,
          info: res.data.list,
          is_collect: is_collect
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.name,
      path: '/pages/detail/detail?id=' + this.data.id,
    }
  }
})