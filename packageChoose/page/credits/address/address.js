const app = getApp()
const util = require('../../../../utils/util.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: '请选择省市', //省市
        nameValue: '', //姓名
        phoneValue: '', //电话
        addressValue: '', //地址
    },
    // 省市
    regionChange: function(e) {
        var that = this;
        that.setData({
            region: e.detail.value
        })
    },
    // 姓名
    nameInput(e) {
        var that = this;
        that.setData({
            nameValue: e.detail.value
        })
    },
    // 电话
    numberInput(e) {
        var that = this;
        that.setData({
            phoneValue: e.detail.value
        })
    },
    // 详细地址
    addressInput(e) {
        var that = this;
        that.setData({
            addressValue: e.detail.value
        })
    },
    // 提交和收货地址
    submit(e) {
        var that = this;
        util.request({
            url: '/api/user/address_edit',
            data: {
                'uid': app.globalData.userInfo.id,
                'name': e.currentTarget.dataset.name,
                'phone': e.currentTarget.dataset.phone,
                'region': e.currentTarget.dataset.region,
                'address': e.currentTarget.dataset.address
            },
            method: 'post',
            success(res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                })
                setTimeout(function(){
                    wx.navigateBack({
                        delta:1,
                    })
                },1000)
            }
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/user/address',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    var rules = util.format(res.data.rules.rules)
                    WxParse.wxParse('txtNew', 'html', rules, that, 5);
                    if (res.data.info.phone) {
                        that.setData({
                            phoneValue: res.data.info.phone,

                        })
                    }
                    if (res.data.info.region.length != 0) {
                        that.setData({
                            nameValue: res.data.info.name,
                            region: res.data.info.region,
                            addressValue: res.data.info.address,
                        })
                    }
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
               uid:app.globalData.userInfo.id
            }
        });
    }
})