//获取应用实例
const app = getApp()
var answer = [];
const util = require('../../../utils/util.js');
Page({
    data: {
        qalist: [],
        answer: [],
        count: 0,
        page: 0,
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        typeId: 0,

    },
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/test/index',
            data: {
                type: options.type
            },
            success: function(res) {
                var qalist = res.data.list;
                var count = res.data.all_num;
                var page = 1;
                var current = 0;
                that.setData({
                    qalist: qalist,
                    count: count,
                    page: page,
                    current: current,
                    typeId: options.type
                });
            },
        })
    },
    //禁止swiper手动滑动
    catchTouchMove: function(res) {
        return false
    },

    addBtn: function(e) {
        var url = '';
        var ansurl = '';
        var dataset = e.target.dataset;
        var current = dataset.index; //拿到是第几个数组
        console.log(current);
        
        var that = this;
        var type = that.data.type
        var qa = dataset.qa;
        answer[current - 1] = qa;
        console.log(answer[current-1]);
        
        // ansurl = '../answer/job';
        ansurl = '../../career/answer/job?type=' + this.data.typeId;

        if (that.data.count == current) {
            util.request({
                url: '/api/test/reckon_job',
                data: {
                    answer: answer,
                    uid: app.globalData.userid
                },
                success: function(res) {
                    var type = that.data.type
                    if (res.data.code == 1) {
                        wx.navigateTo({
                            url: ansurl
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            duration: 2000
                        });
                        wx.navigateTo({
                            url: ansurl
                        })
                    }
                },
            });
            return;
        }

        that.setData({
            current: current,
            answer: answer,
        });
    },

})