// packageChoose/page//classifie/detail/index.js
const app = getApp();
const util = require('../../../../../utils/util.js');
const count = require('../../../../../utils/count.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailData: [],
        isshow: 3
    },
    //获取院校数据详情数据
    fetchSchoolDetail(sid) {
        util.request({
            url: '/api/classifie/school_details',
            data: {
                'sid': sid
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        detailData: res.data.list,
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.list.name+app.globalData.topTitle+'招生简章',
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
    // 进入详情
    goruleDetail(e){
        // console.log(e);
        var id=e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../rulesDetail/rulesDetail?id='+id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchSchoolDetail(options.sid);
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
            schoolId: app.globalData.schoolid,
            objectId: 108
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
            objectId: 108
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
            objectId: 108
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
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        count.share({
            objectType: 3,
            objectId: 108
        })
        return{
            title: this.data.detailData.name + app.globalData.topTitle + '招生简章',
            path: '/packageChoose/page/classifie/hostdetail/generalRules/generalRules?sid=' + this.data.detailData.sid
        }
    }
})