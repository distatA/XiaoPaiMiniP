/*
 * 统计工具
 */
const app = getApp();
const util = require('./util.js');
const requestUrl = "https://new.schoolpi.net/api"
//计算进入时间
const calEnterTime = () => {
    var timestamp = Date.parse(new Date())/1000;
    app.globalData.enterTime = timestamp;
    app.globalData.leaveTime = timestamp
}
//计算离开时间
const calLeaveTime = () => {
    var timestamp = Date.parse(new Date())/1000;
    app.globalData.leaveTime = timestamp
}
//发起统计请求
const statistics = options =>{
    // console.log(options)
    let stayTime = app.globalData.leaveTime - app.globalData.enterTime;
    let system = wx.getSystemInfoSync();
    wx.request({
        url: requestUrl +'/statistics/add.html',
        method:'POST',
        data:{
            uid:app.globalData.userInfo.id,
            city_id: app.globalData.province.cid,
            brand: system.brand,
            platform: 0,
            school_id: options.schoolId ? options.schoolId : 0,
            object_type: options.objectType ? options.objectType:0,
            object_id: options.objectId ? options.objectId:0,
            is_out: options.isOut ? options.isOut : 0,
            create_time: app.globalData.enterTime,
            stay_time: app.globalData.leaveTime-app.globalData.enterTime
        }
    })
    
}
const share=options=>{
    wx.request({
        url: requestUrl + '/statistics/share',
        method: 'POST',
        data: {
            uid: app.globalData.userInfo.id,
            platform: 0,
            school_id: options.schoolId ? options.schoolId : 0,
            object_type: options.objectType ? options.objectType : 0,
            object_id: options.objectId ? options.objectId:0
        }
    })
}

module.exports = {
    calEnterTime: calEnterTime,
    calLeaveTime: calLeaveTime,
    statistics: statistics,
    share:share
}