var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({
    data: {
        tabs: [],
        activeIndex: 0,
        xk: '',
        kj: '',
        sz: ''
    },
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/saas/lists',
            data: {
                schoolid: app.globalData.schoolid,
                mark: options.mark
            },
            success(res) {
                if (res.data.code == 1) {
                    var mark17 = util.format(res.data.mark17);
                    var mark18 = util.format(res.data.mark18);
                    var mark19 = util.format(res.data.mark19);
                    WxParse.wxParse('xk', 'html', mark17, that, 5);
                    WxParse.wxParse('kj', 'html', mark18, that, 5);
                    WxParse.wxParse('sz', 'html', mark19, that, 5);
                    that.setData({
                        tabs: res.data.tabs
                    })
                }
            }
        })
    },
    onShow() {
        count.calEnterTime(); //统计埋点-记录进入时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 407
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 307
            })
        }
    },
    onHide() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 407
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 307
            })
        }
    },
    onUnload() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 407
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 307
            })
        }
    },

    onShareAppMessage: function(option) {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 407
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 307
            })
        }
    },
    tabClick: function(e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },


});