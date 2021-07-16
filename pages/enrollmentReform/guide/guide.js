const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
const util = require('../../../utils/util.js');
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
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/reform/enroll_details',
            data: {
                id: options.id
            },
            success: function(res) {
                if (res.data.code == 1) {
                    var content = util.format(res.data.data.content)
                    WxParse.wxParse('txtNew', 'html', content, that, 5);
                    that.setData({
                        info: res.data.data,
                    });
                }
            }
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return{
            title: this.data.info.title,
            path: '/pages/enrollmentReform/index/index?id=' + this.data.info.id
        }
    }
})