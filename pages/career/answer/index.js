//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
var windowW = 0;
Page({
    data: {
        xinlidata: [],
        xinlizongti: [],
        showE: '',
        showS: '',
        showT: '',
        showJ: '',
        currentData:1
    },
    clickTab(e){
        if(this.data.currentData==e.currentTarget.dataset.current){
            return false;
        }else{
            this.setData({
                currentData:e.currentTarget.dataset.current
            })
        }
    },
    onLoad: function(option) {
        var that = this;
        util.request({
            url: '/api/test/get_test_result',
            data: {
                type: option.type,
                uid: app.globalData.userInfo.id
            },
            success: function(res) {
                if (res.data.code == 1) {
                    var data = res.data.list.info;
                    var zongti = res.data.list.jieguo;
                    console.log(zongti);
                    var showE = '';
                    var showS = '';
                    var showT = '';
                    var showJ = '';
                    if (zongti.E <= zongti.I) {
                        showE = false;
                    } else {
                        showE = true;
                    }

                    if (zongti.S <= zongti.N) {
                        showS = false;
                    } else {
                        showS = true;
                    }

                    if (zongti.T <= zongti.F) {
                        showT = false;
                    } else {
                        showT = true;
                    }

                    if (zongti.J <= zongti.P) {
                        showJ = false;
                    } else {
                        showJ = true;
                    }

                    that.setData({
                        xinlidata: data,
                        xinlizongti: zongti,
                        showE: showE,
                        showS: showS,
                        showT: showT,
                        showJ: showJ
                    });
                } else {
                    that.setData({
                        xinlidata: ''
                    });
                    wx.showToast({
                        title: '暂无数据',
                        icon:'none',
                        duration: 2000
                    });
                }
            },
        })
    },
})