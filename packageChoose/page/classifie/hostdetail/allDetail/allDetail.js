// packageChoose/page//classifie/hostdetail/allDetail/allDetail.js

const app = getApp();
const until = require('../../../../../utils/util.js');
const count = require('../../../../../utils/count.js');
var WxParse = require('../../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allData:""
    },
    fetchAllData(sid){
        var that = this;
        until.request({
            url: '/api/classifie/school_description',
            data: {
                'sid': sid
            },
            method: 'post',
            success: (res) => {
              
                console.log(res);
                if (res.data.code === 1) {
                    WxParse.wxParse('txtNew', 'html', res.data.list, that, 5);
                    this.setData({
                        allData: res.data.list
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
        console.log(options);
        this.fetchAllData(options.sid);

        app.globalData.schoolid = options.sid
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
        count.statistics({
            objectType: 0,
            isOut: 1,
            schoolId: app.globalData.schoolid,
            objectId: 112
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0, 
            isOut:1,
            schoolId: app.globalData.schoolid,
            objectId: 112
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut: 1,
            schoolId: app.globalData.schoolid,
            objectId: 112
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
        count.share({
            schoolId: app.globalData.schoolid,
            objectType: 3,
            objectId: 112
        })
    }
})