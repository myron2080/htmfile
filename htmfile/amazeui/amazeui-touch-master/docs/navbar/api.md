# NavBar

导航条组件。

## 组件

### NavBar

`<NavBar>` 组件。

#### Props

##### `title`

> PropType: `node`

NavBar 主标题。

##### `leftNav`

> PropType: `array`

左侧链接数据，格式为：

```javascript
const leftNav = [
  {
    component: 'a', // 默认为 `a`
    title: 'Left',
    href: '',
    props: {
    }, // 其他要传递的属性
  },
];
```

##### `rightNav`

> PropType: `array`

右侧链接数据，格式同上。


##### `titleOnLeft`

> PropType: `bool`

主标题是否居左，默认居中。

##### `onSelect`

> PropType: `func`

链接点击时的处理函数，第一个参数为链接数据对象。


## 示例
