// packageChoose/page//famousteach//teach/teach.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1, //分页
        teachList: [], //课程
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/course/lists',
            data: {
                'uid': app.globalData.userInfo.id,
                "page": 1
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        teachList: res.data.data,
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
        var that = this
        util.request({
            url: '/api/course/lists',
            data: {
                'uid': app.globalData.userInfo.id,
                "page": 1
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        teachList: res.data.data,
                        page: 1
                    })
                    wx.showToast({
                        title: '正在刷新',
                        icon: 'loading'
                    })
                }
                wx.stopPullDownRefresh()
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
            url: '/api/course/lists',
            data: {
                'uid': app.globalData.userInfo.id,
                'page': page,
            },
            success(res) {
                if (res.data.code == 1) {
                    var teachList = that.data.teachList.concat(res.data.data)
                    that.setData({
                        teachList: teachList,
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
    }
})