import { request, TABLE_ID } from '../utils/request'

/**
 * 事件相关接口
 */
class EventApi {
  /**
   * 获取事件列表
   * @param {Object} params 查询参数
   * @param {Number} params.limit 每页数量
   * @param {Number} params.offset 偏移量
   * @param {Array} params.orderBy 排序字段，例：['-created_at']
   */
  static async getList(params = {}) {
    return request
      .table(TABLE_ID.BADMINTON_EVENT)
      .find(params)
  }

  /**
   * 获取我的事件列表
   * @param {String} userId 用户ID
   */
  static async getMyEvents(userId) {
    if (!userId) {
      throw new Error('用户未登录')
    }

    return request
      .table(TABLE_ID.BADMINTON_EVENT)
      .where({
        'created_by': ['=', userId]
      })
      .find()
  }

  /**
   * 获取事件详情
   * @param {String} id 事件ID
   */
  static async getDetail(id) {
    return request
      .table(TABLE_ID.BADMINTON_EVENT)
      .get(id)
  }

  /**
   * 创建事件
   * @param {Object} data 事件数据
   */
  static async create(data) {
    return request
      .table(TABLE_ID.BADMINTON_EVENT)
      .create(data)
  }

  /**
   * 更新事件
   * @param {String} id 事件ID
   * @param {Object} data 更新数据
   */
  static async update(id, data) {
    return request
      .table(TABLE_ID.BADMINTON_EVENT)
      .update(id, data)
  }

  /**
   * 删除事件
   * @param {String} id 事件ID
   */
  static async delete(id) {
    return request
      .table(TABLE_ID.BADMINTON_EVENT)
      .delete(id)
  }

  /**
   * 参与事件
   * @param {String} id 事件ID
   * @param {Object} userInfo 用户信息
   */
  static async join(id, userInfo) {
    const event = await this.getDetail(id)
    const participants = event.participants || []
    
    // 检查是否已经参与
    if (participants.some(participant => participant.id === userInfo.id)) {
      throw new Error('您已参与该事件')
    }

    // 添加新参与者
    participants.push(userInfo)

    return this.update(id, {
      participants,
      participant_count: participants.length
    })
  }

  /**
   * 退出事件
   * @param {String} id 事件ID
   * @param {String} userId 用户ID
   */
  static async quit(id, userId) {
    const event = await this.getDetail(id)
    const participants = event.participants || []
    
    // 过滤掉退出的参与者
    const newParticipants = participants.filter(participant => participant.id !== userId)

    if (participants.length === newParticipants.length) {
      throw new Error('您未参与该事件')
    }

    return this.update(id, {
      participants: newParticipants,
      participant_count: newParticipants.length
    })
  }
}

export default EventApi 