//获取应用实例
const until = require('../../../utils/util.js');
const app = getApp()
var wxCharts = require("../../../utils/utils/wxcharts-min.js");
var windowW = 0;
Page({
    data: {
        showLogin: false,
        bank: [],
        detail: [],
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        celled: false,
        isretrue: 0,
        major_id:0,
    },
    onLoad: function(options) {
        var that = this;
        if (options.isretrue) {
            that.setData({
                isretrue: 1
            });
        }
        that.setData({
            major_id: options.id
        })
        

    },
    onShow(){
        var that = this;
        //获取专业详情数据
        until.request({
          url:'/api/job/detail',
            method: 'post',
            data: {
                'id': that.data.major_id,
                "uid": app.globalData.userInfo.id
            },
            success: function (res) {
                if (res.data.code == 1) {
                    var detail = res.data.detail;
                    var bank = res.data.bank;
                    that.setData({
                        detail: detail,
                        bank: bank,
                        celled: detail.celled
                    });
                    if(res.data.bank.is_shoucang==1){
                        that.setData({
                            celled:true
                        })
                    }
                } else {
                    that.setData({
                        data: "",
                        bank: "",
                        celled: false
                    });
                    wx.showToast({
                        title: res.data.msg,
                        icon:"none",
                        duration: 2000
                    });
                    setTimeout(function(){
                        wx.navigateBack({
                            delta: 1
                        })
                    },1000)
                }
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 180;
                that.setData({
                    winHeight: calc
                });
            }
        });
    },
    // 滚动切换标签样式
    switchTab: function(e) {
        this.setData({
            currentTab: e.detail.current
        });
        //this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
//专业收藏。
    shoucang: function(e) {
      
        var that = this;
        var sid = e.target.dataset.id;
        var celled = that.data.celled;
        if (app.globalData.userInfo.id!=0){
            until.request({
              url: '/api/usercell/job_cell',
                data: {
                  // 'uid': app.globalData.userid,
                  // 'career_id': that.data.careerId, 
                    'job_id': sid,
                    'uid': app.globalData.userInfo.id
                },
                method: 'post',
                success: function (res) {
                    if (celled) {
                        that.setData({
                            celled: false
                        })
                        wx.showToast({
                            title: "取消收藏",
                            duration: 2000
                        });
                    } else {
                        that.setData({
                            celled: true
                        })
                        wx.showToast({
                            title: "收藏成功",
                            duration: 2000
                        });
                    }
                
                },
                fail: function (e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            })
        }else{
            that.setData({
                showLogin: true
            })
        }
        

    },

    //分享按钮函数
    onShareAppMessage: function(ops) {
        var that = this;
        var eData = ops.target.dataset;
        var shareObj = {
            title: eData.title,
            path: '/pages/career/zhiye/details?isretrue=1&id=' + eData.id,
            success: function(res) {
            },
            fail: function(res) {
            }
        };
        if (ops.from === 'button') {
            shareObj.title = eData.title;
            shareObj.path = '/pages/career/zhiye/details?isretrue=1&id=' + eData.id;
        }
        return shareObj;
    }
})