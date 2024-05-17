//app.js
App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,wx.getUserInfo,wx.requestPayment)
    wx.BaaS.init('cbb46e25618e02b51127')
    wx.BaaS.auth.loginWithWechat() // 静默登录
  },
  globalData: {
    userInfo: null
  }
})