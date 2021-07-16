// packageChoose/page//examination/subjectDetails/subjectDetails.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolList: [],
        page: 1,
        name: ''
    },
    schoolDetail(e) {
        var name = e.currentTarget.dataset.item.name;
        console.log(name)
        wx.navigateTo({
            url: '../college/college?name=' + name,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/entrance/career_school',
            data: {
                career_name: options.name,
                province: app.globalData.exam.province,
                year: app.globalData.exam.year,
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        schoolList: res.data.info.school_list,
                        name: options.name,
                        number: res.data.info.college_length
                    })
                } else if (res.data.code === 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 0
                        })
                    }, 1000);
                }
            }
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
            url: '/api/entrance/career_school',
            data: {
                career_name: that.data.name,
                province: app.globalData.exam.province,
                year: app.globalData.exam.year,
                page: page
            },
            success(res) {
                if (res.data.code == 1) {
                    if (that.data.schoolList.length < res.data.info.college_length) {
                        var schoolList = that.data.schoolList.concat(res.data.info.school_list)
                        that.setData({
                            schoolList: schoolList,
                            page: page
                        })
                        wx.showToast({
                            title: '加载中...',
                            icon: 'loading'
                        })
                    }
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
                uid: app.globalData.userInfo.id
            }
        });
    }
})