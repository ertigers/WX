Page({
  data: {
    userInfo: '',
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
  },
  onLoad: function (options) {
    //获取小程序本地缓存的用户信息，判断用户之前是否授权登录
    try {
      var value = wx.getStorageSync('userInfo') //本地缓存中指定的userInfo
      console.log(value);
      
      if (value) {
        // Do something with return value
        this.setData({
          userInfo: value
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 用户点击授权登录时,会获取用户信息存放本地并存至数据库
   */
  async userInfoHandler(data) { 
    //用户点击“授权登录”按钮时，会返回获取到的用户信息
    try {
      const nickname = data.detail.userInfo.nickName
      const avatar = data.detail.userInfo.avatarUrl
      // const censor = await wx.BaaS.wxCensorText(nickname)
      // console.log(censor);
      // if (censor.data.risky) {
      //   // 处理昵称文本不合法的情况...
      //   return
      // }
      const user = await wx.BaaS.auth.getCurrentUser()
      console.log(user);
      user.set({
        'nickname': nickname,
        'avatar': avatar
      }).update()
      //将用户信息缓存
      wx.setStorageSync('userInfo', user)
      this.setData({
        userInfo: user
      })
    } catch (error) {
      console.log(error);
      // 处理错误情况 HError
    }
  },

  handleGoPage(e) {
    let url = e.currentTarget.dataset.id
    console.log(url);
    wx.navigateTo({
      url,
    })
  }
})