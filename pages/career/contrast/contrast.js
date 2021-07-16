// pages/career/contrast/contrast.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        school_list: [],
        deleteSch: [],
        all_school: '',
        school_arr: ''
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/reckon/school_contrast',
            data: {
                uid: app.globalData.userInfo.id,
                school_list: app.globalData.school_list
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        all_school: res.data.all_school,
                        school_arr: res.data.school_arr,
                        school_list: app.globalData.school_list
                    })
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        duration: 2000,
                        content: '还没有学校，赶快去添加吧~',
                        success: function(res) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    });
                }
            },
        })
    },
    // 添加对比
    goadd: function() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 删除对比
    goDelete: function(e) {
        var that = this;
        var school_list = app.globalData.school_list;
        var id = e.currentTarget.dataset.sid;
        var deleteSch = that.data.deleteSch;
        school_list.forEach((value, index, school_list) => {
            if (value.id == id) {
                school_list.splice(index, 1);
                deleteSch.push(id);
                app.globalData.school_list = school_list;
                app.globalData.deleteSch = deleteSch;
                util.request({
                    url: '/api/reckon/school_contrast',
                    data: {
                        uid: app.globalData.userInfo.id,
                        school_list: app.globalData.school_list
                    },
                    method: 'post',
                    success: function(res) {
                        if (res.data.code == 1) {
                            that.setData({
                                all_school: res.data.all_school,
                                school_arr: res.data.school_arr
                            })
                        } else {
                            that.setData({
                                all_school: [],
                                school_arr: []
                            })
                            wx.showModal({
                                title: '温馨提示',
                                duration: 2000,
                                content: '还没有学校，赶快去添加吧~',
                                success: function(res) {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }
                            });
                        }
                    },
                })
            }
        });

    },
    onShow: function() {

    }
})