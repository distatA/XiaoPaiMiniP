//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
Page({
    data: {
        popup: false,
        uhide: 0,
        chide: 0,
        showView: false,
        institution: [], //筛选高校
        institution_type: '',
        feature_label: [], //筛选类型
        labe_id: '', //筛选类型
        region: [], //筛选地区
        dq_id: '',
        classArea: {}, //多选地区
        school_name: '',
        currentTab: '',
        school_list: [], //添加对比学校
        volunteer: [], //根据批次获取志愿个数
        school: {},
        classMajor: {},
        classDuibi: {},
        page1: 2,
        page2: 2,
        page3: 2,
        page4: 2,
        url: '',
        exchange: true,
        schoolList: {},
        chongci: 0,
        baodi: 0,
        wentuo: 0, //院校数
        gailv: 2,
        major_list: []
    },
    // 右侧固定点击进入对比页
    goDuibi() {
        wx.navigateTo({
            url: '/pages/career/contrast/contrast',
        });
    },
    // 右侧固定点击显示志愿表
    showZy() {
        var that = this;
        that.setData({
            popup: true
        })
    },
    // 筛选的隐藏
    closeChoose() {
        var that = this;
        that.setData({
            showView: false
        })
    },
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request({
            url: '/api/reckon/test_jisuan',
            method: 'post',
            data: {
                uid: app.globalData.userInfo.id,
                gailv: options.id,
                page: 1
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        schoolList: res.data.list,
                        gailv: options.id,
                    });
                }
                wx.hideLoading();
            }
        })
        util.request({
            url: "/api/reckon/condition_school",
            data: {
                uid: app.globalData.userInfo.id,
            },
            method: "post",
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        institution: res.data.institution_type,
                        region: res.data.region,
                        feature_label: res.data.feature_label
                    })
                }
            }
        });
        util.request({
            url: "/api/reckon/volunteer_number",
            data: {
                uid: app.globalData.userInfo.id,
            },
            method: "post",
            success: function(res) {
                if (res.data.code == 1) {
                    var volunteer = res.data.volunteer;
                    var volunteerList = []
                    for (var i = 0; i < volunteer.length; i++) {
                        var obj = {};
                        obj.title = volunteer[i];
                        obj.sid = 0;
                        obj.bili = 0;
                        obj.content = "点击填报";
                        obj.major = [];
                        volunteerList.push(obj);
                    }
                    that.setData({
                        volunteer: volunteerList
                    })
                } else {
                    that.setData({
                        volunteer: res.data.volunteer
                    })
                }
            }
        });
        that.setData({
            currentTab: options.id,
            chongci: options.chongci,
            baodi: options.baodi,
            wentuo: options.wentuo
        });
    },
    //点击切换
    menuTap: function(e) {
        var that = this;
        var current = e.currentTarget.dataset.current;
        var institution = that.data.institution_type;
        var label = that.data.labe_id;
        var province = that.data.dq_id;
        that.setData({
            currentTab: current,
        });
        if (current == 2) {
            that.ccschool(that.data.school_name, province, institution, label)
        } else if (current == 3) {
            that.wtschool(that.data.school_name, province, institution, label)
        } else if (current == 4) {
            that.bdschool(that.data.school_name, province, institution, label)
        } else {
            that.allschool(that.data.school_name, province, institution, label)
        }
    },
    //点击专业切换隐藏和显示，加载专业数据
    clickShow: function(e) {
        var that = this;
        var toggleBtnVal = that.data.uhide;
        var id = e.currentTarget.id;
        var name = e.currentTarget.dataset.name;
        if (toggleBtnVal == id) {
            that.setData({
                uhide: 0,
            })
        } else {
            that.setData({
                uhide: id
            });
        };
        util.request({
            url: '/api/reckon/test_jisuan',
            method: 'post',
            data: {
                uid: app.globalData.userInfo.id,
                gailv: that.data.currentTab,
                school_name: name,
                province: that.data.dq_id,
                institution_type: that.data.institution_type,
                feature_label: that.data.labe_id,
            },
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        major_list: res.data.list[0].major_list,
                    })
                }
            }
        })
    },
    // 筛选的显示隐藏切换
    onChangeShowState: function() {
        var that = this;
        if (that.data.showView) {
            that.setData({
                showView: false
            })
        } else {
            that.setData({
                showView: true
            })
        }
    },
    // 专业点击填报
    editinfo: function(e) {
        var that = this;
        var majorId = e.currentTarget.dataset.id; //专业ID
        var schoolId = e.currentTarget.dataset.schid; //学校ID
        var schoolName = e.currentTarget.dataset.sname; //学校名称
        var majorCode = e.currentTarget.dataset.major; //专业code
        var majorName = e.currentTarget.dataset.mname; //专业名
        var sbili = e.currentTarget.dataset.sbili; //学院概率
        var mbili = e.currentTarget.dataset.mbili; //专业概率
        var volunteer = that.data.volunteer;
        var school = that.data.school;
        var classMajor = that.data.classMajor;
        var classSch = that.data.classSch;
        //判断是否可以填报
        var isTianbao = false;
        var isInMajor = false;
        for (var a = 0; a < volunteer.length; a++) {
            if (volunteer[a].sid == schoolId) {
                isTianbao = true;
                for (var b = 0; b < volunteer[a].major.length; b++) {
                    if (volunteer[a].major[b].id == majorId) {
                        isInMajor = true;
                    }
                }
            }
        }
        if (!isTianbao) {
            that.setData({
                popup: true
            });
            school = {
                schoolId: schoolId,
                schoolName: schoolName,
                bili: sbili,
                major: [{
                    id: majorId,
                    major_code: majorCode,
                    bili: mbili,
                    major_name: majorName
                }]
            };

        } else {
            if (isInMajor) {
                for (var c = 0; c < volunteer.length; c++) {
                    if (volunteer[c].sid == schoolId) {
                        if (volunteer[c].major.length == 1) {
                            volunteer[c].content = '点击填报';
                            volunteer[c].sid = 0;
                            volunteer[c].bili = 0;
                            volunteer[c].major = [];
                            volunteer[c].isDelete = false;
                            classMajor[majorId] = false;
                        } else {
                            for (var d = 0; d < volunteer[c].major.length; d++) {
                                if (volunteer[c].major[d].id == majorId) {
                                    volunteer[c].major.splice(d, 1);
                                    classMajor[majorId] = false;
                                }
                            }
                        }
                    }
                }
            } else {
                for (var c = 0; c < volunteer.length; c++) {
                    if (volunteer[c].sid == schoolId) {
                        if (volunteer[c].major.length >= 6) {
                            wx.showToast({
                                title: '添加失败，选择专业已达上限（6个）',
                                icon: 'none'
                            });
                            return;
                        } else {
                            volunteer[c].major.push({
                                id: majorId,
                                major_code: majorCode,
                                bili: mbili,
                                major_name: majorName
                            });
                            classMajor[majorId] = true;
                            wx.showToast({
                                title: '专业添加成功'
                            });
                        }
                    }
                }
            }
        }

        that.setData({
            school: school,
            volunteer: volunteer,
            classMajor: classMajor
        })
    },
    // 弹框点击填报
    tianbao: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var volunteer = that.data.volunteer;
        var school = that.data.school;
        var classMajor = that.data.classMajor;
        if (JSON.stringify(school) != '{}') {
            for (var a = 0; a < volunteer.length; a++) {
                if (volunteer[a].sid == school.schoolId) {
                    //将已选院校更换志愿ABC
                    volunteer[a].content = '点击填报';
                    volunteer[a].sid = 0;
                    volunteer[a].bili = 0;
                    volunteer[a].major = [];
                    volunteer[a].isDelete = false;
                    wx.showToast({
                        title: '志愿替换成功',
                        duration: 2000
                    })
                }
                if (volunteer[a].title == index) {
                    if (volunteer[a].major.length > 0) {
                        for (var c = 0; c < volunteer[a].major.length; c++) {
                            //新院校替换掉已有旧院校
                            if (classMajor[volunteer[a].major[c].id]) {
                                classMajor[volunteer[a].major[c].id] = false;
                                wx.showToast({
                                    title: '院校替换成功',
                                    duration: 2000
                                });
                            }
                        }
                    }
                    volunteer[a].content = school.schoolName;
                    volunteer[a].sid = school.schoolId;
                    volunteer[a].bili = school.bili;
                    volunteer[a].major = school.major;
                    volunteer[a].isDelete = true;
                    for (var b = 0; b < school.major.length; b++) {
                        if (!classMajor[school.major[b].id] || classMajor[school.major[b].id] == 'undefined') {
                            //点击会触发，除替换ABC外
                            classMajor[school.major[b].id] = true;
                            that.setData({
                                exchange: false
                            })
                        }
                    }
                }
            };
        };

        that.setData({
            volunteer: volunteer,
            classMajor: classMajor
        });
        // 无志愿时，替换按钮不显示
        var resfalse = volunteer.every(function(elem, index) {
            if (elem.sid == 0) return true
        });
        if (resfalse) {
            that.setData({
                exchange: true
            });
        };
    },
    // 删除某条志愿
    deleteIt: function(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var volunteer = that.data.volunteer;
        var classMajor = that.data.classMajor;
        var school = that.data.school;
        for (var a = 0; a < volunteer.length; a++) {
            if (volunteer[a].sid == id) {
                for (var b = 0; b < volunteer[a].major.length; b++) {
                    classMajor[volunteer[a].major[b].id] = false;
                };
                volunteer[a].content = '点击填报';
                volunteer[a].sid = 0;
                volunteer[a].bili = 0;
                volunteer[a].major = [];
                volunteer[a].isDelete = false;
                wx.showToast({
                    title: '该志愿已删除',
                    duration: 2000
                });
            };
        };
        that.setData({
            volunteer: volunteer,
            classMajor: classMajor,
            school: {}
        });
        // 无志愿时，替换按钮不显示
        var resfalse = volunteer.every(function(elem, index) {
            if (elem.sid == 0) return true
        });
        if (resfalse) {
            that.setData({
                exchange: true
            });
        };
    },
    //交换志愿
    exChange: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var volunteer = that.data.volunteer;
        var midCon = ""; //变量存储学校名字
        var midschoolId = ""; //变量存储学校ID
        var midbili = ""; //变量存储学校概率
        var midmajor = []; //变量存储专业

        midCon = volunteer[index].content; //存储变量赋值
        midschoolId = volunteer[index].sid; //存储变量赋值
        midbili = volunteer[index].bili; //存储变量赋值
        midmajor = volunteer[index].major;

        volunteer[index].content = volunteer[index - 1].content;
        volunteer[index].sid = volunteer[index - 1].sid;
        volunteer[index].bili = volunteer[index - 1].bili;
        volunteer[index].major = volunteer[index - 1].major;

        volunteer[index - 1].content = midCon;
        volunteer[index - 1].sid = midschoolId;
        volunteer[index - 1].bili = midbili;
        volunteer[index - 1].major = midmajor;
        // 删除志愿的x
        for (var i = 0; i < volunteer.length; i++) {
            if (volunteer[i].sid == 0) {
                volunteer[i].isDelete = false;
            } else {
                volunteer[i].isDelete = true;
            }
        }
        that.setData({
            volunteer: volunteer
        });
        wx.showToast({
            title: '志愿更改成功',
        })
    },
    xiaoshi: function() {
        var that = this;
        var popup = !that.data.popup;
        that.setData({
            popup: popup
        })
    },
    onShow: function(options) {
        var that = this;
        // 获取筛选数据
        // 删除对比学校数据
        var deleteSch = app.globalData.deleteSch;
        var school_list = app.globalData.school_list;
        var classDuibi = that.data.classDuibi;
        // 删除对比数据中
        for (var i = 0; i < deleteSch.length; i++) {
            var id = deleteSch[i];
            classDuibi[id] = false;
        };
        // 添加对比数据中
        for (var i = 0; i < school_list.length; i++) {
            var id = school_list[i].id;
            classDuibi[id] = true;
        };
        that.setData({
            classDuibi: classDuibi,
            school_list: school_list
        })
    },
    // 高校
    screengx: function(e) {
        var that = this;
        let gxid = e.currentTarget.dataset.gxid;
        that.setData({
            institution_type: gxid
        });
    },
    // 类型
    screenlx: function(e) {
        var that = this;
        let lxid = e.currentTarget.dataset.lxid;
        that.setData({
            labe_id: lxid,
        });
    },
    // 地区
    screendq: function(e) {
        var that = this;
        var classArea = that.data.classArea;
        var dqid = e.currentTarget.dataset.dqid;
        if (classArea[dqid] == true) {
            return;
        } else {
            classArea[dqid] = true;
            var dq_id = dqid + ',' + that.data.dq_id;
        };
        that.setData({
            dq_id: dq_id,
            classArea: classArea
        });
    },
    // 筛选院校
    formtype: function(e) {
        var that = this;
        var institution = that.data.institution_type;
        var label = that.data.labe_id;
        var province = that.data.dq_id;
        that.ccschool('', province, institution, label);
        that.wtschool('', province, institution, label);
        that.bdschool('', province, institution, label);
        that.allschool('', province, institution, label);
        that.setData({
            showView: false,
            currentTab: 1
        });
    },
    // 重置
    formReset: function() {
        var that = this;
        that.setData({
            institution_type: '',
            dq_id: '',
            labe_id: '',
            classArea: {}
        })
    },
    // 搜索院校
    formSubmit: function(e) {
        var that = this;
        var school_name = e.detail.value.name;
        that.setData({
            school_name: school_name,
            currentTab: 1
        });
        that.ccschool(that.data.school_name)
        that.wtschool(that.data.school_name)
        that.bdschool(that.data.school_name)
        that.allschool(that.data.school_name)
    },
    allschool(schoolName, province, institution, label) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request({
            url: '/api/reckon/test_jisuan',
            method: 'post',
            data: {
                gailv: 1,
                uid: app.globalData.userInfo.id,
                school_name: schoolName,
                province: province,
                institution_type: institution,
                feature_label: label,
                page: 1
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        schoolList: res.data.list,
                        gailv: 1,
                    });
                }
                wx.hideLoading();
            }
        })
    },
    ccschool(schoolName, province, institution, label) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request({
            url: '/api/reckon/test_jisuan',
            method: 'post',
            data: {
                gailv: 2,
                uid: app.globalData.userInfo.id,
                school_name: schoolName,
                province: province,
                institution_type: institution,
                feature_label: label,
                page: 1
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        schoolList: res.data.list,
                        gailv: 2,
                        chongci: res.data.all_num
                    });
                }
                wx.hideLoading();
            }
        })
    },
    wtschool(schoolName, province, institution, label) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request({
            url: '/api/reckon/test_jisuan',
            method: 'post',
            data: {
                gailv: 3,
                uid: app.globalData.userInfo.id,
                school_name: schoolName,
                province: province,
                institution_type: institution,
                feature_label: label,
                page: 1
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        schoolList: res.data.list,
                        gailv: 3,
                        wentuo: res.data.all_num,
                    });
                }
                wx.hideLoading();
            }
        })
    },
    bdschool(schoolName, province, institution, label) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        util.request({
            url: '/api/reckon/test_jisuan',
            method: 'post',
            data: {
                gailv: 4,
                uid: app.globalData.userInfo.id,
                school_name: schoolName,
                province: province,
                institution_type: institution,
                feature_label: label,
                page: 1
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        schoolList: res.data.list,
                        gailv: 4,
                        baodi: res.data.all_num,
                    });
                }
                wx.hideLoading();
            }
        })
    },
    /*** 页面上拉触底事件的处理函数，加载触底和搜索触底 */
    onReachBottom: function() {
        var that = this
        var currentTab = that.data.currentTab;
        if (currentTab == 2) {
            wx.showLoading({
                title: '加载中···',
            })
            util.request({
                url: '/api/reckon/test_jisuan',
                method: 'post',
                data: {
                    uid: app.globalData.userInfo.id,
                    gailv: 2,
                    school_name: that.data.school_name,
                    province: that.data.dq_id,
                    institution_type: that.data.institution_type,
                    feature_label: that.data.labe_id,
                    page: that.data.page2
                },
                success(res) {
                    if (res.data.code == 1) {
                        if (that.data.schoolList.length < res.data.all_num) {
                            var schoolList = that.data.schoolList.concat(res.data.list)
                            that.setData({
                                schoolList: schoolList,
                                page2: that.data.page2 + 1
                            })
                            wx.hideLoading()

                        } else {
                            wx.showToast({
                                title: '没有更多',
                                icon: 'none'
                            })
                        }
                    }
                }
            })
        } else if (currentTab == 3) {
            wx.showLoading({
                title: '加载中···',
            })
            util.request({
                url: '/api/reckon/test_jisuan',
                method: 'post',
                data: {
                    uid: app.globalData.userInfo.id,
                    gailv: 3,
                    school_name: that.data.school_name,
                    province: that.data.dq_id,
                    institution_type: that.data.institution_type,
                    feature_label: that.data.labe_id,
                    page: that.data.page3
                },
                success(res) {
                    if (res.data.code == 1) {
                        if (that.data.schoolList.length < res.data.all_num) {
                            var schoolList = that.data.schoolList.concat(res.data.list)
                            that.setData({
                                schoolList: schoolList,
                                page3: that.data.page3 + 1
                            })
                            wx.hideLoading()
                        } else {
                            wx.showToast({
                                title: '没有更多',
                                icon: 'none'
                            })
                        }
                    }
                }
            })
        } else if (currentTab == 4) {
            wx.showLoading({
                title: '加载中···',
            })
            util.request({
                url: '/api/reckon/test_jisuan',
                method: 'post',
                data: {
                    uid: app.globalData.userInfo.id,
                    gailv: 4,
                    school_name: that.data.school_name,
                    province: that.data.dq_id,
                    institution_type: that.data.institution_type,
                    feature_label: that.data.labe_id,
                    page: that.data.page4
                },
                success(res) {
                    if (res.data.code == 1) {
                        if (that.data.schoolList.length < res.data.all_num) {
                            var schoolList = that.data.schoolList.concat(res.data.list)
                            that.setData({
                                schoolList: schoolList,
                                page4: that.data.page4 + 1
                            })
                            wx.hideLoading()
                        } else {
                            wx.showToast({
                                title: '没有更多',
                                icon: 'none'
                            })
                        }
                    }
                }
            })
        } else {
            wx.showLoading({
                title: '加载中···',
            })
            util.request({
                url: '/api/reckon/test_jisuan',
                method: 'post',
                data: {
                    uid: app.globalData.userInfo.id,
                    gailv: 1,
                    school_name: that.data.school_name,
                    province: that.data.dq_id,
                    institution_type: that.data.institution_type,
                    feature_label: that.data.labe_id,
                    page: that.data.page1
                },
                success(res) {
                    if (res.data.code == 1) {
                        if (that.data.schoolList.length < res.data.all_num) {
                            var schoolList = that.data.schoolList.concat(res.data.list)
                            that.setData({
                                schoolList: schoolList,
                                page1: that.data.page1 + 1
                            })
                            wx.hideLoading()
                        } else {
                            wx.showToast({
                                title: '没有更多',
                                icon: 'none'
                            })
                        }
                    }
                }
            })
        }
    },
    // 生成志愿表
    goGreated: function() {
        var that = this;
        var volunteer_list = that.data.volunteer;
        app.globalData.volunteer_list = volunteer_list;
        wx.showLoading({
            title: '志愿表生成中',
        })
        util.request({
            url: '/api/reckon/add_applyfor',
            data: {
                uid: app.globalData.userInfo.id,
                volunteer_list: app.globalData.volunteer_list
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    wx.hideLoading()
                    var popup = !that.data.popup;
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2000,
                    });
                    that.setData({
                        popup: popup
                    });
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            },
        });
    },
    //添加院校对比
    goContrast: function(e) {
        var that = this;
        var id = e.currentTarget.dataset.sid;
        var url = e.currentTarget.dataset.url;
        var toggleBtnVal = that.data.chide;
        var school_list = that.data.school_list;
        var probability = e.currentTarget.dataset.pro;
        var classDuibi = that.data.classDuibi;
        var obj = {};
        obj.id = id;
        obj.gailv = probability;
        // 添加对比样式切换
        if (classDuibi[id] == true) {
            wx.showToast({
                title: '请不要重复添加',
                icon: 'none',
                duration: 2000
            })
        } else {
            classDuibi[id] = true;
            school_list.push(obj);
        };
        app.globalData.school_list = school_list;
        that.setData({
            school_list: school_list,
            classDuibi: classDuibi,
            url: url
        });
    },
})