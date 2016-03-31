import React from 'react';
import classNames from 'classnames';
import ClassNameMixin from './mixins/ClassNameMixin';

const Switch = React.createClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classPrefix: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    amStyle: React.PropTypes.string,
    onValueChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      classPrefix: 'switch',
      onValueChange: function() {},
    };
  },

  render() {
    let classSet = this.getClassSet();
    const {
      name,
      className,
      onValueChange,
      ...props
      } = this.props;

    return (
      <label
        {...props}
        className={classNames(classSet, className)}
      >
        <input
          onChange={onValueChange.bind(this)}
          name={name}
          type="checkbox"
          ref="field"
        />
        <span className={this.prefixClass('label')} />
      </label>
    );
  }
});

export default Switch;
