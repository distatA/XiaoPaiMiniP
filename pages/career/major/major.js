
//获取应用实例
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    currentTab: 0,
    currType: -1,
    currxl: 1,
    wheight: 500,
    bkinfo:[],
    zkinfo:[],
  },
  onLoad: function (option) {
    var that = this;  
    that.zhuanke();
    that.benke(); 
    wx.getSystemInfo({
      success: function (res) {
        var wheight = res.windowHeight;
        that.setData({
          wheight: 1200,
        })
      }
    })
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    }); 
  },
  //点击切换
  clickTab: function (e) {
    var that = this;   
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }, 
  tapType: function (e) {
    var that = this;
    const currType = e.currentTarget.dataset.typeId;
    that.setData({
      currType: currType
    });
  },
  tapType2: function (e) {
    var that = this;
    var currxl='';
    var currxl_data = that.data.currxl;
    var currxl_new = e.currentTarget.dataset.typeId;

    if (currxl_data !== currxl_new){
      currxl = currxl_new;
    } else{
      currxl=0
    }

    that.setData({
      currxl: currxl
    });
  },
  benke:function(name){
    var that = this;
    util.request({
      url:'/api/career/index',
      method: 'post',
      data: {
        'type': 1,
        "name": name,
      },
      success: function (res) {
        var info = res.data.data;
        that.setData({
          bkinfo: info
        });

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    }); 
  },
  zhuanke: function (name){
    var that = this;
      util.request({
          url:'/api/career/index',
      method: 'post',
      data: { 
        'type': 0,
        "name": name,
      },
      success: function (res) {
        var info = res.data.data;
        that.setData({
          zkinfo: info
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    }); 
  },

  formSubmit: function (e) {
    var that = this;
    var name = e.detail.value.name;
    var currentTab = that.data.currentTab
    if (currentTab==0){
      that.benke(name);
    }else{
      that.zhuanke(name);
    }
  }   

})
