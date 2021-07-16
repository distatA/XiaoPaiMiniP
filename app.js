const ald = require("./utils/ald-stat.js")
// const util = require('./utils/util.js')
App({
    globalData: {
        key:0,//课程点播课程id
        province: {//最新，存储全局地区信息
            id: 14234,
            province: '安徽',
            city: "合肥市",
            cid: 14235
        },
        userOpenId:'',
        apiUrl: 'https://new.schoolpi.net',
        isLogin:false,
        userInfo:{
          id:0
        },
        userid: 0,
        schoolid: 0, //本科优选专科优选中有用
        exam:{//新高考全局变量
            province:0,
            year:0,
            searchValue:'',
            type:0
        },
        enterTime:0,
        leaveTime:0,
        schoolType:0,//学校的类型(本科，专科)，埋点统计需要
        topTitle:'',//分类招生顶部标题
        zbhostUrl: "https://livedev.schoolpi.net",
        liveToken:'',
         hostUrlOld: "https://zb.schoolpi.net",//迁移的直播列表地址
        /**上面为最新的**/
        hostUrl: "https://zjnb.720pai.cn/api/",
        hostNewApiUrl: "https://zjnb.720pai.cn/api2/",
        adApiUrl: "https://ad.schoolpi.net/api", //广告系统
        requestUrl: "https://new.schoolpi.net/api",//vr 
        
        requestUrl_new: "https://new.schoolpi.net/api2",//vr 


        loadUrl: "https://att.schoolpi.net", //直播ppt图片

        location: null, //经纬度信息
        zypcban: 0,
        islogin: false, //是否登录
        school_strid: '',
        school_list: [], //用于录取概率存储添加对比学校信息   
        deleteSch: [], //用于录取概率删除添加对比学校信息  
        volunteer_list: [], //志愿单
        did: 0,
        courtId: 0,
        mid: 0,
        job: 1,
        statusBarHeight: 0,
        windowHeight: 0,
    },
    // 定位
    onLaunch: function() {
        var that = this;
        wx.getSetting({
            success: (res) => { //箭头函数为了处理this的指向问题	
                if (res.authSetting["scope.userInfo"]) {
                    wx.getStorage({
                        key: 'userInfo',
                        success: function(res) {
                            that.globalData.userInfo = res.data;
                            that.globalData.isLogin = true;
                            that.globalData.userid = res.data.id;
                            //新版3.0
                        },
                    })
                    wx.getStorage({
                        key: 'userOpenId',
                        success: function (res) {
                            that.globalData.userOpenId = res.data;
                            //新版3.0
                        },
                    })
                }else{
                }
            }
        });
      
        wx.getSystemInfo({
          success: function (res) {
            that.globalData.statusBarHeight = res.statusBarHeight;
            that.globalData.windowHeight = res.windowHeight;
          },
        })
    }
})