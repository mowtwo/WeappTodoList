Page({
  data: {
    todoList: [],
  },
  checkedHandle({ target = {} }) {
    const { dataset = {} } = target
    const { index, checked } = dataset
    const that = this
    if (index != null) {
      const tempList = this.data.todoList
      if (tempList[index]) {
        tempList[index].finished = !checked
        this.setData({
          todoList: tempList
        }, () => {
          wx.setStorage({
            key: 'todoList',
            data: that.data.todoList
          })
        })
      }
    }
  },
  removeHandle({ target = {} }) {
    const { dataset = {} } = target
    const { index } = dataset
    if (index != null) {
      const tempList = this.data.todoList
      if (tempList[index]) {
        const that = this
        wx.showModal({
          title: "确定删除？",
          content: "删除的内容将无法恢复",
          success(res) {
            if (res.confirm) {
              tempList.splice(index, 1)
              that.setData({
                todoList: tempList
              }, () => {
                wx.setStorage({
                  key: 'todoList',
                  data: that.data.todoList
                })
              })
            }
          }
        })
      }
    }
  },
  editHandle({ target = {} }) {
    const { dataset = {} } = target
    const { index } = dataset
    if (index != null) {
      const tempList = this.data.todoList
      if (tempList[index]) {
        wx.navigateTo({
          url: `../create/create?mode=edit&index=${index}`,
        })
      }
    }
  },
  toCreate() {
    wx.navigateTo({
      url: '../create/create',
    })
  },
  onShow() {
    const that = this
    wx.getStorage({
      key: 'todoList',
      success(res) {
        that.setData({
          todoList: res.data
        })
      },
      fail() {
        wx.setStorage({
          key: 'todoList',
          data: []
        })
      }
    })
  },
})
