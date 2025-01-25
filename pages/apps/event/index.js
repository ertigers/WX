import EventApi from '../../../api/event'
import Storage, { STORAGE_KEY } from '../../../utils/storage'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    eventList: [],
    loading: false,
    error: null,
    showPopup: false, // 控制弹出框显示
    // 其他页面数据

    eventData: {
      title: '',
      description: '',
      date: '',
      // 其他字段
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.fetchEvents()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时重新获取用户信息，处理用户信息更新的情况
    this.getUserInfo()
  },

  /**
   * 显示创建活动的弹出框
   */
  showCreateEventPopup() {
    console.log('111');
    
    this.setData({ showPopup: true });
  },

  /**
   * 关闭弹出框
   */
  closePopup() {
    this.setData({ showPopup: false, eventData: { title: '', description: '', date: '' } }); // 清空表单数据
  },

  /**
   * 提交创建事件表单
   */
  async submitForm() {
    const { eventData } = this.data
    // 可以在这里添加表单验证
    try {
      await EventApi.create(eventData)
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
      this.closePopup(); // 关闭弹出框
      this.fetchEvents(); // 刷新事件列表
    } catch (err) {
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      })
    }
  },

  /**
   * 表单输入处理
   */
  handleInputChange(e) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`eventData.${field}`]: value
    })
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
   * 获取事件列表
   */
  async fetchEvents() {
    this.setData({ loading: true, error: null })
    try {
      const res = await EventApi.getList({
        limit: 20,
        offset: 0,
        orderBy: ['created_at']
      })
      console.log(res);
      
      this.setData({
        eventList: res.objects,
        loading: false
      })
    } catch (err) {
      console.error('获取事件列表失败:', err)
      this.setData({
        error: err.message || '获取事件失败',
        loading: false
      })
      wx.showToast({
        title: '获取事件失败',
        icon: 'none'
      })
    }
  },

  /**
   * 创建新事件
   */
  async createEvent(eventData) {
    try {
      const newEvent = await EventApi.create(eventData)
      this.setData({
        eventList: [newEvent, ...this.data.eventList]
      })
      wx.showToast({
        title: '事件创建成功',
        icon: 'success'
      })
    } catch (err) {
      console.error('创建事件失败:', err)
      wx.showToast({
        title: '创建事件失败',
        icon: 'none'
      })
    }
  },

  /**
   * 更新事件
   */
  async updateEvent(eventId, updateData) {
    try {
      const updatedEvent = await EventApi.update(eventId, updateData)
      const updatedList = this.data.eventList.map(event =>
        event.id === eventId ? updatedEvent : event
      )
      this.setData({
        eventList: updatedList
      })
      wx.showToast({
        title: '事件更新成功',
        icon: 'success'
      })
    } catch (err) {
      console.error('更新事件失败:', err)
      wx.showToast({
        title: '更新事件失败',
        icon: 'none'
      })
    }
  },

  /**
   * 删除事件
   */
  async deleteEvent(eventId) {
    try {
      await EventApi.delete(eventId)
      const filteredList = this.data.eventList.filter(event => event.id !== eventId)
      this.setData({
        eventList: filteredList
      })
      wx.showToast({
        title: '事件删除成功',
        icon: 'success'
      })
    } catch (err) {
      console.error('删除事件失败:', err)
      wx.showToast({
        title: '删除事件失败',
        icon: 'none'
      })
    }
  },

  /**
   * 页面跳转处理
   * @param {Object} event 事件对象
   */
  handleGoPage(event) {
    const { url } = event.currentTarget.dataset
    if (!url) return

    // 如果目标页面需要登录，检查用户是否已登录
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
    const needLoginPages = [
      '/pages/apps/event/create',
      '/pages/apps/event/edit'
      // 添加其他需要登录的页面路径
    ]
    return needLoginPages.includes(url)
  }
})