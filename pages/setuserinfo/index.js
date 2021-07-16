const app = getApp()
const util = require('../../utils/util.js');
Page({
    data: {
        getPhone:false,
        getUserInfo:true,
        option:{}
    },
    onLoad: function(options) {
        var that = this;
        that.setData({
            option:options
        })

    },
    getPhoneNumber(e) {
        var that = this;
        var option = that.data.option;
        wx.login({
            success: function (res) {
                util.request({
                    url: '/api/login/wx_register',
                    data: {
                        code: res.code,
                        iv: e.detail.iv,
                        encryptedData: e.detail.encryptedData,
                        nickname: option.nickname,
                        head_pic: option.head_pic,
                        sex: option.sex,
                        province: app.globalData.province.id,
                        city: app.globalData.province.cid
                    },
                    success: function (res) {
                        if (res.data.code === 1) {
                            app.globalData.userInfo = res.data.info;
                            app.globalData.isLogin = true;
                            app.globalData.userid = res.data.info.id;
                            wx.setStorage({
                                key: 'userInfo',
                                data: res.data.info,
                            })
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    }
                })
            }
        })
        
    },
    goDetails(){
        wx.navigateTo({
            url: '../agreement/agreement?agreement=4',
        })
    }
})