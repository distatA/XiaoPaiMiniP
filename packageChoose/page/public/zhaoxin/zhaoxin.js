var app = getApp()
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({
    data: {
        tabs: [],
        activeIndex: 27,
        mark20: [],
        mark21: [],
        mark22: [],
        mark23: [],
        mark27: [],
        //上拉加载
        limit: '', //显示数据量
        list: '',
        page: 1, //当前页
        load: true,
        loading: false, //加载动画的显示
        //
    },
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/saas/lists',
            data: {
                schoolid: app.globalData.schoolid,
                mark: 3,
            },
            success(res) {
                var ret = res.data;
                if (res.data.code == 1) {
                    that.setData({
                        mark20: res.data.mark20,
                        mark21: res.data.mark21,
                        mark22: res.data.mark22,
                        mark23: res.data.mark23,
                        mark27: res.data.mark27,
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
            page: 1
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        if (that.data.load) {
            util.request({
                url: '/api/saas/news',
                data: {
                    schoolid: app.globalData.schoolid,
                    mark: that.data.activeIndex,
                    page: that.data.page
                },
                success(res) {
                    if (res.data.code == 1) {
                        that.setData({
                            page: that.data.page + 1
                        })
                        switch (that.data.activeIndex) {
                            case 20:
                                var arr1 = that.data.mark20.concat(res.data.data)
                                that.setData({
                                    mark20: arr1,
                                })
                                break;
                            case 21:
                                var arr2 = that.data.mark21.concat(res.data.data)
                                that.setData({
                                    mark21: arr2,
                                })
                                break;
                            case 22:
                                var arr3 = that.data.mark22.concat(res.data.data)
                                that.setData({
                                    mark22: arr3,
                                })
                                break;
                            case 23:
                                var arr4 = that.data.mark23.concat(res.data.data)
                                that.setData({
                                    mark23: arr4,
                                })
                                break;
                            default:
                                break;
                        }
                    }
                    wx.showToast({
                        title: '加载中...',
                        icon: 'loading'
                    })
                }
            })
        }
    },
    onShow() {
        this.addlog("onshow")
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            schoolId: app.globalData.schoolid,
            objectId: 309
        })
    },
    onHide() {
        this.addlog("onhide")
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 409
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 309
            })
        }
    },
    onUnload() {
        this.addlog("onunload")
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 409
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 309
            })
        }
    },
    onShareAppMessage: function (option) {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 409
            })
        } else {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 309
            })
        }
    },
    addlog(state) {
        wx.getStorage({
            key: 'sk',
            success: function(user) {
                wx.getSystemInfo({
                    success(res) {
                        util.request({
                            url: '/api/addlog/index2',
                            data: {
                                state: state,
                                schoolid: app.globalData.schoolid,
                                brand_name: res.brand,
                                system: res.system,
                                userid: user.data.data.userid,
                                province: app.globalData.area.pid,
                                city: app.globalData.area.cid,
                                page: 11
                            },
                            success: function(res) {
                            },
                        })
                    }
                })
            }
        });
    },
});