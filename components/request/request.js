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
        roomLiveType: {
            type: Number,
            value: 0
        },
        //问题列表
        questionList: {
            type: Array,
            value: []
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
        myIntegral: {
            type: Number,
            value: ''
        },
    },
    data: {
        propList: [{
                prop: 1,
                src: '/static/crown.png'
            },
            {
                prop: 2,
              src: 'https://new.schoolpi.net/attach/small_program/live/gem.png'
            },
            {
                prop: 3,
                src: '/static/diamond.png'
            }
        ], //道具列表
        dialogShow: false,
        requestType: 0, //问答的类型,0=>学生，1=>教师
        scrollHeight: app.globalData.windowHeight - 140,
        height: app.globalData.statusBarHeight + 'px',
        question: '', //问题内容
        propType: 0, //道具类型
        showQuestionList: true, //展示问题列表
        tipShow: false,
        needIntegral: 0,//本次提问消耗积分
        showSuccessTips: false,//提交成功弹窗
        showSupportAnswer:false,//辅助回答弹窗
        supportContent:'',//辅助回答输入的内容
        supportQuestionId:'',//辅助回答的对应问题id
        moreContent:"213242432",
        currentViewSupport:0,//当前展开的辅助回答
        isZhuli:false,//是否是助理

    },
    ready(){
        this.setData({
            isZhuli: app.globalData.isZhuli
        })
    },
    methods: {
        //老师选择回答问题
        answerAsk(e) {
            console.log(e)
            var that = this;
            var question_id = e.currentTarget.dataset.id;
            util.request({
                url: '/api/wenda/check_wenda_status',
                data: {
                    room_id: that.data.roomID,
                    user_id: app.globalData.userInfo.id,
                    question_id: question_id
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code === 1) {
                        // that.setData({
                        //     showQuestionList: true
                        // })
                    } else {

                    }
                }
            })
        },
        //提交问题
        submitQuestion() {
            var that = this;
            if (that.data.question.length > 0) {
                if (that.data.showQuestionList) {
                    that.setData({
                        showQuestionList: false
                    })
                } else {
                    util.request({
                        url: '/api/wenda/tiwen',
                        data: {
                            room_id: that.data.roomID,
                            user_id: app.globalData.userInfo.id,
                            diamond_type: that.data.propType,
                            content: that.data.question,
                        },
                        method: 'post',
                        success: function(res) {
                            if (res.data.code === 1) {
                                that.setData({
                                    needIntegral: res.data.integral,
                                    showSuccessTips: true
                                })
                            } else {

                            }
                        }
                    })
                }
            } else {
                wx.showToast({
                    title: '请输入问题',
                    icon: 'none'
                })
            }


        },
        //点击知道了
        makeSure() {
            this.setData({
                showSuccessTips: false,
                showQuestionList: true,
            })
        },
        //点击辅助回答
        supportAnswer(e){
            console.log(e)
            let id = e.currentTarget.dataset.id
            this.setData({
                supportQuestionId:id,
                showSupportAnswer:true
            })
        },
        //辅助回答失去焦点
        blurSupport(){
            this.setData({
                showSupportAnswer: false
            })
        },
        //监听辅助回答
        inputSupport(e){
            console.log(e)
            let content = e.detail.value;
            this.setData({
                supportContent:content
            })
        },
        //发送辅助回答
        submitSupportAnswer(){
            let that = this;
            util.request({
                url: '/api/wenda/answer',
                data: {
                    room_id: that.data.roomID,
                    question_id: that.data.supportQuestionId,
                    content: that.data.supportContent
                },
                method: 'post',
                success: function (res) {
                    if (res.data.code === 1) {
                        that.setData({
                            showSupportAnswer: false
                        })
                    } else {

                    }
                }
            })
            
        },
        //查看辅助回答
        viewMore(e){
            console.log(e)
            let id = e.currentTarget.dataset.id
            if(id == this.data.currentViewSupport){
                this.setData({
                    currentViewSupport:0
                })
            }else{
                this.setData({
                    currentViewSupport: id
                })
            }
            
        },
        //学生点击想问
        wantQuest(e) {
            var that = this;
            var question_id = e.currentTarget.dataset.id;
            var questionList = that.data.questionList
            util.request({
                url: '/api/wenda/xiangwen',
                data: {
                    room_id: that.data.roomID,
                    user_id: app.globalData.userInfo.id,
                    question_id: question_id
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code === 1) {
                        questionList.forEach(item => {
                            if (item.id === question_id) {
                                item.number++
                            }
                        })
                        that.setData({
                            questionList: questionList
                        })
                    } else {

                    }
                }
            })
        },
        //监听问题输入框
        listenQuestion(e) {
            var question = e.detail.value;
            this.setData({
                question: question
            })
        },
        show(type) {
            var that = this;
            //type区分教师和学生端
            that.setData({
                dialogShow: true,
                requestType: type
                // dialogTitle: name,
            })
        },
        //选择道具
        selectProp(e) {
            var propType = e.currentTarget.dataset.proptype;
            var that = this;
            that.setData({
                propType: propType
            })
            util.request({
                url: '/api/wenda/check_user_integral',
                data: {
                    user_id: app.globalData.userInfo.id,
                    diamond_type: that.data.propType
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code === 1) {

                    } else {
                        that.setData({
                            propType: 0
                        })
                        wx.showToast({
                            title: '积分不足',
                            icon: 'none'
                        })
                    }
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
        change() {
            this.setData({
                showQuestionList: !this.data.showQuestionList
            })
        },
    },
})