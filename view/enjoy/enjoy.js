// view/enjoy/enjoy.js
var tils = ["good", "bad"];
var index = 0,front_id = -1;
var config = require("../../config.js");
var custReq = require("../../resource.js")["request"];
var waitData = require("../../resource.js")["waitData"];
var resource = require("../../resource.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    enjoys: [],
    enjoy:[],
    good:"享受",
    bad:"腐败",
    index:0,
    complateCheck:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var init = (enjoys)=>{
      this.setData({ enjoys, enjoy: this.initEnjoy(enjoys[tils[0]]) })
    }
    var initConf = (configs)=>{
      this.setData({
        good: configs["enjoyofgood"],
        bad: configs["enjoyofbad"]
      });
    }
    var initScore = this.initScore;
    var enjoys = wx.getStorageSync("enjoys");
    var score = wx.getStorageSync("score");
    var configs = wx.getStorageSync("configs");

    var eOptions = { dType: "enjoys",back: init};
    var sOptions = { dType: "score",back: initScore};
    var cOptions = { dType: "configs", back: initConf };
    if(configs){
      initConf(configs);
    }
    if (!enjoys) {
      waitData(eOptions);
    } else {
      init(enjoys);
      resource.validData(eOptions);
    }
    if (!score) {
      waitData(sOptions);
    } else {
      initScore(score);
      resource.validData(sOptions);
    }
  },
  initScore(data) {
    if (!data) {
      data = 0;
    }
    if (typeof data === 'string') {
      data = Number(data);
      if (NaN == data) {
        data = 0;
      }
    }
    if (data > 99999) {
      data = Number(data).toExponential(2);
    }
    this.setData({
      score: data
    })
  },
  initEnjoy(ts) {
    for (let i = 0; i < ts.length; i++) {
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.onload) {
      this.onLoad();
    }
    this.onload = false;
    this.setData({ index: 0 });
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
  switchmemu: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    index = id;
    this.setData({ complateCheck: false });
    this.setData({ index: id });
    this.setData({ enjoy: this.initEnjoy(this.data.enjoys[tils[id]]) });
  },
  addContent: function (e) {
    var url = "../addContent/addContent?op=add&cType=enjoy"
    wx.navigateTo({
      url: url,
    })
  },
  updateTask(e) {
    var id = e.target.id.split("_")[1];
    var enjoy = this.data.enjoy[id];
    console.log(enjoy);
    var url = "../addContent/addContent?op=update&cType=enjoy&cont=" + JSON.stringify(enjoy);
    wx.navigateTo({
      url: url,
    })
  },
  updateOrDelete: function (e) {
    var id = e.currentTarget.id.split("_")[1] - 0;
    if (front_id !== -1 && this.data.enjoy[front_id]) {
      this.data.enjoy[front_id].opdisplay = false;
    }
    this.data.enjoy[id].opdisplay = true;
    front_id = id;
    this.setData({ enjoy: this.data.enjoy });
  },
  deleteContent: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    var enjoy = this.data.enjoy;
    wx.request({
      url: config.deleteEnjoy + "?id=" + enjoy[id].id,
    })
    enjoy.splice(id, 1);
    var enjoys = this.data.enjoys;
    enjoys[tils[index]] = enjoy;

    wx.setStorageSync("enjoys", enjoys)
    this.setData({ enjoys: enjoys });
    this.setData({ enjoy: enjoy });
  },
  complateCont: function (e) {
    var id = e.currentTarget.id.split("_")[1] - 0;
    var enjoy = this.data.enjoy;
    var score = wx.getStorageSync("score");
    var ts = enjoy[id];
    var enjoys = this.data.enjoys;
    score = score ? score : 0;
    if (this.data.complateCheck) {
      if (ts.complated == 0){
        return;
      }
      ts.complated -= 1;
      if (ts.complated == 0) {
        ts.display = false;
      }
      score += ts.score - 0;
      
      wx.request({
        url: config.undoEnjoy + "?id=" + ts.id,
      })
    } else {
      ts.complated += 1;
      if (ts.totalTime == -1){
        ts.display = true;
      }else if (ts.complated >= ts.totalTime) {
        ts.display = false;
      }
      score -= ts.score - 0;
      
      wx.request({
        url: config.doEnjoy + "?id=" + ts.id,
      })
    }
    enjoys[tils[index]] = enjoy;
    
    wx.setStorageSync("enjoys", enjoys);
    wx.setStorageSync("score", score);
    this.initScore(score);
    this.setData({ enjoy });
    this.setData({ enjoys: enjoys });
  },
  showComplate: function (e) {
    //true 是勾选，显示已完成的
    var zx = !this.data.complateCheck;
    var enjoy = this.data.enjoy;
    for (let i = 0; i < enjoy.length; i++) {
      if (zx) {
        if (enjoy[i].complated > 0) {
          enjoy[i].display = true;
        } else {
          enjoy[i].display = false;
        }
      } else {
        if (enjoy[i].totalTime === -1) {
          enjoy[i].display = true;
        } else if (enjoy[i].complated < enjoy[i].totalTime) {
          enjoy[i].display = true;
        } else {
          enjoy[i].display = false;
        }
      }
    }
    this.setData({ enjoy: enjoy });
    this.setData({ complateCheck: zx });
  },

  menuClick(e) {
    var enjoy = this.data.enjoy;
    if (front_id != -1 && enjoy[front_id]) {
      enjoy[front_id].opdisplay = false;
      this.setData({ enjoy })
    }
  },
  syncContent(e) {
    resource.syncData();
  }
})