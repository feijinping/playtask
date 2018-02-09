var config = require("./config.js");
//缓存无数据，等待同步
var requestArr = {};
//验证缓存中的数据，如果不一致就要同步
var validDataSync={};

//等待数据函数
function waitData(options){
  addData2Array(options, requestArr);
}
//校验数据，不同就要同步
function validData(options) {
  addData2Array(options, validDataSync);
}
function addData2Array(options, array){
  if (!options.dType) {
    console.error("no dType");
    return;
  }
  array[options.dType] = [];
  array[options.dType].push(options.back);
}

function dealData(dType,data){
  var taskfun = requestArr[dType];
  if (!taskfun || !(taskfun instanceof Array)){
    return;
  }
  for (let i = 0; i < taskfun.length; i++) {
    taskfun[i](data);
  }
}
var tranData = (opt)=>{
  const { dType, data} = opt;
  var taskfun = validDataSync[dType];
  if(!taskfun || !(taskfun instanceof Array)){
    return;
  }
  for (let i = 0; i < taskfun.length; i++) {
    taskfun[i](data);
  }
}
function syncData() {
  console.log("同步")
  getDatas(tranData);
}
function request(options){
  if (!options.url){
    console.error("url cannot be null")
    return;
  }
  var req = () => {
    var url = options.url;
    var data = options.data ? options.data : {};
    var method = options.method ? options.method : "GET";
    var header = { userid: wx.getStorageSync("userid") };
    var success = options.success ? options.success : (res) => { console.log(res) };
    var fail = options.fail ? options.fail : (res) => { console.error(res) };
    var complete = options.complete ? options.complete : (res) => { };
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method,
      success: function (res) {
        success(res);
      },
      fail: function (res) {
        fail(res);
      },
      complete: function (res) {
        complete(res)
      },
    })
  }
  if(!wx.getStorageSync("userid")){
    setTimeout(req,1000)
  }else{
    req()
  }
}

function getDatas(callback){
  request({
    url: config.queryTask,
    success: function (result) {
      if (result.statusCode !== 200) {
        wx.showToast({
          title: '请求异常',
          icon: 'none',
          image: '/image/info/error.jpg'
        })
        return;
      }
      var tasks = result.data;
      var taskOfDay = [], taskOfWeek = [], taskOfComm = [], taskOfDuli = [];
      for (let i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        task.opdisplay = false;
        if (task.totalTime !== -1&&task.complated >= task.totalTime) {
          task.display = false;
        } else {
          task.display = true;
        }
       
        if ("DAILY" === task.period) {
          taskOfDay.push(task);
        } else if ("WEEKLY" === task.period) {
          taskOfWeek.push(task);
        } else if ("NONE" === task.period) {
          taskOfComm.push(task);
        } else {
          taskOfDuli.push(task);
        }
      }
      var option = { dType : 'tasks',data : {
          day: taskOfDay,
          week: taskOfWeek,
          common: taskOfComm,
          other: taskOfDuli,} }
      dealData(option);
      callback && callback(option);
      wx.setStorageSync("tasks",{
        day: taskOfDay,
        week: taskOfWeek,
        common: taskOfComm,
        other: taskOfDuli,
      });
    }
  });
  request({
    url: config.allEnjoy,
    success: function (result) {
      var enjoys = result.data;
      var enjoyOfGood = [], enjoyOfBad = [];
      for (let i = 0; i < enjoys.length; i++) {
        var enjoy = enjoys[i];
        enjoy.display = true;
        enjoy.opdisplay = false;
        if (enjoy.tag === "good") {
          enjoyOfGood.push(enjoy);
        } else {
          enjoyOfBad.push(enjoy);
        }
      }
      var option = { dType:'enjoys', data:{
        good: enjoyOfGood,
        bad: enjoyOfBad
      }};
      dealData(option);
      callback && callback(option);
      wx.setStorageSync("enjoys",{
        good: enjoyOfGood,
        bad: enjoyOfBad
      })
    }
  })
  request({
    url: config.queryScore,
    success: function (re) {
      var option = {dType: 'score', data: re.data.banlance}
      dealData(option);
      callback && callback(option);
      wx.setStorageSync("score", re.data.banlance)
    }
  })
  request({
    url:config.getConfigs,
    success:function(data){
      var re = data.data;
      var configs = {};
      for(let i = 0; i < re.length; i++){
        configs[re[i]["ukey"]] = re[i]["uvalue"];
      }
      var option = { dType: 'configs', data: configs};
      dealData(option);
      callback && callback(option);
      wx.setStorageSync("configs", configs);
    }
  });
}
module.exports = { request, syncData, getDatas, waitData, validData};