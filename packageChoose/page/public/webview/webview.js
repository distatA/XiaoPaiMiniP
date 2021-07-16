// pages/webview/webview.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: '',
        currentUrl: '',
        showPay: false,
        amount: '',
        name: '',
    },
    onLoad: function(option) {
        var that = this;
        that.setData({
            currentUrl: option.vr_url
        })
        that.jumpvr();
    },
    onShow(option) {
        // console.log(option.vr_url)
        // var that = this;
        // that.setData({
        //     currentUrl: option.vr_url
        // })
        this.jumpvr();
    },
    onHide() {

    },
    onUnload() {


    },
    // 全景支付
    jumpvr() {
        var that = this;
        var vr_url = that.data.vr_url;
        util.request({
            url: '/api/school/empower_vr',
            data: {
                "sid": app.globalData.schoolid,
                'uid': app.globalData.userInfo.id,
            },
            success: function(res) {
                console.log(res.data.code)
                // if (res.data.code == 1 || res.data.code == 0) {
                //     that.setData({
                //         showPay: true,
                //         amount: res.data.amount,
                //         name: res.data.name,
                //     });
                // }else {
                //     that.setData({
                //         showPay: false,
                //         url: that.data.currentUrl
                //     })
                // }
                that.setData({
                    showPay: false,
                    url: that.data.currentUrl
                })
            }
        })
    },
    // 取消支付
    reject() {
        var that = this;
        that.setData({
            showPay: false,
        })
        wx.navigateBack({
            delta: 1
        })
    },
    // 支付
    affirm() {
        var that = this;
        util.request({
            url: '/api/pay/wxpay',
            data: {
                openid: app.globalData.userInfo.openid,
                uid: app.globalData.userInfo.id,
            },
            success: function(result) {
                var result = JSON.parse(result.data.data)
                wx.requestPayment({
                    timeStamp: result.timeStamp,
                    nonceStr: result.nonceStr,
                    package: result.package,
                    signType: 'MD5',
                    paySign: result.paySign,
                    success(res) {
                        that.setData({
                            showPay: false,
                            url: that.data.currentUrl
                        })
                    },
                    fail(res) {}
                })
            }
        })
    },
    onShareAppMessage: function (ops) {
        console.log(this.data.currentUrl)
        return {
            title: 'VR校园',
            path: "packageChoose/page/public/webview/webview?vr_url="+this.data.currentUrl,
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    }
})