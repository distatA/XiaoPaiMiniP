// pages/probability/probability.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showList: false, //选择列表显示
        animTime: '', // 动画执行时间
        percentage: '', //百分比
        subjectsName: [], //专业名称
        subjectsId: [], //专业id
        subjectList: [], //显示选择的专业
        selectList: [], //选择列表
        info: {},
        currentId: '',
        currentIndex: 0
    },
    selectSubject(e) {
        var showList = this.data.showList
        this.setData({
            showList: !showList,
            currentId: e.currentTarget.dataset.id,
            currentIndex: e.currentTarget.dataset.index
        })
    },
    selectItem(e) {
        var that = this;
        that.data.subjectsId.splice(that.data.currentIndex, 1, e.currentTarget.dataset.id)
        util.request({
            url: '/api/entrance/hide_subject',
            data: {
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
                arr: that.data.subjectsId
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    var arr = [];
                    res.data.show_list.forEach(function(e,i) {
                        arr.push(e.name);
                        return arr
                    })
                    that.setData({
                        subjectList: res.data.show_list,
                        selectList: res.data.hide_list,
                        subjectsName: arr
                    })
                    util.request({
                        url: '/api/entrance/index_career',
                        data: {
                            year: app.globalData.exam.year,
                            province: app.globalData.exam.province,
                            choosen_subjects: arr,
                        },
                        method: 'post',
                        success(res) {
                            if (res.data.code == 1) {
                                that.setData({
                                    info: res.data.list
                                })
                            }
                            that.draw('runCanvas', res.data.list.zonghe_matchRate, 1000);
                        }
                    })
                }
            }
        });
    },
    // 专业匹配
    goSubject(){
        wx.navigateTo({
            url: '../subjectSelect/subjectSelect?subjectsName=' + this.data.subjectsName,
        })
    },
    //院校匹配
    goCollege(){
        wx.navigateTo({
            url: '../collegeSelect/collegeSelect?subjectsName=' + this.data.subjectsName,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
        })
        let subjectsName = options.selectName || options.idName;
        let subjectsId = options.selectId || options.idList;
        var that = this;
        util.request({
            url: '/api/entrance/hide_subject',
            data: {
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
                arr: subjectsId.split(",")
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        subjectList: res.data.show_list,
                        selectList: res.data.hide_list
                    })
                }
            }
        })
        that.setData({
            subjectsName: subjectsName.split(","),
            subjectsId: subjectsId.split(","),
        })
    },
    // 绘制圆形进度条方法
    run(c, w, h) {
        let that = this;
        var num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
        that.data.ctx2.arc(w, h, w - 8, -0.5 * Math.PI, num); //每个间隔绘制的弧度
        that.data.ctx2.setStrokeStyle("#f76d8f");
        that.data.ctx2.setLineWidth("7");
        that.data.ctx2.setLineCap("round");
        that.data.ctx2.stroke();
        that.data.ctx2.beginPath();
        that.data.ctx2.draw();
    },
    /**
     * start 起始百分比
     * end 结束百分比
     * w,h 其实就是圆心横纵坐标
     */
    // 动画效果实现
    canvasTap(start, end, time, w, h) {
        var that = this;
        start++;
        if (start > end) {
            return false;
        }
        that.run(start, w, h);
        setTimeout(function() {
            that.canvasTap(start, end, time, w, h);
        }, time);
    },
    /**
     * id----------------canvas画板id
     * percent-----------进度条百分比
     * time--------------画图动画执行的时间  
     */
    draw: function(id, percent, animTime) {
        wx.hideLoading();
        var that = this;
        const ctx2 = wx.createCanvasContext(id);
        that.setData({
            ctx2: ctx2,
            percentage: percent,
            animTime: animTime
        });
        var time = that.data.animTime / that.data.percentage;
        wx.createSelectorQuery().select('#' + id).boundingClientRect(function(rect) { //监听canvas的宽高
            //获取canvas宽的的一半
            var w = parseInt(rect.width / 2);
            //获取canvas高的一半，
            var h = parseInt(rect.height / 2);
            that.canvasTap(0, that.data.percentage, time, w, h)
        }).exec();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        util.request({
            url: '/api/entrance/index_career',
            data: {
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
                choosen_subjects: that.data.subjectsName,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        info: res.data.list
                    })
                }
                that.draw('runCanvas', res.data.list.zonghe_matchRate, 1000);
            }
        })
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
        return{
            title:'选课方案',
            path: '/packageChoose/page/examination/probability/probability?selectId=' + this.data.subjectsId + '&selectName=' + this.data.subjectsName
        }
    }
})