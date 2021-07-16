var app = getApp();
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        arry: [],
        id: '',
        page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        util.request({
            url: '/api/saas/lists',
            data: {
                schoolid: app.globalData.schoolid,
                mark: 13
            },
            success(res) {
                that.setData({
                    arry: res.data.data,
                })
            }
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    onShow() {
        // this.addlog("onshow")
        count.calEnterTime(); //统计埋点-记录进入时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 415
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 315
            })
        }
    },
    onHide() {
        // this.addlog("onhide")
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 415
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 315
            })
        }
    },
    onUnload() {
        // this.addlog("onunload")
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 415
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 315
            })
        }
    },
    // addlog(state) {
    //     console.log(state)
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
    //                             page: 17
    //                         },
    //                         header: {
    //                             'Content-Type': 'application/json'
    //                         },
    //                         success: function (res) {
    //                             console.log(state + ' add log success');
    //                         },
    //                         fail: function () {
    //                             // console.log('add log fail');
    //                         },
    //                     })
    //                 }
    //             })
    //         }
    //     });
    // },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this
        util.request({
            url: '/api/saas/news',
            data: {
                schoolid: app.globalData.schoolid,
                mark: 13,
                page: that.data.page
            },
            success(res) {
                if (res.data.code == 1) {
                    var arr = that.data.arry.concat(res.data.data)
                    that.setData({
                        arry: arr,
                        page: that.data.page + 1
                    })
                    wx.showToast({
                        title: '加载中...',
                        icon: 'loading'
                    })
                }else{
                    wx.showToast({
                        title: '没有更多',
                        icon: 'loading'
                    })
                }

            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 415
            })
        } else {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 315
            })
        }
    }
})