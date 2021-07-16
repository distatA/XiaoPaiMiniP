// pages/answer/answer.js
const app = getApp()
const util = require('../../../../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        select: 'https://new.schoolpi.net/attach/small_program/classify/select.png',
        selected: 'https://new.schoolpi.net/attach/small_program/classify/selected.png',
        questionList: [],
        current: 1,
        list: [{
            value: 'A'
        }],
        exam_type_id: '',
        showTips: true,
        min:"",
        sec:"",
        timeCost:0,
        province: 0,
    },
     //倒计时
     timerSec(cycleTime) {
        var that = this
        let intervalsec = null //倒计时函数
        intervalsec = setInterval(function () {
            cycleTime--;
            that.data.timeCost++
            that.setData({
                min: parseInt(cycleTime / 60) < 10 ? '0' + parseInt(cycleTime / 60) : parseInt(cycleTime / 60),
                sec: (cycleTime % 60) < 10 ? '0' + (cycleTime % 60) : (cycleTime % 60),
            })
            if (cycleTime == 0) {
                that.submit()
                clearInterval(intervalsec)
            }
        }, 1000)
    },
    //
    selectAnswer(e) {
        let index = e.currentTarget.dataset.index;
        let answer = e.currentTarget.dataset.answer;
        let questionList = this.data.questionList;
        questionList.forEach((item, i) => {
            if (index == i) {
                item.value = answer
            }
        })
        this.setData({
            questionList: questionList
        })
    },
    //上一题
    previous() {
        if (this.data.current > 1) {
            this.setData({
                current: this.data.current - 1
            })
        }
    },
    //下一题
    next() {
        let questionList = this.data.questionList;
        if(this.data.province==14234){
            if (questionList[this.data.current - 1].value.length > 0) {
                if (this.data.current >= 1 && this.data.current < this.data.questionList.length) {
                    this.setData({
                        current: this.data.current + 1,
                        showTips: true
                    })
                }
            } else {
                this.setData({
                    showTips: false
                })
            }
        } else if (this.data.province == 10808){
            if (questionList.length > 0) {
                if (this.data.current >= 1 && this.data.current < this.data.questionList.length) {
                    this.setData({
                        current: this.data.current + 1,
                        showTips: true
                    })
                }
            } else {
                this.setData({
                    showTips: false
                })
            }
        }
        

    },
    //提交答案
    submit() {
        var that = this;
        let list = that.data.questionList;
        let answer = [];
        let exam_type_id = that.data.exam_type_id;
        list.forEach(item => {
            answer.push(item.value)
        })
        util.request({
            url: '/api/classifie/exam_topic_judge',
            data: {
                'exam_type_id': exam_type_id,
                'fruit': answer
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    let result = JSON.stringify(res.data.list)
                    wx.navigateTo({
                        url: `../result/result?result=${result}&timeCost=${that.data.timeCost}&successNum=${res.data.data.success_num}&errorNum=${res.data.data.error_num}&id=` + exam_type_id
                        // url: '../result/result?result=' + result,
                    })
                }
            },
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            province: app.globalData.province.id
        })
        util.request({
            url: '/api/classifie/exam_topic',
            data: {
                'exam_type_id': options.exam_type_id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    let list = res.data.list;
                    let questionList = []
                    list.forEach(item => {
                        let obj = new Object();
                        obj.question = item;
                        obj.value = ""
                        questionList.push(obj)
                    })
                    that.timerSec(res.data.exam_time*60)
                    that.setData({
                        questionList: questionList,
                        exam_type_id: options.exam_type_id
                    })
                }
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },


})