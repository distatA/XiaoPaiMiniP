// pages/yuanxiinfo/yuanxiinfo.js
var app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        introduce: '',
        departList: [],//系部列表
        isOver: false//是否加载完
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        util.request({
            url: '/api/saas/college_view',
            data: {
                schoolid: app.globalData.schoolid,
                cid: app.globalData.courtId,
            },
            success(res) {
                var college = util.format(res.data.college)
                WxParse.wxParse('college', 'html', college, that, 5);
                that.setData({
                    departList: res.data.depart,
                    isOver: true
                })
            }
        })
    },
    goYuanXiInfo(e) {
        // console.log(e.currentTarget.dataset.did)
        // app.globalData.did = e.currentTarget.dataset.did;
        // //跳至系部介绍
        // wx.navigateTo({
        //     url: '../../pages/xibuinfo/xibuinfo'
        // })
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