// packageChoose/page//international/share/share.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        popup:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    formSubmit(e) {
        var that = this;
        wx.request({
            url: app.globalData.hostNewApiUrl + 'international/add_content',
            method: 'POST',
            data: {
                "int_id": 9999,
                "name": e.detail.value.name,
                "mobile": e.detail.value.mobile
            },
            success: function (res) {
                if (res.data.code === 1) {
                    wx.showToast({
                        title: '申请成功',
                        duration: 2000
                    });
                    that.setData({
                        popup: false
                    })

                }
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
    },
    show(){
        this.setData({
            popup: true
        })
    },
    close() {
        this.setData({
            popup: false
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
    }
})