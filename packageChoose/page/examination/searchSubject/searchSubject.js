// packageChoose/page//examination/searchCollege/searchCollege.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /*
     * 页面的初始数据
     */
    data: {
        searchList: [],
        searchValue: '',
    },
    bingSearch(e) {
        var that = this;
        that.setData({
            searchValue: e.detail.value
        })
        util.request({
            url: '/api/entrance/search_school',
            data: {
                type: app.globalData.exam.type,
                name: e.detail.value,
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        searchList: res.data.list,
                    })
                }
            }
        })
    },
    clear: function() {
        this.setData({
            searchValue: ''
        })
    },
    //前往详情
    search(e) {
        var name = this.data.searchValue;
        wx.navigateTo({
            url: '../subjectDetails/subjectDetails?name=' + name,
        })
    },
    subjectDetail(e) {
        var name = e.currentTarget.dataset.item.name;
        this.setData({
            searchValue: name,
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.globalData.exam.type = options.type
        var that = this;
        util.request({
            url: '/api/entrance/search_school',
            data: {
                'type': app.globalData.exam.type,
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        searchList: res.data.list
                    })
                }
            }
        })
    },
    goBack(e) {
        var that = this;
        util.request({
            url: '/api/entrance/search_school',
            data: {
                'type': app.globalData.exam.type,
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        searchList: res.data.list
                    })
                }
            }
        });
        that.clear();
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
        util.request({
            url: '/api/index/share',
            data: {
                uid: app.globalData.userInfo.id
            }
        });
    }
})