// pages/video/video.js
const app = getApp();
const util = require('../../../../utils/util.js');
const count = require('../../../../utils/count.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        videoList: [],
        videoimage: "block", //默认显示封面
        isNull: false,
        url: 'http://1256464449.vod2.myqcloud.com/840c2b4fvodcq1256464449/98a45a5a5285890787907606824/RyNe8wZsoZ4A.mp4',
        page: 1

    },
    //点击播放按钮，封面图片隐藏,播放视频
    play: function(e) {
        // wx.request({
        //     url: app.globalData.apiHost + '/api/lists/videohits',
        //     data: {
        //         schoolid: app.globalData.schoolid,
        //         id: e.currentTarget.dataset.id
        //     },
        //     success(res) {

        //     }
        // })
    },
    onReady() {
        // this.videoCtx = wx.createVideoContext('myVideo')
    },
    onLoad: function(options) {
        var that = this
        util.request({
            url: '/api/saas/lists',
            data: {
                schoolid: app.globalData.schoolid,
                mark: 5
            },
            success(res) {
                that.setData({
                    videoList: res.data.data,
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
                objectId: 411
            })
        } else {
            count.statistics({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 311
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
                objectId: 411
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 311
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
                objectId: 411
            })
        } else {
            count.statistics({
                objectType: 0,
                isOut: 1,
                schoolId: app.globalData.schoolid,
                objectId: 311
            })
        }
    },
    onShareAppMessage: function (option) {
        count.calLeaveTime(); //统计埋点-记录离开时间
        if (app.globalData.schoolType === 0) {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 411
            })
        } else {
            count.share({
                objectType: 0,
                schoolId: app.globalData.schoolid,
                objectId: 311
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
    //                             page: 13
    //                         },
    //                         success: function (res) {
    //                             console.log(state + ' add log success');
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
            url: '/api/lists/videos',
            data: {
                schoolid: app.globalData.schoolid,
                page: that.data.page
            },
            success(res) {
                if (res.data.code == 1) {
                    var arr = that.data.videoList.concat(res.data.data)
                    that.setData({
                        videoList: arr,
                        page: that.data.page + 1
                    })
                    wx.showToast({
                        title: '加载中...',
                        icon: 'loading'
                    })
                } else {
                    wx.showToast({
                        title: '没有更多',
                        icon: 'loading'
                    })
                }

            }
        })
    },

    
})