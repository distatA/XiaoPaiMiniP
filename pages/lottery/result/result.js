// pages/lottery/result/result.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    goMall(){
        wx.navigateTo({
            url: '/packageChoose/page/credits/mall/mall',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        var that = this;
        util.request({
            url: '/api/draw/share',
            data: {
                uid: app.globalData.userInfo.id
            },
            success(res) {
                that.setData({
                    showMasks: false
                })
            }
        });
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target)
        }
        return {
            title: '助力健康高考，校派在行动',
            imageUrl: 'https://new.schoolpi.net/attach/small_program/index/masks-share.png',
            path: '/pages/lottery/lottery'
        }
    }
})