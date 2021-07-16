//index.js
//获取应用实例
const app = getApp()
const util = require('../../../../../utils/util.js');
Page({
    data: {
        list: [],
        back_image: ""
    },
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: app.globalData.topTitle+'模拟考试',
        })
    },
    onShow() {
        var that = this;
        util.request({
            url: '/api/classifie/exam',
            data: {
                'province': app.globalData.province.id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    that.setData({
                        back_image: res.data.list.back_image
                    })
                }
            },
        });
        util.request({
            url: '/api/classifie/exam_type',
            data: {
                'province': app.globalData.province.id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    that.setData({
                        list: res.data.list
                    })
                }
            },
        });
    },
    selectQuestion(e) {
        let id = e.currentTarget.dataset.id
        let time = e.currentTarget.dataset.time
        let questionNum = e.currentTarget.dataset.questionnum
        wx.navigateTo({
            url: `../question/question?exam_type_id=${id}&questionNum=${questionNum}&time=${time}&backImg=${this.data.back_image}`,
        })
    },
    onShareAppMessage: function() {
        return{
            title: app.globalData.topTitle+"模拟考试",
            path:'/packageChoose/page/classifie/exam/index/index'
        }
    }
})