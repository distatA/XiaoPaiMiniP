// pages/tabBar/school/scores/scores.js
const app = getApp()
var WxParse = require('../../../../wxParse/wxParse.js');
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData: 0, //当前页面
        batch: {
        }, //批次
        course: {
        }, //文理
        year: {
        },
        school_score: [],
        career_score: [],
        select: false,
        select1: false,
        select2: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        var that = this;
        that.loadOption();
        let year = new Date().getFullYear();
        that.schoolScore(that.data.course.id);
        that.majorScore(that.data.batch.id, that.data.course.id, that.data.year.name);
        if (options.id == 2) {
            that.setData({
                currentData: 2
            })
        }
    },
    loadOption() {
        var that = this;
        util.request({
            url: '/api/School/condition_socre',
            data: {
                'id': app.globalData.schoolid,
                province: app.globalData.province.id
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        batch_type: res.data.batch_type, //本专科
                        course_type: res.data.course_type, //文理科
                        year_type: res.data.year_type, //年份
                    })
                    //展示学校应有的搜索条件,并赋值默认搜索条件
                    let batch = {}
                    batch.id = that.data.batch_type[0].id
                    batch.name = that.data.batch_type[0].name
                    let course = {}
                    course.id = that.data.course_type[0].id
                    course.name = that.data.course_type[0].name
                    let year = {}
                    year.id = that.data.year_type[0].id
                    year.name = that.data.year_type[0].name
                    that.setData({
                        batch: batch,
                        course: course,
                        year: year
                    })
                }
            }
        })
    },
    // 院校分数
    schoolScore(course) {
        var that = this;
        util.request({
            url: '/api/School/details_three',
            data: {
                'id': app.globalData.schoolid,
                "province": app.globalData.province.id,
                'course': course,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {

                    that.setData({
                        school_score: res.data.school_score,
                    })
                }
            }
        })
    },
    // 专业分数
    majorScore(batch, course, year) {
        var that = this;
        util.request({
            url: '/api/School/details_four',
            data: {
                'id': app.globalData.schoolid,
                "province": app.globalData.province.id,
                'batch': batch,
                'course': course,
                'year': year
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        career_score: res.data.career_score
                    })
                }
            }
        })
    },
    
    selectCourse: function (e) {
        var that = this;
        var name = e.currentTarget.dataset.coursename;
        var id = e.currentTarget.dataset.courseid;
        var obj = {};
        obj.id = id;
        obj.name = name;
        that.setData({
            course: obj
        })
        that.loadData()
    },
    selectBatch(e) {
        var that = this;
        var name = e.currentTarget.dataset.name;
        var id = e.currentTarget.dataset.id;
        var obj = {};
        obj.id = id;
        obj.name = name;
        that.setData({
            batch: obj
        })
        that.loadData()
    },
    selectYear(e) {
        var that = this;
        var name = e.currentTarget.dataset.name;
        var id = e.currentTarget.dataset.id;
        var obj = {};
        obj.id = id;
        obj.name = name;
        that.setData({
            year: obj
        })
        that.loadData()
    },
    //根据所在页面不同，加载不同数据
    loadData() {
        var that = this;
        that.schoolScore(that.data.course.id);
        that.majorScore(that.data.batch.id, that.data.course.id, that.data.year.name);
        that.enrollPlan(that.data.batch.id, that.data.course.id, that.data.year.name)

    },
    // 点击切换页面
    tabClick: function (e) {
        var that = this;
        if (that.data.currentData === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentData: e.target.dataset.current
            });
        }
    },
    // 下拉框
    // 点击下拉显示框
    bindcourse() {
        var that = this;
        that.setData({
            select: !that.data.select
        })
    },
    bindyear() {
        var that = this;
        that.setData({
            select1: !that.data.select1
        })
    },
    bindbatch() {
        var that = this;
        that.setData({
            select2: !that.data.select2
        })
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    }
})