// packageChoose/page//classifie/historySubject/SchoolBank/SchoolBank.js
const app = getApp();
const util = require('../../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subjectList:[],
    },

    //获取校考题库题目列表
    fetchPolicyList(sid) {
        var that = this;
        util.request({
            url: '/api/classifie/question_school_list',
            data: {
                'province': app.globalData.province.id,
                'sid': sid
            },
            method: 'post',
            success: (res) => {
                // console.log(res);
                if (res.data.code === 1) {
                    that.setData({
                        subjectList: res.data.list,
                    })
                }
            }
        })
    },
    // 进入真题详情
    gosubjectDetail(e){
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../subjectDetail/subjectDetail?id=' + id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchPolicyList(options.sid)
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