const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arrSex: ['男','女'],
    sex:'',//性别
    name:'',//姓名
    phone:'',//联系方式
    school:'',//学习
    grade:'',//年级
    region:'',//地区
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindSex(e){
    let a =e.detail.value;
    this.setData({
      sex:this.data.arrSex[a]
    })
  },
  name(e){
    this.setData({
      name:e.detail.value
    })
  },
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  school(e){
    this.setData({
      school:e.detail.value
    })
  },
  grade(e){
    this.setData({
      grade:e.detail.value
    })
  },
  region(e){
    this.setData({
      region:e.detail.value
    })
  },
  signUp(){
    var that=this;
    util.request({
      url:'/api/abroad/baoming',
      data: {
          name:that.data.name,
          sex:that.data.sex,
          mobile:that.data.phone,
          school:that.data.school,
          grade:that.data.grade,
          region:that.data.region
      },
      method: 'post',
      success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              sex:'',//性别
              name:'',//姓名
              phone:'',//联系方式
              school:'',//学习
              grade:'',//年级
              region:'',//地区
            })
             wx.showToast({
               title: res.data.msg,
             })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
      },
    })
  },
  onLoad: function (options) {

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
    util.request({
      url: '/api/index/share',
      data: {
         uid:app.globalData.userInfo.id
      }
  });
  }
})