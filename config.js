/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

var host = "https://61660958.feijinping.xyz/TaskEnjoy";
//var host = "http://localhost:8888/taskenjoy";
var hostWafer = "https://61660958.feijinping.xyz/wafer";

var config = {

    // 下面的地址配合云端 Server 工作
    host,
    hostWafer,
    // 所有好习惯
    allgoodhabit: `${host}/goodHabit/allGoodHabit`,
    alltask: `${host}/task/allTask`,
    complateTask: `${host}/task/completeTask`,
    cancelTask: `${host}/task/cancelTask`,
    deleteTask: `${host}/task/deleteTask`,
    saveTask: `${host}/task/saveTask`,
    queryTask: `${host}/task/queryTask`,
    queryScore: `${host}/view/getStatistic`,
    queryMaxIdOfTask: `${host}/task/queryMaxIdOfTask`,
    //enjoy
    allEnjoy: `${host}/enjoy/allEnjoy`,
    undoEnjoy: `${host}/enjoy/undoEnjoy`,
    doEnjoy: `${host}/enjoy/doEnjoy`,
    saveEnjoy: `${host}/enjoy/saveEnjoy`,
    deleteEnjoy:`${host}/enjoy/deleteEnjoy`,
    queryMaxIdOfEnjoy: `${host}/enjoy/queryMaxIdOfEnjoy`,

    //反馈
    feedback: `${host}/feedback/feed`,

    //config
    getConfigs: `${host}/config/get`,
    setConfigs: `${host}/config/set`,
    //用户
    saveUser:`${host }/user/saveUser`,
    // 登录地址，用于建立会话
    loginUrl: `${hostWafer}/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${hostWafer}/user`,

    // 用code换取openId
    openIdUrl: `${hostWafer}/openid`,

    // 测试的信道服务接口
    tunnelUrl: `${hostWafer}/tunnel`,

    // 生成支付订单的接口
    paymentUrl: `${hostWafer}/payment`,

    // 发送模板消息接口
    templateMessageUrl: `${host}/templateMessage`,

    // 上传文件接口
    uploadFileUrl: `${host}/upload`,

    // 下载示例图片接口
    downloadExampleUrl: `${host}/static/weapp.jpg`
};

module.exports = config
