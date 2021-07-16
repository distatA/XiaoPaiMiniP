const app = getApp()
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({
    data: {
        schoolid: 0,
        vr: '',
        vr_url: '', //存储全景地址
        cates: [],
        bannerList: [],
        schoolInfo: {},
        newsList: [],
        page: 1,
        isretrue: 0,
        isOver: false,
        // groupId: '', //群聊
        // chatShow: false, //群聊显示
        showLogin: false,
    },
    onShow() {
        if (app.globalData.userInfo.id != 0) {
            this.setData({
                showLogin: false
            })
        }
    },
    onHide() {
        //0->专科
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 406
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 306
            })
        }
    },
    onUnload() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 406
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 306
            })
        }
    },
    goDetail(e) {
        var that = this;
        var cate_url = e.currentTarget.dataset.cate_url;
        var mark = e.currentTarget.dataset.mark;
        var vrurl = e.currentTarget.dataset.vrurl;
        var vr_url = that.data.vr_url
        if (vrurl) {
            if (app.globalData.userInfo.id != 0) {
                if (vr_url) {
                    wx.navigateTo({
                        url: cate_url + '?vr_url=' + vr_url
                    })
                } else {
                    wx.showToast({
                        title: '暂未开通',
                        icon: 'none'
                    })
                }
            } else {
                that.setData({
                    showLogin: true
                })
            }
        } else {
            wx.navigateTo({
                url: cate_url + '?mark=' + mark
            })
        }
    },
    //新闻详情
    goNewsDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../newsdetail/newsdetail?id=" + id
        })
    },
    // 全景
    jumpvr() {
        var that = this;
        var vr_url = that.data.vr_url;
        if (vr_url) {
            if (app.globalData.userInfo.id != 0) {
                count.calLeaveTime(); //统计埋点-记录离开时间
                if (app.globalData.schoolType === 0) {
                    count.statistics({
                        objectType: 0,
                        schoolId: app.globalData.schoolid,
                        objectId: 413
                    })
                } else {
                    count.statistics({
                        objectType: 0,
                        schoolId: app.globalData.schoolid,
                        objectId: 313
                    })
                }

                wx.navigateTo({
                    url: '../webview/webview' + '?vr_url=' + vr_url
                })

            } else {
                that.setData({
                    showLogin: true
                })
            }
        }
    },
    onLoad: function (option) {
        var that = this;
        if (option.isretrue) {
            that.setData({
                isretrue: 1
            });
        }
        app.globalData.schoolid = option.id;
        util.request({
            url: '/api/saas/index',
            data: {
                schoolid: app.globalData.schoolid,
            },
            success: function (res) {
                wx.setNavigationBarTitle({
                    title: res.data.school.name
                })
                that.setData({
                    schoolInfo: res.data.school,
                    cates: res.data.cates,
                    bannerList: res.data.ad,
                    newsList: res.data.news,
                    vr: res.data.vr,
                    vr_url: res.data.vr_url,
                })
                app.globalData.schoolType = res.data.schoolType
                count.calEnterTime(); //统计埋点-记录进入时间
                if (app.globalData.schoolType === 0) {
                    count.statistics({
                        objectType: 0,
                        schoolId: app.globalData.schoolid,
                        objectId: 406
                    })
                } else {
                    count.statistics({
                        objectType: 0,
                        schoolId: app.globalData.schoolid,
                        objectId: 306
                    })
                }
            },
        });

        // 是否开通群聊
        // util.request({
        //     url: '/api/school/group_chat',
        //     data: {
        //         'sid': app.globalData.schoolid
        //     },
        //     method: 'post',
        //     success: function (res) {
        //         if (res.data.code == 1) {
        //             that.setData({
        //                 chatShow: true,
        //             })
        //         }
        //     }
        // })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this
        util.request({
            url: '/api/saas/home',
            data: {
                schoolid: app.globalData.schoolid,
                page: that.data.page,
            },
            success(res) {
                if (res.data.code == 1) {
                    var newsList = that.data.newsList.concat(res.data.data)
                    that.setData({
                        newsList: newsList,
                        page: that.data.page + 1
                    })
                    wx.showToast({
                        title: '加载中...',
                        icon: 'loading'
                    })
                } else {
                    wx.showToast({
                        title: '没有更多',
                        icon: 'none'
                    })
                }
            }
        })
    },
    onShareAppMessage: function (option) {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        var that = this;
        if (app.globalData.schoolType === 0) {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 406
            })
        } else {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 306
            })
        }
        var schid = app.globalData.schoolid;
        return {
            title: that.data.schoolInfo.name,
            path: "/packageChoose/page/public/index/index?id=" + schid + '&isretrue=1',
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    },
    //    群聊
    // chat(e) {
    //     var that = this;
    //     if (app.globalData.userInfo.id != 0) {
    //         util.request({
    //             url: '/api/school/group_chat',
    //             data: {
    //                 'sid': app.globalData.schoolid
    //             },
    //             method: 'post',
    //             success: function (res) {
    //                 if (res.data.code == 1) {
    //                     that.setData({
    //                         groupId: res.data.accesskey
    //                     })
    //                 }
    //                 wx.navigateTo({
    //                     url: '../../ims/ims?groupId=' + that.data.groupId,
    //                 })
    //             }
    //         })
    //     } else {
    //         that.setData({
    //             showLogin: true
    //         })
    //     }
    // }
})