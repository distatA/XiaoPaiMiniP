const app = getApp()
const util = require('../../utils/util.js');
Component({
    options: {
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        url: {
            type: String,
            value: '标题'
        },
        showLoginForm: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showLoginForm: false,
    },
    ready: function () {
        // console.log(this.properties)
    },
    /**
     * 组件的方法列表
     */
    methods: {
        showLoginForm() {
            this.setData({
                showLoginForm: false,
            })
        },
        onGotUserInfo(e) {
            var that = this;
            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo']) {
                        wx.login({
                            success: function (res) {
                                var userInfo = e.detail.userInfo;
                                var code = res.code;
                                util.request({
                                    url: '/api/login/wx_login',
                                    data: {
                                        code: res.code
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
                                            that.setData({
                                                showLoginForm: false,
                                                userInfo: app.globalData.userInfo,
                                                hasUserInfo: app.globalData.isLogin
                                            })
                                            that.triggerEvent('loginSuccess', {isLogin:true})
                                        } else {
                                            // console.log(that.data.url)
                                            
                                            wx.navigateTo({
                                                url: that.data.url+"?code=" + code + '&nickname=' + userInfo.nickName + '&head_pic=' + userInfo.avatarUrl + '&sex=' + userInfo.gender,
                                            })
                                        }

                                    }
                                })
                            }
                        })
                    } else {
                        // console.log("s")
                    }
                },
                fail(res){
                    // console.log(res)
                }
            })
        }
    }
})