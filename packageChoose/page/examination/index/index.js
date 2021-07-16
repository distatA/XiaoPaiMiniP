// packageChoose/page//examination/index/index.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        year:2020,
        province:''
    },
    goBack(){
        wx.navigateBack({
            delta: 1
        })
    },
    // 搜索学校
    searchCollege(){
        wx.navigateTo({
            url: '../searchCollege/searchCollege?type=1',
        })
    },
    // 搜索专业
    searchSubject(){
        wx.navigateTo({
            url: '../searchSubject/searchSubject?type=2',
        })
    },
    // 选考
    goSubject(){
        wx.navigateTo({
            url: '../subject/subject',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        that.setData({
            year:app.globalData.exam.year,
            province: app.globalData.exam.province
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        return {
            title: '新高考',
            path: '/packageChoose/page/examination/index/index'
        }
    }
})