//获取应用实例
const app = getApp()
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
Page({
    data: {
        article_id: 0,
        collection: 0,
        info: {},
        plcontent: '',
        celled: 0,
        commet_list: [],
    },
    onLoad: function (option) {
        var that = this;
        util.request({
            url: '/api/saas/enrollment_view',
            data: {
                'id': option.id,
                'schoolid':app.globalData.schoolid
            },
            method: 'post',
            success: function (res) {
                if (res.data.code == 1) {
                    var content = util.format(res.data.data.content)
                    WxParse.wxParse('txtNew', 'html', content, that, 5);
                    that.setData({
                        info: res.data.data,
                    });
                }
            },
            fail: function (e) {
                wx.hideLoading();
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });

    },
    onShow() {
        var that = this;
       
    },

    pageScrollToBottom: function () {
        wx.createSelectorQuery().select('#comment').boundingClientRect(function (rect) {
            // 使页面滚动到底部
            wx.pageScrollTo({
                scrollTop: rect.bottom
            })
        }).exec()
    },
    //分享按钮函数
    onShareAppMessage: function (ops) {
        var that = this;
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    },
})