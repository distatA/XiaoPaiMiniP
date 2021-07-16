// pages/agreement/agreement.js
const app = getApp();
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        util.request({
            url: '/api/index/agreement',
            method: 'post',
            data: {
                'key': options.agreement
            },
            success: function (res) {
                if (res.data.code == 1) {
                    var word = util.format(res.data.data);
                    WxParse.wxParse('txtNew', 'html', word, that, 5);
                    that.setData({
                        content:res.data.data
                    });
                }
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
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    }
})