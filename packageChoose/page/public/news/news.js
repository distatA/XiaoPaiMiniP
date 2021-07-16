var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({
    data: {
        tabs: [],
        activeIndex: 24,
        mark24: [],
        mark25: [],
        mark26: [],
        page1: 1, //当前页
        page2: 1,
        page3: 1,
        loading: false, //加载动画的显示
    },
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/saas/lists',
            data: {
                schoolid: app.globalData.schoolid,
                mark: 16
            },
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        mark24: res.data.mark24,
                        mark25: res.data.mark25,
                        mark26: res.data.mark26,
                        tabs: res.data.tabs
                    })
                }
            }
        })
    },
    tabClick: function(e) {
        var that = this;
        that.setData({
            activeIndex: e.currentTarget.dataset.activeindex,
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;

        switch (that.data.activeIndex) {
            case 24:
                util.request({
                    url: '/api/saas/news',
                    data: {
                        schoolid: app.globalData.schoolid,
                        mark: that.data.activeIndex,
                        page: that.data.page1
                    },
                    success(res) {
                        if (res.data.code == 1) {
                            var arr1 = that.data.mark24.concat(res.data.data)
                            that.setData({
                                page1: that.data.page1 + 1,
                                mark24: arr1,
                            })
                            wx.showToast({
                                title: '加载中...',
                                icon: 'loading'
                            })
                        } else {
                            wx.showToast({
                                title: '没有更多内容',
                                icon: 'none'
                            })
                        }
                    }
                })
                break;
            case 25:
                util.request({
                    url: '/api/saas/news',
                    data: {
                        schoolid: app.globalData.schoolid,
                        mark: that.data.activeIndex,
                        page: that.data.page2
                    },
                    success(res) {
                        if (res.data.code == 1) {
                            var arr2 = that.data.mark25.concat(res.data.data)
                            that.setData({
                                page2: that.data.page2 + 1,
                                mark25: arr2,
                            })
                            wx.showToast({
                                title: '加载中...',
                                icon: 'loading'
                            })
                        } else {
                            wx.showToast({
                                title: '没有更多内容',
                                icon: 'none'
                            })
                        }
                    }
                })
                break;
            case 26:
                util.request({
                    url: '/api/saas/news',
                    data: {
                        schoolid: app.globalData.schoolid,
                        mark: that.data.activeIndex,
                        page: that.data.page3
                    },
                    success(res) {
                        if (res.data.code == 1) {
                            var arr3 = that.data.mark26.concat(res.data.data)
                            that.setData({
                                page3: that.data.page3 + 1,
                                mark26: arr3,
                            })
                            wx.showToast({
                                title: '加载中...',
                                icon: 'loading'
                            })
                        } else {
                            wx.showToast({
                                title: '没有更多内容',
                                icon: 'none'
                            })
                        }
                    }
                })
                break;
            default:
                break;
        }
    },
    onShow() {
        count.calEnterTime(); //统计埋点-记录进入时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 416
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 316
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
                objectId: 416
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 316
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
                objectId: 416
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 316
            })
        }
    },
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 416
            })
        } else {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 316
            })
        }
    }
});