// packageChoose/page//classifie/hostdetail/scienceDetail/scienceDetail.js
const app = getApp();
const until = require('../../../../../utils/util.js');
const count = require('../../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scienceData:[]
    },
    fetchScienceDetail(sid){
        until.request({
            url: '/api/classifie/school_img',
            data: {
                'sid': sid
            },
            method: 'post',
            success: (res) => {
                // console.log(res);
                if (res.data.code === 1) {
                    this.setData({
                        scienceData: res.data.list
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       this.fetchScienceDetail(options.sid);
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
        count.calEnterTime(); //统计埋点-记录进入时间
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            objectId: 113
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            objectId: 113
        })
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
        count.statistics({
            objectType: 3,
            objectId: 113
        })
    }
})