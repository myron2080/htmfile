# Icon

图标组件，目前使用 [Ratchet](https://github.com/twbs/ratchet/tree/master/fonts) 的字体图标，包含 40 个常用图标。

## 组件

### Icon

`<Icon>` 组件。

#### Props

##### `component`

> PropType: `node`

组件使用的元素，默认为 `span`。

##### `name`

> PropType: `enum('back', 'bars', 'caret', 'check', 'close', 'code', 'compose', 'download', 'edit', 'forward', 'gear', 'home', 'info', 'list', 'more-vertical', 'more', 'pages', 'pause', 'person', 'play', 'plus', 'refresh', 'search', 'share', 'sound', 'sound2', 'sound3', 'sound4', 'star-filled', 'star', 'stop', 'trash', 'up-nav', 'up', 'right-nav', 'right', 'down-nav', 'down', 'left-nav', 'left')`

图标名称。


##### `href`

> PropType: `string`

如果设置 `href` 属性将忽略 `component` 属性，渲染为 `<a>`。


## 示例
