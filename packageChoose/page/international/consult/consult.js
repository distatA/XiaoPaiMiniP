// packageChoose/page//international/newsdetail/newsdetail.js
const app = getApp();
const util = require('../../../../utils/util.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // console.log(options)
        util.request({
          url:'/api/abroad/direction',
            data: {
                'id': app.globalData.schoolid
                // 'type': options.type
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        list: res.data.data
                    })
                }
            },
            fail: function(e) {
                wx.hideLoading();
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    }
})