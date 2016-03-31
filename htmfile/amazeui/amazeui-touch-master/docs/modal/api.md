# Modal

Modal 组件，用于弹出内容，实现 alert、confirm、prompt、loading、actions、popup 等效果。

## 组件

### Modal

`<Modal>` 组件，渲染模态窗内容。

#### Props

##### `role`

> PropType: `enum('alert', 'confirm', 'prompt', 'loading',
                        'actions', 'popup')`

Modal 形式，不设置时为普通的模态窗口。

##### `title`

> PropType: `node`

Modal 标题。

##### `confirmText`

> PropType: `string`

确定按钮文字，默认为「确定」。

##### `cancelText`

> PropType: `string`

取消按钮文字，默认为「取消」。

##### `closeBtn`

> PropType: `bool`

是否显示关闭按钮，默认为 `true`。

##### `closeViaBackdrop`

> PropType: `bool`

点击遮罩层是否关闭 Modal。

##### `onSelect`

> PropType: `func`

用户点击「确定」或「取消」按钮时的处理函数。

##### `onOpen`

> PropType: `func`

Modal 打开时的回调函数。

##### `onClosed`

> PropType: `func`

Modal 关闭以后的回调函数。


#### 方法

调用方式见示例代码。

##### `.open()`

打开 Modal。

##### `.close()`

关闭 Modal。


## 示例
