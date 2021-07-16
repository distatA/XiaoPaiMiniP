const util = require('../../../utils/util.js');
// const count = require('../../../utils/count.js');
var WxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 1, //当前页面
        schoolInfo: {}, //学校信息
        guide: [], //招生简章
        major: [], //招生专业
        major_num: 0, //专业招生总人数
        navList: [{
            id: 1,
            title: '学校介绍'
        }, {
            id: 2,
            title: '招生简章'
        }, {
            id: 3,
            title: '招生专业'
        }, {
            id: 4,
            title: '考试报名'
        }],
        exam: [{
            title: '01.报名时间',
            content: '',
            url: "https://new.schoolpi.net/attach/small_program/qiangji/signtime.png"
        }, {
            title: '02.报名方式',
            content: '',
            url: "https://new.schoolpi.net/attach/small_program/qiangji/sign.png"
        }, {
            title: '03.校考时间',
            content: '',
            url: "https://new.schoolpi.net/attach/small_program/qiangji/examtime.png"
        }, {
            title: '04.校考地址',
            content: '',
            url: "https://new.schoolpi.net/attach/small_program/qiangji/address.png"
        }],
        // showLoginForm: false //登录弹窗
    },
    // 登录
    // 弹框后点击立即登录
    // onGotUserInfo(e) {
    //     var that = this;
    //     wx.getSetting({
    //         success(res) {
    //             if (res.authSetting['scope.userInfo']) {
    //                 wx.login({
    //                     success: function(res) {
    //                         var userInfo = e.detail.userInfo;
    //                         var code = res.code;
    //                         util.request({
    //                             url: '/api/login/wx_login',
    //                             data: {
    //                                 code: res.code
    //                             },
    //                             success: function(res) {
    //                                 if (res.data.code === 1) {
    //                                     app.globalData.userInfo = res.data.info;
    //                                     app.globalData.isLogin = true;
    //                                     app.globalData.userid = res.data.info.id;
    //                                     wx.setStorage({
    //                                         key: 'userInfo',
    //                                         data: res.data.info,
    //                                     })
    //                                     that.setData({
    //                                         showLoginForm: false,
    //                                         userInfo: app.globalData.userInfo,
    //                                         hasUserInfo: app.globalData.isLogin,
    //                                         integral: res.data.info.integral,
    //                                         year:res.data.info.year
    //                                     })
    //                                 } else {
    //                                     wx.navigateTo({
    //                                         url: '../../setuserinfo/index?code=' + code + '&nickname=' +userInfo.nickName + '&head_pic=' + userInfo.avatarUrl + '&sex=' +userInfo.gender,
    //                                     })
    //                                 }

    //                             }
    //                         })
    //                     }
    //                 })
    //             } else {

    //             }
    //         }
    //     })

    // },
    // 暂不登录
    // showLoginForm() {
    //   this.setData({
    //     showLoginForm: false
    //   })
    // },
    // vr跳转
    jumpvr(e) {
        var vr_url = e.currentTarget.dataset.link;
        // if (app.globalData.userInfo.id != 0) {
            // that.setData({
            //     showLogin: true
            // })
            // wx.navigateTo({
            //     url: '../../../packageChoose/page/public/webview/webview' + '?vr_url=' + vr_url
            // })
        // }else {
        //     this.setData({
        //     //   showLoginForm: true
        //     })
        // }
        if (vr_url != 0) {
            wx.navigateTo({
                url: '../../../packageChoose/page/public/webview/webview' + '?vr_url=' + vr_url
            })
        }
    },
    // 导航切换
    clickTab(e) {
        this.setData({
            currentIndex: e.currentTarget.dataset.current
        })
    },
    goDetails(e){
        wx.navigateTo({
            url: '../guide/guide?id='+e.currentTarget.dataset.id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: '加载中···',
        })
        util.request({
            url: '/api/reform/school_details',
            data: {
                sid: options.id
            },
            success: function(res) {
                if (res.data.code == 1) {
                    wx.hideLoading()
                    var content = util.format(res.data.school.description)
                    WxParse.wxParse('txtNew', 'html', content, that, 5);
                    var exam = that.data.exam
                    if (res.data.ksbm) {
                        exam[0].content = res.data.ksbm.bmsj;
                        exam[1].content = res.data.ksbm.bmfs;
                        exam[2].content = res.data.ksbm.xksj;
                        exam[3].content = res.data.ksbm.xkdz;
                    }
                    that.setData({
                        schoolInfo: res.data.school,
                        guide: res.data.enroll,
                        major: res.data.major,
                        major_num: res.data.major_num,
                        exam: exam
                    });
                }else{
                    wx.hideLoading()
                }
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
        console.log(this.data.schoolInfo)
        return{
            title: this.data.schoolInfo.name,
            path: '/pages/enrollmentReform/school/school?sid=' + this.data.schoolInfo.sid
        }
    }
})