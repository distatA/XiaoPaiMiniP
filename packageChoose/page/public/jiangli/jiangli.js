var app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        arry: [],
        article: ''
    },

    /**
     * 生命周期函数--监听页面加载 
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/saas/lists',
            data: {
                schoolid: app.globalData.schoolid,
                mark: 12
            },
            success(res) {
                if (res.data.code == 1) {
                    var content = util.format(res.data.data)
                    WxParse.wxParse('article', 'html', content, that, 5);
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
                objectId: 414
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 314
            })
        }
    },
    onHide() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 414
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 314
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
                objectId: 414
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 314
            })
        }
    },
    // addlog(state) {
    //     wx.getStorage({
    //         key: 'sk',
    //         success: function (user) {
    //             wx.getSystemInfo({
    //                 success(res) {
    //                     util.request({
    //                         url: '/api/addlog/index2',
    //                         data: {
    //                             state: state,
    //                             schoolid: app.globalData.schoolid,
    //                             brand_name: res.brand,
    //                             system: res.system,
    //                             userid: user.data.data.userid,
    //                             province: app.globalData.area.pid,
    //                             city: app.globalData.area.cid,
    //                             page: 16
    //                         },
    //                         success: function (res) {
    //                         },
    //                     })
    //                 }
    //             })
    //         }
    //     });
    // },
    onShareAppMessage: function (option) {
        var that = this;
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        if (app.globalData.schoolType === 0) {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 414
            }) 
        } else {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 314
            })
        }
    }
})