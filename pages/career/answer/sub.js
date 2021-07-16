//获取应用实例
const app = getApp()
var wxCharts = require("../../../utils/utils/wxcharts-min.js");
var windowW = 0;
const util = require('../../../utils/util.js');
Page({
    data: {
        data: {},
        neirong:"",
        currentData: 1
    },
    clickTab(e) {
        if (this.data.currentData == e.currentTarget.dataset.current) {
            return false;
        } else {
            this.setData({
                currentData: e.currentTarget.dataset.current
            })
        }
    },
    onLoad: function(option) {
        var that = this;
        util.request({
                url: '/api/test/get_test_result',
                data: {
                    type: option.type,
                    uid: app.globalData.userid
                },
                success: function(res) {
                    if (res.data.code == 1) {
                        var neirong = res.data.list.neirong
                        var data = res.data.list.info;
                        var model = res.data.list.model;
                        var num = res.data.list.num;
                        that.setData({
                            data: data,
                            neirong: neirong
                        });
                        new wxCharts({
                            canvasId: 'columnCanvas',
                            type: 'column',
                            categories: model,
                            series: [{
                                name: '学科强弱测试',
                                data: num
                            }],
                            yAxis: {
                                format: function(val) {
                                    return val;
                                }
                            },
                            width: 300,
                            height: 250,
                            dataLabel: false
                        });
                    } else {
                        that.setData({
                            data: ''
                        });
                        wx.showToast({
                            title: '暂无数据',
                            icon:'none',
                            duration: 2000
                        });
                    }
                },
                fail: function(e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            }),

            wx.getSystemInfo({
                success: function(res) {
                    var clientHeight = res.windowHeight,
                        clientWidth = res.windowWidth,
                        rpxR = 750 / clientWidth;
                    var calc = clientHeight * rpxR - 180;
                    that.setData({
                        winHeight: calc
                    });
                }
            });
        /*********折现图***********/

        // 屏幕宽度
        this.setData({
            imageWidth: wx.getSystemInfoSync().windowWidth,
        });
        //计算屏幕宽度比列
        windowW = this.data.imageWidth / 375;

    },
})