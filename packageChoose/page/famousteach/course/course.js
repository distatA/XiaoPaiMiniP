// packageChoose/page//famousteach/course/course.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData: 1, //当前页面
        navList: [], //导航
        courseContent: [], //课程内容
        courseRecord: {}, //课程记录
        page: 1,
        user: {},
        genre:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    },
    tabClick: function(e) {
        var that = this;
        if (that.data.currentData === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentData: e.target.dataset.current
            });
        }
        util.request({
            url: '/api/course/home',
            data: {
                'genre': e.target.dataset.current,
                'uid': app.globalData.userInfo.id,
                'page':1
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        courseContent: res.data.list,
                        genre: e.target.dataset.current
                    })
                } else {
                    that.setData({
                        courseContent: 0,
                        page:1
                    })
                }
            }
        })
    },
    goCourse: function(e) {
        var key = e.currentTarget.dataset.key;
        wx.navigateTo({
            url: '../recommend/recommend?key=' + key,
        })
    },
    goChapter: function(e) {
        var key = e.currentTarget.dataset.key;
        wx.navigateTo({
            url: '../recommend/recommend?key=' + key,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        util.request({
            url: '/api/course/index',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        navList: res.data.genre,
                        courseRecord: res.data.record,
                        user: app.globalData.userInfo,
                    })
                }
            }
        })
        util.request({
            url: '/api/course/home',
            data: {
                'genre': that.data.genre,
                'uid': app.globalData.userInfo.id,
                'page': 1
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        courseContent: res.data.list,
                    })
                } else {
                    that.setData({
                        courseContent: 0,
                        page: 1
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var that = this;
        util.request({
            url: '/api/course/index',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        navList: res.data.genre,
                        courseRecord: res.data.record,
                        user: app.globalData.userInfo,
                    })
                }
            }
        })
        util.request({
            url: '/api/course/home',
            data: {
                'genre': that.data.genre,
                'uid': app.globalData.userInfo.id,
                'page': 1
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        courseContent: res.data.list,
                    })
                } else {
                    that.setData({
                        courseContent: 0,
                        page: 1
                    })
                }
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this
        let page = that.data.page + 1
        util.request({
            url: '/api/course/home',
            data: {
                'uid': app.globalData.userInfo.id,
                'page': page,
                'genre': that.data.genre
            },
            success(res) {
                if (res.data.code == 1) {
                    var courseContent = that.data.courseContent.concat(res.data.list)
                    that.setData({
                        courseContent: courseContent,
                        page: page
                    })
                    wx.showToast({
                        title: '加载中...',
                        icon: 'loading'
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    },

})