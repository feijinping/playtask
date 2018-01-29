// view/enjoy/enjoy.js
var compont = require("../template/compont.js");
var tils = ["enjoy1", "enjoy2"];
var index = 0,front_id = -1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: getApp().globalData.height,
    score: wx.getStorageSync("totalscore"),
    enjoys: wx.getStorageSync("enjoy"),
    enjoy:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ enjoys: wx.getStorageSync("enjoy") })
    this.setData({ enjoy: this.data.enjoys[tils[0]]});
    this.setData({ score: wx.getStorageSync("totalscore") });
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
  gettask : function (e) {
    var id = e.target.id.split("_")[1] - 0;
    index = id;
    this.setData({ index: id });
    this.setData({ enjoy: this.data.enjoys[tils[id]] });
  },
  addContent: function (e) {
    var optype = "add";
    var _url = "../addContent/addContent?"
    var id = e.target.id;
    if (id) {
      optype = "update";
      _url += "id=enjoy-" + tils[index] + "-" + id.split("_")[1] + "&";
    } else {
      _url += "ctype=enjoy&";
      optype = "add";
    }
    _url += 'type=' + optype;

    wx.redirectTo({
      url: _url,
    })
  },
  updateOrDelete: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    if (front_id !== -1) {
      this.data.enjoy[front_id].isdisplay = false;
    }
    this.data.enjoy[id].isdisplay = true;
    front_id = id;
    this.setData({ enjoy: this.data.enjoy });
  },
  deleteContent: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    var task = this.data.enjoy, taskN = [];
    for (var i = 0; i < task.length; i++) {
      if (i == id) {
        continue;
      }
      taskN.push(task[i]);
    }
    task = taskN;
    var tasks = this.data.enjoys;
    tasks[tils[index]] = task;
    this.setData({ enjoys: tasks });
    this.setData({ enjoy: task });
    wx.setStorage({
      key: 'enjoy',
      data: tasks,
    })
  },
  complateCont: function (e) {
    var id = e.target.id - 0;
    compont.complateCont(id, "enjoy", tils[index]);
    this.setData({ enjoys: wx.getStorageSync("enjoy") });
    this.setData({ enjoy: wx.getStorageSync("enjoy")[tils[index]] });
    this.setData({ score: wx.getStorageSync("totalscore") });
  }
})