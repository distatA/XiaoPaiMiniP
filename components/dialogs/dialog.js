var WxParse = require('../../wxParse/wxParse.js')
const util = require('../../utils/utils_old_live.js')
const app = getApp()
Component({
    properties: {
        roomID: {
            type: Number,
            value: ''
        },
        //直播间类型
        roomLiveType:{
            type: Number,
            value: 0
        },
        //判断直播是否为江苏，0=>否，1=>是
        areaId:{
            type: Number,
            value: 0
        },
        //弹窗标题
        roomTitle: {
            type: String,
            value: ''
        },
        schoolLogo: {
            type: String,
            value: ''
        },
        roomPeoples: {
            type: Number,
            value: ''
        },
    },
    data: {
        dialogShow: false,
        dialogType: 0,
        dialogTitle: '',
        scrollHeight: app.globalData.windowHeight - 170,
        height: app.globalData.statusBarHeight + 'px',
        showMajorDetail:false,//专业详情
        majorInfo:{},//专业详情信息
        schoolInfo:'',
        currentScoreInfo:[],//当前展示历年分数信息(某一年的具体信息)
        scoreList:[],
        currentYear:2019,
        yearList:[],
        majorList:[],
        currentOpen:0,
        vr:''
    },
    methods: {
        show(type) {
            let that = this;
            console.log('===>', this.data.roomLiveType)
            var name = '学校介绍';
            if (type == 0) {
                name = '学校介绍';
                wx.request({
                    url: app.globalData.requestUrl + '/live/school_desc',
                    data: {
                        "room_id": that.data.roomID
                    },
                    method: 'post',
                    success: function (res) {
                        console.log(res)
                        WxParse.wxParse('txtNew', 'html', res.data.list.description, that, 5);
                    },
                    fail: function (e) {
                        wx.showToast({
                            title: '网络异常！',
                            duration: 2000
                        });
                    },
                })
            }
            else if (type == 1) { 
                name = '历届分数';
                wx.request({
                    url: app.globalData.requestUrl + '/live/school_score',
                    data: {
                        "room_id": that.data.roomID
                    },
                    method: 'post',
                    success: function (res) {
                        if (res.data.code === 1 && res.data.list.length>0){
                            let scoreInfo = res.data.list;
                           let year = []
                            scoreInfo.forEach(item => {
                               year.push(item.year)
                           })
                           that.setData({
                               currentScoreInfo: scoreInfo[0],
                               scoreList: scoreInfo,
                               yearList: year,
                               currentYear: year[0]
                           })
                           console.log('===>', that.data.yearList)
                       }
                    },
                    fail: function (e) {
                        wx.showToast({
                            title: '网络异常！',
                            duration: 2000
                        });
                    },
                })
            }
            else if (type == 2) {
                name = '院系专业';
                wx.request({
                    url: app.globalData.requestUrl + '/live/school_career',
                    data: {
                        "room_id": that.data.roomID
                    },
                    method: 'post',
                    success: function (res) {
                        let majorList = res.data.list;
                        console.log('========>', majorList)
                        that.setData({
                            majorList: majorList,
                        })
                    },
                    fail: function (e) {
                        wx.showToast({
                            title: '网络异常！',
                            duration: 2000
                        });
                    },
                })
            }
            // else if (type == 3) {
            //     name = '录取概率';
            // }
            that.setData({
                dialogShow: true,
                dialogType: type,                
                dialogTitle: name,
                showMajorDetail:false,
            })
        },
        //打开专业
        openChild(e) {
            var index = e.currentTarget.dataset.index;
            this.setData({
                currentOpen: index
            })
        },
        //点击查看专业详情
        selectMajor(e){
            var that = this;
            let cid = e.currentTarget.dataset.item.cid;
            wx.request({
                url: app.globalData.requestUrl + '/live/school_college_detail',
                data: {
                    "cid": cid
                },
                method: 'post',
                success: function (res) {
                    that.setData({
                        majorInfo: res.data.list,
                        showMajorDetail: true
                    })
                    WxParse.wxParse('professional_introduction', 'html', res.data.list.professional_introduction, that, 5);
                    WxParse.wxParse('training_target', 'html', res.data.list.training_target, that, 5);
                    WxParse.wxParse('courses', 'html', res.data.list.courses, that, 5);
                },
                fail: function (e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            })
        },
        //专业详情返回按钮
        _goBack(){
            this.setData({
                showMajorDetail: false
            })
        },
        selectMajorYear(e) {
            let that = this;
            let year = e.currentTarget.dataset.item;
            let scoreList = that.data.scoreList;
            scoreList.forEach(item=>{
                if(year == item.year){
                    this.setData({
                        currentScoreInfo:item,
                        currentYear: year
                    })
                }
            })
            
        },
        hide() {
            this.setData({
                dialogShow: false
            })
        },
        _close() {
            this.triggerEvent("close")
        },
    },
})
