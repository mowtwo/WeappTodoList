Page({
    data: {
        title: "",
        content: "",
        saveTodoList: [],
        picturePreviewList: [],
        maxChooseImageCount: 3,
        mode: 'create',
        time: null,
        saveIndex: -1,
    },
    titleInputHandle(e) {
        this.setData({
            title: e.detail.value
        })
    },
    contentInputHandle(e) {
        this.setData({
            content: e.detail.value
        })
    },
    saveHandle() {
        const { saveTodoList, title, content, picturePreviewList, mode, saveIndex } = this.data
        if (mode == 'create') {
            saveTodoList.push({
                title, content,
                time: new Date(),
                finished: false,
                picture: picturePreviewList
            })
        } else {
            if (saveIndex >= 0) {
                saveTodoList[saveIndex] = {
                    ...(saveTodoList?.[saveIndex] ?? { finished: false, time: new Date() }),
                    title, content,
                    picture: picturePreviewList
                }
            }
        }
        wx.setStorage({
            key: 'todoList',
            data: saveTodoList,
            complete() {
                wx.navigateBack({
                    delta: -1,
                })
            }
        })
    },
    chooseImageHandle() {
        const that = this
        const { picturePreviewList } = this.data
        wx.chooseImage({
            count: this.data.maxChooseImageCount - this.data.picturePreviewList.length0,
            success(res) {
                picturePreviewList.push(...res.tempFilePaths)
                that.setData({
                    picturePreviewList
                })
            }
        })
    },
    pressRemoveHandle({ currentTarget: target = {} }) {
        const { dataset = {} } = target
        const { index } = dataset
        const that = this
        if (this.data.picturePreviewList[index]) {
            const tempList = this.data.picturePreviewList
            wx.showModal({
                title: '是否删除图片?',
                success(res) {
                    if (res.confirm) {
                        tempList.splice(index, 1)
                        that.setData({
                            picturePreviewList: tempList
                        })
                    }
                }
            })
        }
    },
    previewHandle({ currentTarget: target = {} }) {
        const { dataset = {} } = target
        const { src } = dataset
        if (src) {
            wx.previewImage({
                current: src,
                urls: this.data.picturePreviewList,
            })
        }
    },
    onShow() {
        const that = this
        wx.getStorage({
            key: 'todoList',
            success(res) {
                that.setData({
                    saveTodoList: res.data
                })
            },
            fail() {
                wx.setStorage({
                    key: 'todoList',
                    data: []
                })
                that.setData({
                    saveTodoList: []
                })
            }
        })
    },
    onLoad({ mode = 'create', index }) {
        const that = this
        if (mode == 'edit') {
            wx.setNavigationBarTitle({
                title:'编辑事项'
            })
            wx.getStorage({
                key: 'todoList',
                success(res) {
                    const item = res.data[index]

                    if (!item) {
                        wx.showToast({
                            title: '要编辑的事项不存在',
                            complete() {
                                wx.navigateBack({
                                    delta: -1,
                                })
                            }
                        })
                    } else {
                        const { title, content, time, picture: picturePreviewList } = item
                        that.setData({
                            title, content, time, picturePreviewList, mode, saveIndex: index
                        })
                    }
                },
                fail() {
                    wx.showToast({
                        title: '要编辑的事项不存在',
                        complete() {
                            wx.navigateBack({
                                delta: -1,
                            })
                        }
                    })
                }
            })
        } else {
            this.setData({
                title: '',
                content: '',
                time: null,
                picturePreviewList: [],
                mode
            })
        }
    }
})