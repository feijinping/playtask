var config = require("../../config.js");
var custReq = require("../../resource.js")["request"];
var waitData = require("../../resource.js")["waitData"];
var tils = ["day","week","common","other"];
var resource = require("../../resource.js");
var front_id=-1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: [],
    task: [],
    score:0,
    index:0,
    complateCheck:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onload = true;
    var initScore = this.initScore;
    var tasks = wx.getStorageSync("tasks");
    var score = wx.getStorageSync("score");
    var tBack = {
      dType: "tasks",
      back: this.init
    };
    var scback = {
      dType: "score",
      back: initScore
    };
    if(!tasks){
      waitData(tBack);
    }else{
      this.init(tasks);
      resource.validData(tBack);
    }
    if(score == null||score === undefined){
      waitData(scback);
    }else{
      initScore(score);
      resource.validData(scback);
    }
  },
  initScore(data){
      if(!data){
          data = 0;
      }
      if (typeof data === 'string') {
          data = Number(data);
          if (NaN == data) {
            data = 0;
          }
      }
      if(data > 99999){
        data = Number(data).toExponential(2);
      }
      this.setData({
        score: data
      })
    },
  init(tasks){
    this.setData({ task: this.initTask(tasks.day), tasks:tasks });
  },
  initTask(ts){
    for(let i = 0; i < ts.length; i++){
      let task = ts[i];
      task.opdisplay = false;
      if (task.totalTime !== -1 && task.complated >= task.totalTime) {
        task.display = false;
      } else {
        task.display = true;
      }
    }
    return ts;
  },
  onShow: function () {
    if (!this.onload){
      this.onLoad();
    }
    this.onload = false;
    this.setData({ index : 0,
      complateCheck:false
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  switchmemu : function(e){
    var id = e.target.id.split("_")[1]-0;
    this.setData({complateCheck: false});
    this.setData({index:id});
    this.setData({ task: this.initTask(this.data.tasks[tils[id]]) });
  },
  addContent : function(e){
    var url = "../addContent/addContent?op=add&cType=task"
    if(this.data.index == 3){
      url = "../duplicate/duplicate"
    }
    wx.navigateTo({
      url: url,
    })
  },
  updateTask(e){
    var id = e.target.id.split("_")[1];
    var task = this.data.task[id];
    var url = "../addContent/addContent?op=update&cType=task&cont=" + JSON.stringify(task);
    wx.navigateTo({
      url: url,
    })
  },
  updateOrDelete:function(e){
    var id = e.currentTarget.id.split("_")[1] - 0;
    var task = this.data.task;
    if (front_id !== -1 && task[front_id]){
      task[front_id].opdisplay = false;
    }
    front_id = id;
    task[id].opdisplay=true;
    this.setData({task});
  },
  deleteContent:function(e){
    var id = e.target.id.split("_")[1] - 0;
    var task = this.data.task;
    var tasks = this.data.tasks;
    wx.request({
      url: config.deleteTask+"?id=" + task[id].id,
    })
    task.splice(id,1);
    tasks[tils[this.data.index]] = task;
    wx.setStorageSync("tasks", tasks);
    this.setData({tasks: tasks});
    this.setData({task:task});
  },
  complateCont:function(e){
    var id = e.currentTarget.id.split("_")[1] - 0;
    var task = this.data.task;
    var score = wx.getStorageSync("score");
    score = score ? score : 0;
    var tasks = this.data.tasks;

    var ts = task[id];
    if (this.data.complateCheck ){
      if (ts.complated <= 0){
        return;
      }
      ts.complated -= 1;
      if (ts.complated == 0){
        ts.display = false;
      }
      score -= ts.score-0;
      wx.request({
        url: config.cancelTask + "?id=" + ts.id,
      })
    }else{
      ts.complated += 1;
      if (ts.complated >= ts.totalTime) {
        ts.display = false;
      }
      score += ts.score - 0;
      wx.request({
        url: config.complateTask + "?id="+ ts.id,
      })
    }
   
    tasks[tils[this.data.index]] = task;
    wx.setStorageSync("tasks", tasks);
    wx.setStorageSync("score", score);

    this.setData({  task, tasks});
    this.initScore(score);
  }, 
  showComplate : function (e) {
    //true 是勾选，显示已完成的
    var zx = !this.data.complateCheck;
    var task = this.data.task;
    for(let i = 0; i < task.length; i++){
      if (zx){
        if (task[i].complated > 0){
          task[i].display = true;
        }else{
          task[i].display = false;
        }
      }else{
        if (task[i].complated < task[i].totalTime) {
          task[i].display = true;
        } else {
          task[i].display = false;
        }
      }
    }
    this.setData({ task, complateCheck: zx});
  },
  menuClick(e){
    var task = this.data.task;
    if (front_id != -1 && task[front_id] && task[front_id].opdisplay){
      task[front_id].opdisplay = false;
      this.setData({ task })
    }
  },
  syncContent(e){
    resource.syncData();
  }
})