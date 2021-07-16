//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
Page({
    data: {
        banlist: [],
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        beforeColor: "white",
        afterColor: "coral",
        showView: true,
        typeid: 1
    },
    onLoad: function(options) {
        var that = this;
        //广告
        util.request({
            url: '/api/test/test_guide',
            data: {
                province: app.globalData.province.id,
                type: options.type
            },

            success: function(res) {
                var banlist = res.data.info;
                wx.setStorage({ //存储到本地
                    key: "isbanad",
                    data: 1
                });
                that.setData({
                    banlist: banlist,
                    typeid: options.type
                });
            },
        });
    },
    jumpquest: function() {
        var that = this;
        var typeid = that.data.typeid;
        var jump = '';
        if (typeid == 1) {
            // 兴趣
            jump = '../quest/int?type=1';
        } else if (typeid == 2) {
            // 职业倾向
            jump = '../quest/job?type=2';
        } else if (typeid == 3) {
            // 性格
            jump = '../quest/index?type=3';
        } else if (typeid == 4) {
            // 学科强弱
            jump = '../quest/sub?type=4';
        }
        wx.navigateTo({
            url: jump
        })
    }
})