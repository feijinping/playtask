// view/interface/interf.js
var compont = require("../template/compont.js");
var index = 0,front_id=-1;
var tils = ["day","week","common","other"];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: wx.getStorageSync("task"),
    task: [],
    istask:true,
    score:1,
    index:0,
    height: getApp().globalData.height,
    complateCheck:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tasks = wx.getStorageSync("task");
    for(let task in tasks){
      for(let item in tasks[task]){
        tasks[task][item].display = true;
      }
    }
    this.setData({ task: tasks.day });
    this.setData({ tasks: tasks });
    this.setData({ score: wx.getStorageSync("totalscore") });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  switchmemu : function(e){
    var id = e.target.id.split("_")[1]-0;
    if(id == 3){
      this.setData({ istask: false });
    }else{
      this.setData({ istask: true });
    }
    index = id;
    this.setData({ complateCheck: false});
    this.setData({index:id});
    this.setData({ task: this.data.tasks[tils[id]]});
  },
  addContent : function(e){
    var optype = "add";
    var _url = "../addContent/addContent?"
    var id = e.target.id;
    if (id){
      optype = "update";
      _url += "id=task-"+ tils[index] + "-" +id.split("_")[1] + "&";
    }else{
      _url += "ctype=task&";
      optype = "add";
    }
    _url += 'type=' + optype;
    
    wx.redirectTo({
      url: _url,
    })
  },
  updateOrDelete:function(e){
    var id = e.target.id.split("_")[1] - 0;
    if (front_id !== -1){
      this.data.task[front_id].isdisplay = false;
    }
    this.data.task[id].isdisplay=true;
    front_id = id;
    this.setData({task:this.data.task});
  },
  deleteContent:function(e){
    var id = e.target.id.split("_")[1] - 0;
    var task = this.data.task,taskN=[];
    for(var i = 0; i < task.length; i ++){
      if(i == id){
        continue;
      }
      taskN.push(task[i]);
    }
    task = taskN;
    var tasks = this.data.tasks;
    tasks[tils[index]] = task;
    this.setData({ tasks: tasks});
    this.setData({task:task});
    wx.setStorage({
      key: 'task',
      data: tasks,
    })
  },
  complateCont:function(e){
    var id = e.currentTarget.id.split("_")[1] - 0;
    var task = this.data.task;
    var ts = task[id];
    if (this.data.complateCheck){
      ts.complated -= 1;
      if (ts.complated == 0){
        ts.display = false;
      }
    }else{
      ts.complated += 1;
      if (ts.complated >= ts.time) {
        ts.display = false;
      }
    }
    
    var tasks = this.data.tasks;
    tasks[tils[index]] = task;
    this.setData({ task: task});
    this.setData({ tasks: tasks });
  }, 
  showComplate : function (e) {
    var zx = !this.data.complateCheck;
    var task = this.data.task;
    for(let i = 0; i < task.length; i++){
      if (zx){
        if (task[i].complated != 0){
          task[i].display = true;
        }else{
          task[i].display = false;
        }
      }else{
        if (task[i].complated < task[i].time) {
          task[i].display = true;
        } else {
          task[i].display = false;
        }
      }
    }
    this.setData({ task: task });
    
    this.setData({ complateCheck: zx });
  }
})