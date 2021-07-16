// packageChoose/page//classifie/hostdetail/rulesDetail/rulesDetail.js
const app = getApp();
const until = require('../../../../../utils/util.js');
var WxParse = require('../../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailData:[],
        id:''
    },

    //获取招生简章详情数据
    fetchSchoolDetail(id) {
        var that=this;
        until.request({
            url: '/api/classifie/school_enroll_details',
            data: {
                'id': id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    WxParse.wxParse('txtNew', 'html', res.data.list.content, that, 5);
                    that.setData({
                        detailData: res.data.list,
                        id: id
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.list.title,
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
        this.fetchSchoolDetail(options.id)
        // console.log(options)
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
        return{
            title:this.data.detailData.title,
            path:'/packageChoose/page/classifie/hostdetail/rulesDetail/rulesDetail?id='+this.data.id
        }
    }
})