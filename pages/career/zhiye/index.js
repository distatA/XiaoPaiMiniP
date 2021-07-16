//获取应用实例
const until = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    currType: -1,
    currxl: 1,
    wheight: 500,
    info: [],
  },
  onLoad: function (option) {
    var that = this;
    that.zhiye();
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
    var currxl = '';
    var currxl_data = that.data.currxl;
    var currxl_new = e.currentTarget.dataset.typeId;

    if (currxl_data !== currxl_new) {
      currxl = currxl_new;
    } else {
      currxl = 0
    }
    
    that.setData({
      currxl: currxl
    });
  },
  zhiye: function (name) {
    var that = this;
    until.request({
      url:'/api/job/index',
      method: 'post',
      data: {
        "name": name,
      },      
      success: function (res) {
        if (res.data.code == 1) {
          var info = res.data.data;
          that.setData({
            info: info,
            currxl: 1,
          });
        }
      }
    })    
  },
  formSubmit: function (e) {
    var that = this;
    var name = e.detail.value.name;
    var currentTab = that.data.currentTab
    that.zhiye(name);
  },  

})
