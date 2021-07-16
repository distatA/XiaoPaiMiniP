//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        alist: [], //地址
        vlist: [],
        province: '', //当前省份
    },

    onLoad: function () {
        var that = this;
        util.request({
            url:'/api/index/index_address',
            method: 'post',
            success: function (res) {
                if (res.data.code == 1) {
                    var alist = res.data.city;
                    that.setData({
                        alist: alist,
                    });
                }
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
        var province = app.globalData.province.province;
        var pid = app.globalData.province.id;
        that.setData({
            province: province,
            pid: pid
        });
    },
    locatpro: function (e) {
        var that = this;
        var pid = e.target.dataset.pid;
        util.request({
            url:'/api/index/bindcity',
            method: 'post',
            data: { 'id':pid },
            success: function (res) {
                if (res.data.code == 1) {
                    var province = res.data.data.name;
                    app.globalData.province.province = res.data.data.name;
                    app.globalData.province.id = res.data.data.province;
                    that.setData({
                        province: province,
                    });
                    wx.switchTab({
                        url: '../tabBar/index/index'
                    });
                } else {
                    wx.showToast({
                        title: '定位城市异常！',
                        duration: 2000
                    });
                }

            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
    }

})
