// view/pages/index.js
var compont = require("../template/compont.js");
var tils = ["goobhabit","badhabit"];
var index = 0, front_id = -1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: wx.getStorageSync("totalscore"),
    "tasklist":"Hello world",
    shaige:true,
    meinv:false,
    array:[1,2,3,4,5],
    height: getApp().globalData.height,
    habits: wx.getStorageSync("habit"),
    habit: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var habits = wx.getStorageSync("habit");
    this.setData({ habit: habits.goobhabit });
    this.setData({ habits: habits });
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
  gettask: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    index = id;
    this.setData({ index: id });
    this.setData({ habit: this.data.habits[tils[id]] });
  },
  addContent: function (e) {
    var optype = "add";
    var _url = "../addContent/addContent?"
    var id = e.target.id;
    if (id) {
      optype = "update";
      _url += "id=habit-" + tils[index] + "-" + id.split("_")[1] + "&";
    } else {
      _url += "ctype=habit&";
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
      this.data.habit[front_id].isdisplay = false;
    }
    this.data.habit[id].isdisplay = true;
    front_id = id;
    this.setData({ habit: this.data.habit });
  },
  deleteContent: function (e) {
    var id = e.target.id.split("_")[1] - 0;
    var habit = this.data.habit, taskN = [];
    for (var i = 0; i < habit.length; i++) {
      if (i == id) {
        continue;
      }
      taskN.push(habit[i]);
    }
    habit = taskN;
    var habits = this.data.habits;
    habits[tils[index]] = habit;
    this.setData({ habits: habits });
    this.setData({ habit: habit });
    wx.setStorage({
      key: 'habit',
      data: habits,
    })
  },
  complateCont: function (e) {
    var id = e.target.id - 0;
    compont.complateCont(id, "habit", tils[index]);
    this.setData({ habits: wx.getStorageSync("habit") });
    this.setData({ habit: wx.getStorageSync("habit")[tils[index]] });
    this.setData({ score: wx.getStorageSync("totalscore") });
  }
})