// packageChoose/page//famousteach/recentLearn/recentLearn.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courseList: [], //课程列表
        page:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/course/learning',
            data: {
                'uid': app.globalData.userInfo.id,
                page:1
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        courseList: res.data.data
                    })
                }
            }
        })

    },
    goChapter: function(e) {
        let key = e.currentTarget.dataset.key;
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        let page = that.data.page + 1
        util.request({
            url: '/api/course/learning',
            data: {
                'uid': app.globalData.userInfo.id,
                'page': page,
            },
            success(res) {
                if (res.data.code == 1) {
                    var courseList = that.data.courseList.concat(res.data.data)
                    that.setData({
                        courseList: courseList,
                        page: page
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
    }
})