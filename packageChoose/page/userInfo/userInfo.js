// packageChoose/page//userInfo/userInfo.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        province: [], //高考省份
        category: [], //招生类别
        role: [], //高考角色
        grade: [], //所在年级
        region: [], //地区（用于搜索高中）
        school: [], //高中学校列表
        college_province: {
            id: 0,
            name: null,
            index: 0
        }, //高考省份
        enrollment_category: {
            id: 0,
            name: null,
            index: 0
        }, //招生类别
        college_role: {
            id: 0,
            name: null,
            index: 0
        }, //高考角色
        high_province: {
            id: 0,
            name: null,
            index: 0
        }, //高中所在城市
        high_city: {
            id: 0,
            name: null,
            index: 0
        }, //高中城市
        high_district: {
            id: 0,
            name: null,
            index: 0
        }, //高中区县
        high_school: {
            id: 0,
            name: null,
            index: 0
        }, //高中学校
        high_class: {
            id: 0,
            name: null,
            index: 0
        }, //所在年级
        is_abroad: {
            id: 0,
            name: null,
            index: 0
        }, //考虑海外留学 1是
        is_expert: {
            id: 0,
            name: null,
            index: 0
        }, //专家服务 1是
        email: "", //联系邮箱
        option_abroad: [{
            id: 0,
            name: '不考虑海外留学'
        }, {
            id: 1,
            name: '考虑海外留学'
        }],
        option_expert: [{
            id: 0,
            name: '不考虑志愿填报专家人工服务'
        }, {
            id: 1,
            name: '考虑志愿填报专家人工服务'
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/login/userinfo_condition',
            data: {},
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        province: res.data.list.college_province, //高考省份
                        category: res.data.list.enrollment_category, //招生类别
                        role: res.data.list.college_role, //高考角色
                        grade: res.data.list.high_class, //所在年级
                        region: res.data.list.gaozhong //所在年级
                    })
                    that.loadInfo()
                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
    },
    loadInfo() {
        var that = this;
        util.request({
            url: '/api/login/getone_userinfo',
            data: {
                uid: app.globalData.userInfo.id
            },
            success: function(res) {
                if (res.data.code === 1) {
                    var province = that.data.province;
                    var category = that.data.category;
                    var role = that.data.role;
                    var grade = that.data.grade;
                    var abraod = that.data.option_abroad
                    var expert = that.data.option_expert
                    //渲染高考省份
                    province.forEach(item => { 
                        if (res.data.info.college_province == item.id) {
                            let name = 'college_province.name'
                            let id = 'college_province.id'
                            that.setData({
                                [name]: item.name,
                                [id]: item.id
                            })
                        }
                    })
                    //渲染招生类别
                    category.forEach(item => { 
                        if (res.data.info.enrollment_category == item.id) {
                            let name = 'enrollment_category.name'
                            let id = 'enrollment_category.id'
                            that.setData({
                                [name]: item.name,
                                [id]: item.id
                            })
                        }
                    }) 
                    //渲染高考角色
                    role.forEach(item => { 
                        if (res.data.info.college_role == item.id) {
                            let name = 'college_role.name'
                            let id = 'college_role.id'
                            that.setData({
                                [name]: item.name,
                                [id]: item.id
                            })
                        }
                    }) 
                     //渲染所在年级
                    grade.forEach(item => {
                        if (res.data.info.high_class == item.id) {
                            let name = 'high_class.name'
                            let id = 'high_class.id'
                            that.setData({
                                [name]: item.name,
                                [id]: item.id
                            })
                        }
                    }) 
                    //渲染留学意向
                    abraod.forEach(item => { 
                        if (res.data.info.is_abroad == item.id) {
                            let name = 'is_abroad.name'
                            let id = 'is_abroad.id'
                            that.setData({
                                [name]: item.name,
                                [id]: item.id
                            })
                        }
                    }) 
                    //渲染专家服务
                    expert.forEach(item => { 
                        if (res.data.info.is_expert == item.id) {
                            let name = 'is_expert.name'
                            let id = 'is_expert.id'
                            that.setData({
                                [name]: item.name,
                                [id]: item.id
                            })
                        }
                    })
                    var provinceName = 'high_province.name'
                    var cityName = 'high_city.name'
                    var districtName = 'high_district.name'
                    var schoolName = 'high_school.name'
                    that.setData({
                        [provinceName]: res.data.info.high_province, //所在地区
                        [cityName]: res.data.info.high_province,
                        [districtName]: res.data.info.high_district,
                        [schoolName]: res.data.info.high_school,
                        email: res.data.info.email,
                    })
                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });

    },
    //选择高考省份
    bindCollegeProvince(e) {
        var item = this.data.province[e.detail.value]
        var index = 'college_province.index'; //给小程序对象属性赋值
        var name = 'college_province.name'; //给小程序对象属性赋值
        var id = 'college_province.id'; //给小程序对象属性赋值
        this.setData({
            [index]: e.detail.value,
            [id]: item.id,
            [name]: item.name
        })
    },
    //选择招生类别
    bindCategory(e) {
        var item = this.data.category[e.detail.value]
        var index = 'enrollment_category.index'; //给小程序对象属性赋值
        var name = 'enrollment_category.name'; //给小程序对象属性赋值
        var id = 'enrollment_category.id'; //给小程序对象属性赋值
        this.setData({
            [index]: e.detail.value,
            [id]: item.id,
            [name]: item.name
        })
    },
    //选择高考角色
    bindRole(e) {
        var item = this.data.role[e.detail.value]
        var index = 'college_role.index'; //给小程序对象属性赋值
        var name = 'college_role.name'; //给小程序对象属性赋值
        var id = 'college_role.id'; //给小程序对象属性赋值
        this.setData({
            [index]: e.detail.value,
            [id]: item.id,
            [name]: item.name
        })
    },
    //选择高中所在地区
    bindRegionChange(e) {
        var that = this;
        let province = e.detail.value[0];
        let city = e.detail.value[1];
        let country = e.detail.value[2];
        let high_province = 'high_province.name';
        let high_city = 'high_city.name';
        let high_district = 'high_district.name';
        that.setData({
            [high_province]: province,
            [high_city]: city,
            [high_district]: country
        })
        //随后加载对应的高中
        util.request({
            url: '/api/login/get_gaozhong',
            data: {
                province: province,
                city: city,
                country: country
            },
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        school: res.data.list, //高考省份
                    })
                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
    },
    //选择高中
    bindSchool(e) {
        var item = this.data.school[e.detail.value]
        var name = 'high_school.name'; //给小程序对象属性赋值
        this.setData({
            [name]: item.school
        })
    },
    //选择年级
    bindGrade(e) {
        var item = this.data.grade[e.detail.value]
        var name = 'high_class.name'; //给小程序对象属性赋值
        var id = 'high_class.id'; //给小程序对象属性赋值
        this.setData({
            [name]: item.name,
            [id]: item.id
        })
    },
    bindAbroad(e) {
        var item = this.data.option_abroad[e.detail.value]
        var name = 'is_abroad.name'; //给小程序对象属性赋值
        var id = 'is_abroad.id'; //给小程序对象属性赋值
        this.setData({
            [name]: item.name,
            [id]: item.id
        })
    },
    bindExpert(e) {
        var item = this.data.option_expert[e.detail.value]
        var name = 'is_expert.name'; //给小程序对象属性赋值
        var id = 'is_expert.id'; //给小程序对象属性赋值
        this.setData({
            [name]: item.name,
            [id]: item.id
        })
    },

    bindEmail(e) {
        this.setData({
            email: e.detail.value
        })
    },
    //提交用户信息
    submit() {
        var that = this;
        util.request({
            url: '/api/login/userinfo',
            data: {
                uid: app.globalData.userInfo.id,
                college_province: that.data.college_province.id,
                enrollment_category: that.data.enrollment_category.id,
                college_role: that.data.college_role.id,
                high_province: that.data.high_province.name,
                high_city: that.data.high_city.name,
                high_district: that.data.high_district.name,
                high_school: that.data.high_school.name,
                high_class: that.data.high_class.id,
                is_abroad: that.data.is_abroad.id,
                is_expert: that.data.is_expert.id,
                email: that.data.email
            },
            success: function(res) {
                if (res.data.code === 1) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta: 0
                    })
                    // that.setData({
                    //     school: res.data.list, //高考省份
                    // })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function(e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})