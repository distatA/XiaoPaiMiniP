// pages/question/question.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        exam_type_id: "",
        time: "",
        questionNum: "",
        province:'',
    },
    startAnswer() {
        wx.navigateTo({
            url: '../answer/answer?exam_type_id=' + this.data.exam_type_id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let exam_type_id = options.exam_type_id;
        let time = options.time;
        let questionNum = options.questionNum;
        this.setData({
            exam_type_id: exam_type_id,
            time: time,
            questionNum: questionNum,
            province: app.globalData.province.id
        })
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
})