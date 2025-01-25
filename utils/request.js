// 知晓云统一请求封装

const TABLE_ID = {
  // 在这里添加其他表的 ID
  BADMINTON_GROUP: 'badminton_group', // 羽毛球圈子表
  BADMINTON_FIGHT_RECORD: 'badminton_fight_record', // 羽毛球比赛记录表
  BADMINTON_EVENT: 'badminton_event', // 羽毛球活动表
}

// 错误码管理
const ERROR_CODE = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

class Request {
  constructor() {
    this.tableObject = null
    this.queryObject = null
  }

  // 初始化表对象
  table(tableId) {
    this.tableObject = new wx.BaaS.TableObject(tableId)
    this.queryObject = new wx.BaaS.Query()
    return this
  }

  // 错误处理
  handleError(err) {
    console.error('请求失败:', err)
    let message = '操作失败'
    
    switch (err.code) {
      case ERROR_CODE.UNAUTHORIZED:
        message = '请先登录'
        // 可以在这里处理登录失效的逻辑
        wx.navigateTo({ url: '/pages/login/index' })
        break
      case ERROR_CODE.NOT_FOUND:
        message = '数据不存在'
        break
      case ERROR_CODE.SERVER_ERROR:
        message = '服务器错误'
        break
      default:
        message = err.message || '操作失败'
    }

    wx.showToast({
      title: message,
      icon: 'none'
    })
    
    throw err
  }

  /**
   * 构建查询条件
   * @param {Object} conditions 查询条件
   * @example
   * {
   *   name: ['contains', '张'],  // 名字包含"张"
   *   age: ['>=', 18],          // 年龄大于等于18
   *   id: ['in', [1,2,3]],      // id在数组中
   *   isActive: ['=', true]     // 精确匹配
   * }
   */
  where(conditions = {}) {
    Object.entries(conditions).forEach(([key, [operator, value]]) => {
      switch(operator) {
        case '=':
          this.queryObject.compare(key, '=', value)
          break
        case '>':
          this.queryObject.compare(key, '>', value)
          break
        case '>=':
          this.queryObject.compare(key, '>=', value)
          break
        case '<':
          this.queryObject.compare(key, '<', value)
          break
        case '<=':
          this.queryObject.compare(key, '<=', value)
          break
        case 'in':
          this.queryObject.in(key, value)
          break
        case 'notIn':
          this.queryObject.notIn(key, value)
          break
        case 'contains':
          this.queryObject.contains(key, value)
          break
        case 'matches':
          this.queryObject.matches(key, value)
          break
        default:
          this.queryObject.compare(key, '=', value)
      }
    })
    return this
  }

  /**
   * 查询数据列表
   * @param {Object} params 查询参数
   * @param {Number} params.limit 每次最多返回数量，默认为 20
   * @param {Number} params.offset 偏移量，默认为 0
   * @param {Array} params.orderBy 排序字段，例：['created_at'] 
   */
  async find(params = {}) {
    try {
      const { limit = 20, offset = 0, orderBy } = params
      
      if (this.queryObject) {
        this.tableObject.setQuery(this.queryObject)
      }
      
      this.tableObject.limit(limit)
      this.tableObject.offset(offset)

      if (orderBy) {
        this.tableObject.orderBy(orderBy)
      }

      const res = await this.tableObject.find()
      return res.data
    } catch (err) {
      return this.handleError(err)
    }
  }

  /**
   * 查询单条数据
   * @param {String} recordId 记录 ID
   */
  async get(recordId) {
    try {
      const res = await this.tableObject.get(recordId)
      return res.data
    } catch (err) {
      return this.handleError(err)
    }
  }

  /**
   * 创建数据
   * @param {Object} data 创建的数据
   */
  async create(data) {
    try {
      const product = this.tableObject.create()
      product.set(data)
      const res = await product.save()
      return res.data
    } catch (err) {
      return this.handleError(err)
    }
  }

  /**
   * 更新数据
   * @param {String} recordId 记录 ID
   * @param {Object} data 更新的数据
   */
  async update(recordId, data) {
    try {
      const product = this.tableObject.getRecord(recordId)
      product.set(data)
      const res = await product.update()
      return res.data
    } catch (err) {
      return this.handleError(err)
    }
  }

  /**
   * 删除数据
   * @param {String} recordId 记录 ID
   */
  async delete(recordId) {
    try {
      const res = await this.tableObject.delete(recordId)
      return res.data
    } catch (err) {
      return this.handleError(err)
    }
  }

  /**
   * 批量删除
   * @param {Array} recordIds 记录 ID 数组
   */
  async batchDelete(recordIds) {
    try {
      const res = await this.tableObject.delete(recordIds)
      return res.data
    } catch (err) {
      return this.handleError(err)
    }
  }
}

export const request = new Request()
export { TABLE_ID } 