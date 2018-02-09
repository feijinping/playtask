// view/addContent/addContent.js
var period = ["DAILY","WEEKLY","NONE"];
var itypes = ["day", "week", "common"];
var config = require("../../config.js");
var custReq = require("../../resource.js")["request"];
var util = require("../util/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{ value: "每日", checked: false }, { value: "每周", checked: false }, { value: "普通", checked: false }],
    task:{},
    optype:"",
    cType:"",
    op:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var op = options.op;
    var cType = options.cType;
    var cont = options.cont?JSON.parse(options.cont):{};
    var items = this.data.items;
    if (cType === 'task' && op == 'update'){
        if (cont.period === "DAILY") {
          items[0].checked = true;
        } else if (cont.period === "WEEKLY") {
          items[1].checked = true;
        } else {
          items[2].checked = true;
        }
    } else if (cType === 'enjoy'){
      var configs = wx.getStorageSync("configs");
      items = [{ value: configs['enjoyofgood'], checked: false }, { value: configs['enjoyofbad'], checked: false }];
      if (op == 'update') {
        if (cont.tag === "good") {
          items[0].checked = true;
        } else {
          items[1].checked = true;
        }
        this.setData({ optype: op });
      }
    }
    this.setData({ items });
    this.setData({ task: cont });
    if(!cont.id){
      let that = this;
      custReq({
        url: cType === 'enjoy' ? config.queryMaxIdOfEnjoy : config.queryMaxIdOfTask,
        success:function(re){
          cont.id = re.data;
          that.setData({ task: cont });
        }
      })
    }
    this.setData({ op, cType });
    if(op == "update"){
      op = "修改";
    }else{
      op = "添加";
    }
    if (cType == "task"){
      cType = "任务";
    }else{
      cType = "奖励";
    }
    this.setData({ optype: op + " " + cType});
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
  
  },
  retfontpage: function () {
    wx.navigateBack();
  },
  formSubmit : function(e){
    var task = this.data.task;
    var userid = wx.getStorageSync('userid');
    delete task["display"];
    delete task["opdisplay"];
    var va = e.detail.value;
    task.name=va.value;
    task.userid = userid;
    task.score = va.score - 0;
    task.totalTime = va.time - 0;
    var url = config.saveEnjoy;
    var iType = "";
    if (this.data.cType == 'task') {
      task.taskType = "TASK";
      task.period = period[va.period];
      url = config.saveTask;
      iType = itypes[va.period];
    }else{
      task.tag = va.period === '0'?'good':'bad';
      iType = task.tag;
    }
    if (this.data.op == 'add') {
      task.complated = 0;
      task.tag = task.tag?task.tag:'';
      task.tacticsid = 1;
    }
    
    util.addtask({
      dType: this.data.cType == 'task'?"tasks":"enjoys",
      iType,
      opType: this.data.op,
      url: url,
      data: JSON.stringify(task),
      method: "POST"
    });
    wx.navigateBack()
    // custReq({
    //   url: url,
    //   data: JSON.stringify(task),
    //   method:"POST",
    //   success:function(re){
    //     if(re.statusCode === 200){
    //       wx.navigateBack()
    //     }else{
    //       console.log(re);
    //     }
    //   },
    //   fail:function(re){
    //     console.log(re);
    //   }
    // })
  },
})