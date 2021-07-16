// packageChoose/page//examination/major/major.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentData: 0, //当前页面
        name: '', //专业名
        career_list: [],
        subjectsName: [],
        page: 1,
        code: '',
        probability:'',
        school:0,
        // 是否匹配  0全部  1匹配  2不匹配
        selectList: [{
            name: '全部',
            id: 0
        }, {
            name: '匹配',
            id: 1
        }, {
            name: '不匹配',
            id: 2
        }],
        selectName:'全部',
        selectId:0,//是否匹配的id
        showList:false,
        college:'',
    },
    // 导航切换
    tabClick: function(e) {
        var that = this;
        if (that.data.currentData === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentData: e.target.dataset.current
            });
        }
        if (e.target.dataset.current == 1) {
            util.request({
                url: '/api/entrance/career_list_school',
                data: {
                    year: app.globalData.exam.year,
                    province: app.globalData.exam.province,
                    choosen_subjects: that.data.subjectsName,
                    category_code: that.data.code,
                    match_mode: that.data.selectId,
                    college: that.data.college
                },
                method: 'post',
                success(res) {
                    if (res.data.code === 1) {
                        that.setData({
                            school_list: res.data.list,
                            page: 1
                        })
                    }
                }
            })
        }
    },
    //搜索院校
    schoolSearch(e){
        var that = this;
        that.setData({
            college: e.detail.value
        })
        util.request({
            url: '/api/entrance/career_list_school',
            data: {
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
                choosen_subjects: that.data.subjectsName,
                category_code: that.data.code,
                match_mode: that.data.selectId,
                college: e.detail.value
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        school_list: res.data.list,
                        page:1
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                    that.setData({
                        school_list: [],
                        page: 1
                    })
                }
            }
        })
    },
    clear(){
        var that = this;
        that.setData({
            college: ''
        })
        util.request({
            url: '/api/entrance/career_list_school',
            data: {
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
                choosen_subjects: that.data.subjectsName,
                category_code: that.data.code,
                match_mode: that.data.selectId,
                college: ''
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        school_list: res.data.list,
                        page:1
                    })
                }
            }
        })
    },
    // 显示匹配列表
    select(e){
        this.setData({
            showList: !this.data.showList
        })
    },
    // 是否匹配
    selectMatch(e){
        var that =this;
        console.log(e)
        that.setData({
            selectId: e.currentTarget.dataset.match,
            selectName: e.currentTarget.dataset.name,
            showList:false,
        })
        util.request({
            url: '/api/entrance/career_list_school',
            data: {
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
                choosen_subjects: that.data.subjectsName,
                category_code: that.data.code,
                match_mode: e.currentTarget.dataset.match,
                college: ''
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        school_list: res.data.list,
                        page: 1,
                    })
                } else {
                    that.setData({
                        school_list: []
                    })
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none"
                    })
                }
            }
        })
    },
    goCareer(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../../../pages/career/details/baseinfo?id=' + id,
        })
    },
    schoolDetail(e) {
        var name = e.currentTarget.dataset.name;
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../college/college?name=' + name + '&subjectsName=' + this.data.subjectsName + '&type=1' + '?id=' + id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            name: options.name,
            subjectsName: options.subjectsName.split(","),
            code: options.code,
            probability: options.probability,
            school: options.school,
        })
        util.request({
            url: '/api/entrance/career_list_child',
            data: {
                career_name: options.name
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    that.setData({
                        career_list: res.data.info.career_list,
                    })
                    if (res.data.info.career_list.length < 1) {
                        wx.showToast({
                            title: '暂无数据',
                            icon: 'none'
                        })
                    }
                }
            }
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        util.request({
            url: '/api/entrance/career_list_school',
            data: {
                year: app.globalData.exam.year,
                province: app.globalData.exam.province,
                choosen_subjects: that.data.subjectsName,
                category_code: that.data.code,
                match_mode: that.data.selectId,
                college: that.data.college,
                page: that.data.page + 1
            },
            method: 'post',
            success(res) {
                let list = that.data.school_list.concat(res.data.list)
                if (that.data.school_list.length < res.data.all_num) {
                    wx.showToast({
                        title: '加载中',
                        icon: 'loading'
                    })
                    that.setData({
                        school_list: list,
                        page: that.data.page + 1
                    })
                } else {
                    wx.showToast({
                        title: '没有更多',
                        icon: 'none'
                    })
                }
            }
        })
    },
})