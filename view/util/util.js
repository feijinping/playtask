var custReq = require("../../resource.js")["request"];
function addtask(option){
  //修改缓存
  pageSyncData(option);
  //发送请求
  var success = option.success ? option.success:()=>{};
  custReq({
    url: option.url,
    data: option.data,
    method: option.method,
    success: function (re) {
      success(re);
    }
  })
}
function pageSyncData(option){
    let item = JSON.parse(option.data);
    let allitems = wx.getStorageSync(option.dType);
    let items = allitems[option.iType];
    if(option.opType == 'update'){
      for(let akey in allitems){
        for(let i = 0; i < allitems[akey].length; i++){
          var sitem = allitems[akey][i];
          if (sitem.id == item.id) {
            allitems[akey].splice(i,1);
            for (var ikey in item) {
              if (!isEmpty(item[ikey])) {
                sitem[ikey] = item[ikey];
              }
            }
            allitems[option.iType].push(sitem);
          }
        }
      }
    }else{
      item.display=true;
      item.opdisplay = false;
      items.push(item);
    }
    wx.setStorageSync(option.dType, allitems);
}
function isEmpty(str){
  if(!str){
    return true;
  }
  if (typeof str == 'String'&&"" === str.trim()){
    return true;
  }
  return false;
}
module.exports = {addtask};