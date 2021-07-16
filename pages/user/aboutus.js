//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        // id: 0,
        // info: [],
        // isretrue: 0,
    },
    // onLoad: function (option) {
    //     var that = this;
    //     if (option.isretrue) {
    //         that.setData({
    //             isretrue: 1
    //         });
    //     }
    //     wx.request({
    //         url: app.globalData.hostUrl + '/users/aboutus',
    //         method: 'post',
    //         success: function (res) {
    //             if (res.data.code == 1) {
    //                 var info = res.data.data;
    //                 WxParse.wxParse('content', 'html', info, that, 3);
    //                 that.setData({
    //                     info: info,
    //                 });
    //             }

    //         },
    //         fail: function (e) {
    //             wx.showToast({
    //                 title: '网络异常！',
    //                 duration: 2000
    //             });
    //         },
    //     })
    // },

    onShareAppMessage: function () {
        return {
            title: '校派',
            path: '/pages/index/index',
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    },
    returnHome: function (e) {
        wx.switchTab({
            url: '/pages/index/index',
        })
    }
})
