// packageChoose/page//examination/college/college.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolInfo:{},
        name:'',
        id:'',
    },
    goSchool(e){
        wx.navigateTo({
            url: '/pages/tabBar/school/details/details?id=' + e.currentTarget.dataset.id,
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        console.log(options)
        if(options.type){
            util.request({
                url: '/api/entrance/school_details',
                data: {
                    college: options.name,
                    choosen_subjects: options.subjectsName.split(","),
                    province: app.globalData.exam.province,
                    year: app.globalData.exam.year,
                    desc:1
                },
                method: 'post',
                success(res) {
                    if (res.data.code === 1) {
                        that.setData({
                            schoolInfo: res.data.info,
                            name: options.name,
                            id: options.id,
                        })
                    } else if (res.data.code === 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 0
                            })
                        }, 2000);

                    }
                }
            })
        }else{
            util.request({
                url: '/api/entrance/detail_school',
                data: {
                    name: options.name,
                    sid: options.id,
                    province: app.globalData.exam.province,
                    year: app.globalData.exam.year
                },
                method: 'post',
                success(res) {
                    if (res.data.code === 1) {
                        that.setData({
                            schoolInfo: res.data.info,
                            name: options.name,
                            id: options.id,
                        })
                    } else if (res.data.code === 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 0
                            })
                        }, 2000);

                    }
                }
            })
        }

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
        return {
            title: '开设院校',
            path: '/packageChoose/page/examination/college/college?name=' + this.data.name + '&id=' + this.data.id
        }
    }
})