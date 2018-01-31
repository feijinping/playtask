var config = require("../../config.js");
var tils = ["day","week","common","other"];
var index = 0,front_id=-1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: [],
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
    this.onload = true;
    var init = this.init;
    var initScore = (data)=>{
      this.setData({
        score:data.banlance
      })
    }
    wx.request({
      url: config.alltask,
      success: function (result) {
        var tasks = result.data;
        var taskOfDay = [], taskOfWeek = [], taskOfComm = [],taskOfDuli=[];
        for (let i = 0; i < tasks.length; i++) {
          var task = tasks[i];
          if ("DAILY" === task.period) {
            taskOfDay.push(task);
          } else if ("WEEKLY" === task.period) {
            taskOfWeek.push(task);
          } else if ("NONE" === task.period){
            taskOfComm.push(task);
          }else{
            taskOfDuli.push(task);
          }
        }
        init({
          day: taskOfDay,
          week: taskOfWeek,
          common: taskOfComm,
          other:taskOfDuli,
        });
      }
    });
    wx.request({
      url: config.queryScore,
      success:function(re){
        initScore(re.data);
      },
      fail:function(err){
        console.log(err)
      }
    });
  },
  init(tasks){
    for (let task in tasks) {
      for (let item in tasks[task]) {
        var ts = tasks[task][item];
        if(ts.complated >= ts.totalTime){
          ts.display = false;
        }else{
          ts.display = true;
        }
        ts.opdisplay = false;
      }
    }
    this.setData({ task: tasks.day });
    this.setData({ tasks: tasks });
  },
  onShow: function () {
    if (!this.onload){
      this.onLoad();
    }
    this.onload = false;
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
    this.setData({complateCheck: false});
    this.setData({index:id});
    this.setData({task: this.data.tasks[tils[id]]});
  },
  addContent : function(e){
    var url = "../addContent/addContent?op=add&cType=task"
    wx.navigateTo({
      url: url,
    })
  },
  updateTask(e){
    var id = e.target.id.split("_")[1];
    var task = this.data.task[id];
    console.log(task);
    var url = "../addContent/addContent?op=update&cType=task&cont=" + JSON.stringify(task);
    wx.navigateTo({
      url: url,
    })
  },
  updateOrDelete:function(e){
    var id = e.currentTarget.id.split("_")[1] - 0;
    if (front_id !== -1 && this.data.task[front_id]){
      this.data.task[front_id].opdisplay = false;
    }
    this.data.task[id].opdisplay=true;
    front_id = id;
    this.setData({task:this.data.task});
  },
  deleteContent:function(e){
    var id = e.target.id.split("_")[1] - 0;
    var task = this.data.task;
    wx.request({
      url: config.deleteTask+"?id=" + task[id].id,
    })
    task.splice(id,1);
    var tasks = this.data.tasks;
    tasks[tils[index]] = task;
    this.setData({ tasks: tasks});
    this.setData({task:task});
  },
  complateCont:function(e){
    var id = e.currentTarget.id.split("_")[1] - 0;
    var task = this.data.task;
    var score = this.data.score;
    var ts = task[id];
    if (this.data.complateCheck){
      ts.complated -= 1;
      if (ts.complated == 0){
        ts.display = false;
      }
      score -= ts.score-0;
      this.setData({
        score
      });
      wx.request({
        url: config.cancelTask + "?id=" + ts.id,
      })
    }else{
      ts.complated += 1;
      if (ts.complated >= ts.totalTime) {
        ts.display = false;
      }
      score += ts.score - 0;
      this.setData({
        score
      });
      wx.request({
        url: config.complateTask + "?id="+ ts.id +"&type="+ts.taskType+"&name=" + ts.name,
      })
    }
    
    var tasks = this.data.tasks;
    tasks[tils[index]] = task;
    this.setData({ task: task});
    this.setData({ tasks: tasks });
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
    this.setData({ task: task });
    this.setData({ complateCheck: zx });
  },
  menuClick(e){
    if (front_id != -1){
      var task = this.data.task;
      task[front_id].opdisplay = false;
      this.setData({ task })
    }
  },
})