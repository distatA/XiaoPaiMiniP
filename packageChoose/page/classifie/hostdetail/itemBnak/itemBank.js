// packageChoose/page//classifie/detail/index.js
const app = getApp();
const until = require('../../../../../utils/util.js');
const count = require('../../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailData: [],
    },
    // 进入题库详情
    goDetail(e){
        console.log(e);
        var id = e.currentTarget.dataset.item.id;
        wx.navigateTo({
            url: '/packageChoose/page/classifie/historySubject/schoolSubjectDetail/schoolSubjectDetail?id=' + id,
        })
    },
    //获取院校数据详情数据
    fetchSchoolDetail(sid) {
        until.request({
            url: '/api/classifie/school_details',
            data: {
                'sid': sid
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        detailData: res.data.list
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.list.name,
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
    isShow(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            isshow: index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchSchoolDetail(options.sid);

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
            objectId: 111
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            isOut: 1, 
            schoolId: app.globalData.schoolid,
            objectId: 111
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
            objectId: 111
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
            objectType: 3,
            schoolId: app.globalData.schoolid,
            objectId: 111
        })
    }
})