// pages/career/applyfor/index.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uhide: 0,
    volunteer: [],
    empty: '志愿表生成中，请稍后...',
    isHave: false,
  },
  //点击专业切换隐藏和显示
  clickShow: function (event) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var id = event.currentTarget.id;
    if (toggleBtnVal == id) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: id
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    var that = this;
    util.request({
        url:'/api/user/volunteer_list',
      data: {
          uid: app.globalData.userInfo.id,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 1) {
          var volunteer = res.data.volunteer_list;
          that.setData({
            volunteer: volunteer,
            isHave: true
          });
        }
      },
    });

  },
  onLoad: function (options) {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

      wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})