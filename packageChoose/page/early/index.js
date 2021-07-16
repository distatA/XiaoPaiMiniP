// packageChoose/page//early/index.js
const app = getApp()
const util = require('../../../utils/util.js'); 
var WxParse = require('../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        util.request({
          url: '/api/index/details_zbc',
            data: {
                id: options.id,
            },
            success: function (res) {
                if(res.data.code === 1){
                    var content = util.format(res.data.info.content)
                    var zbc_content = util.format(res.data.info.zbc_content)
                    WxParse.wxParse('content', 'html', content, that, 5);
                    WxParse.wxParse('zbc_content', 'html', zbc_content , that, 5);
                    that.setData({
                        info:res.data.info
                    })
                }
            },
            fail: function (e) {
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