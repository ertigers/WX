import Storage, { STORAGE_KEY } from '../../../utils/storage'

Page({
  data: {
    userInfo: null,
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    // 页面跳转配置
    pageLinks: [
      {
        id: '/pages/mine/myCircle/index',
        text: '我的圈子'
      },
      {
        id: '/pages/mine/settings/index',
        text: '设置'
      }
      // 可以继续添加其他链接
    ]
  },

  onLoad() {
    this.getUserInfo()
  },

  onShow() {
    // 页面显示时重新获取用户信息，处理用户信息更新的情况
    this.getUserInfo()
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    const userInfo = Storage.get(STORAGE_KEY.USER_INFO)
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  /**
   * 用户授权登录处理
   * @param {Object} event 事件对象
   */
  async userInfoHandler(event) {
    try {
      const { userInfo: wxUserInfo } = event.detail
      if (!wxUserInfo) {
        return
      }

      // 获取当前用户
      const user = await wx.BaaS.auth.getCurrentUser()
      
      // 更新用户信息
      await user.set({
        nickname: wxUserInfo.nickName,
        avatar: wxUserInfo.avatarUrl
      }).update()

      // 存储用户信息
      Storage.set(STORAGE_KEY.USER_INFO, user)
      
      // 更新页面数据
      this.setData({ userInfo: user })

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('登录失败:', error)
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  },

  /**
   * 页面跳转处理
   * @param {Object} event 事件对象
   */
  handleGoPage(event) {
    const { id: url } = event.currentTarget.dataset
    if (!url) {
      return
    }

    // 检查是否需要登录
    if (this.needLogin(url) && !this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({ url })
  },

  /**
   * 检查页面是否需要登录
   * @param {string} url 页面路径
   * @returns {boolean}
   */
  needLogin(url) {
    // 需要登录的页面路径
    const needLoginPages = [
      '/pages/mine/myCircle/index'
    ]
    return needLoginPages.includes(url)
  }
})