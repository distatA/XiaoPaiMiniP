// packageChoose/page//examination/formulate/formulate.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentProvince: "",
        currentData: 0,
        list: [],
        year: [],
        // 年份选择显示 
        currentYear: 0,
    },
    // 选择省份
    selectCity(e) {
        var that = this;
        that.setData({
            currentProvince: e.target.dataset.item.province,
            year: e.target.dataset.item.year,
            currentYear: e.currentTarget.dataset.item.year
        });
        app.globalData.exam.year = e.currentTarget.dataset.year
    },
    //选择年份
    selectYear(e) {
        var that = this;
        that.setData({
            currentYear: e.currentTarget.dataset.year
        })
        //赋值给全局变量
        app.globalData.exam.year = e.currentTarget.dataset.year
    },
    goNext(e) {
        var year=e.currentTarget.dataset.year;
        var province = e.currentTarget.dataset.province;
        app.globalData.exam.province = province;
        app.globalData.exam.year = year;
        wx.navigateTo({
            url: '../index/index'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/entrance/index',
            data: {
                'uid': app.globalData.userInfo.id,
                'province': app.globalData.province.id
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    res.data.list.forEach(item => {
                        if (item.is_default == 1) {
                            that.setData({
                                currentProvince: item.province, 
                                currentYear:item.year,
                                year:item.year
                            })
                        }
                    })
                    that.setData({
                        list: res.data.list,
                    })
                }
            }
        })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        return{
            title: '新高考',
            path: '/packageChoose/page/examination/formulate/formulate'
        }
    }
})