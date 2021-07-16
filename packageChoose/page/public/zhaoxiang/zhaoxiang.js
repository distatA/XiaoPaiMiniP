const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
    data: {
        row: [],
        isShow:false
    },
    onLoad: function (options) {
        var that = this
        // wx.request({
        //     url: app.globalData.apiHost + '/api/lists/show',
        //     data: {
        //         schoolid: app.globalData.schoolid,
        //         id: options.id
        //     },
        //     header: { 'content-type': 'application/json' },
        //     success(res) {
        //         var ret = res.data;
        //         if (ret.status == 'success') {
        //             that.setData({
        //                 row: ret.data,
        //             })
        //             WxParse.wxParse('article', 'html', ret.data.content, that, 5);
        //             that.setData({
        //                 isShow:true
        //             })
        //         }
        //     }
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

    }
})