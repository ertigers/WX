/**
 * Storage 工具类
 * 封装微信小程序的存储相关 API
 */
class Storage {
  /**
   * 存储键名前缀，避免冲突
   */
  static prefix = 'huhu_'

  /**
   * 获取完整键名
   * @param {string} key 键名
   * @returns {string} 添加前缀后的键名
   */
  static getKey(key) {
    return `${this.prefix}${key}`
  }

  /**
   * 存储数据
   * @param {string} key 键名
   * @param {any} value 需要存储的数据
   */
  static set(key, value) {
    try {
      wx.setStorageSync(this.getKey(key), value)
    } catch (error) {
      console.error('Storage.set error:', error)
      throw error
    }
  }

  /**
   * 获取数据
   * @param {string} key 键名
   * @param {any} defaultValue 默认值，当数据不存在时返回
   * @returns {any} 存储的数据或默认值
   */
  static get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(this.getKey(key))
      return value || defaultValue
    } catch (error) {
      console.error('Storage.get error:', error)
      return defaultValue
    }
  }

  /**
   * 删除数据
   * @param {string} key 键名
   */
  static remove(key) {
    try {
      wx.removeStorageSync(this.getKey(key))
    } catch (error) {
      console.error('Storage.remove error:', error)
      throw error
    }
  }

  /**
   * 清除所有数据
   */
  static clear() {
    try {
      wx.clearStorageSync()
    } catch (error) {
      console.error('Storage.clear error:', error)
      throw error
    }
  }

  /**
   * 获取所有数据
   * @returns {Object} 所有存储的数据
   */
  static getAll() {
    try {
      return wx.getStorageInfoSync()
    } catch (error) {
      console.error('Storage.getAll error:', error)
      return {}
    }
  }
}

// 存储键名常量
export const STORAGE_KEY = {
  USER_INFO: 'userInfo',
  TOKEN: 'token',
  // 其他键名...
}

export default Storage 