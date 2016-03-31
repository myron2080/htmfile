# Form

表单相关组件。

## 组件

### Field

`<Field>` 组件，用于生成 `<input>` 元素。

#### Props

##### `type`

> PropType: `string`

输入框类型，可选值为：

- HTML `input` 元素的 [`type` 属性的值](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes)
- `'select'`
- `'textarea'`

##### `label`

> PropType: `node`

输入框标签。


##### `btnBefore`

> PropType: `node`

组建输入框组时输入框**前面**的按钮。


##### `btnAfter`

> PropType: `node`

组建输入框组时输入框**后面**的按钮。


##### `labelBefore`

> PropType: `node`

组建输入框组时输入框**前面**的文字。


##### `labelAfter`

> PropType: `node`

组建输入框组时输入框**后面**的文字。


#### 方法

##### `.getValue()`

返回输入框的值。

##### `.getChecked()`

返回输入框是否选中，当 `type` 为 `radio` 或 `checkbox` 时有效。


##### `.getSelectedOptions()`

返回 `<select>` 的值，`type` 为 `'select'` 时有效。

---

### Switch

`<Switch>` 组件，开关按钮。

#### Props

##### `name`

> PropType: `string`

`name` 属性应用到内部的 `input` 元素上，可用于传统的表单提交。

##### `onValueChange`

> PropType: `func`

Switch 值发生变化时处理函数。

#### Refs

##### `field`

指向 Switch 内部的 `input` 元素，可用于获取 Switch 状态。

```javascript
function handleSwitch() {
  console.log(this.refs.field.checked);
}

const mySwitch = <Switch onValueChange={handleSwitch} />;
```

## 示例
