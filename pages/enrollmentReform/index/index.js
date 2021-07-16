const util = require('../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: [{
            id: 1,
            imgUrl: 'https://new.schoolpi.net/attach/small_program/qiangji/ic-allschool.png',
            title: '全部高校'
        }, {
            id: 2,
            imgUrl: 'https://new.schoolpi.net/attach/small_program/qiangji/ic-process.png',
            title: '报考流程'
        }, {
            id: 3,
            imgUrl: 'https://new.schoolpi.net/attach/small_program/qiangji/ic-policy.png',
            title: '政策解读'
        }],
        schoolList: [], //热门院校
        bannerList: [], //轮播图
    },
    // 全部高校、报考流程、政策解读
    next(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id=' + id,
        })
    },
    // 广告页跳转
    goAd(e) {
        let media = e.currentTarget.dataset.media;
        let link = e.currentTarget.dataset.link;
        let id = e.currentTarget.dataset.id;
        console.log(media)
        console.log(link)
        console.log(id)
        if (media == 0) {
            return;
        } else if (media == 1) {
            wx.navigateTo({
                url: link,
            })
        } else if (media == 4) {
            wx.navigateTo({
                url: "/pages/webview/index?url=" + link,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 首页轮播
        util.request({
            url: '/api/ad/rotation_reform',
            data: {
                province: app.globalData.province.id
            },
            success: function(res) {
                that.setData({
                    bannerList: res.data.banlist
                });
            },
        });
        // 热门院校
        util.request({
            url: '/api/reform/school_hot',
            success: function(res) {
                that.setData({
                    schoolList: res.data.data
                });
            },
        });
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})