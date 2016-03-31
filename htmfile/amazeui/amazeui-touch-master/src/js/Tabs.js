import React from 'react';
import classNames from 'classnames';
import ClassNameMixin from './mixins/ClassNameMixin';
import Button from './Button';
import ButtonGroup from './ButtonGroup';

const Tabs = React.createClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classPrefix: React.PropTypes.string,
    defaultActiveKey: React.PropTypes.any,
    onSelect: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      classPrefix: 'tabs',
    };
  },

  getInitialState() {
    let defaultActiveKey = this.props.defaultActiveKey != null ?
      this.props.defaultActiveKey :
      this.getDefaultActiveKey(this.props.children);

    return {
      activeKey: defaultActiveKey,
      previousActiveKey: null
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey != null &&
      nextProps.activeKey !== this.props.activeKey) {
      this.setState({
        previousActiveKey: this.props.activeKey
      });
    }
  },

  getDefaultActiveKey(children) {
    let defaultActiveKey = null;

    React.Children.forEach(children, function(child) {
      if (defaultActiveKey == null) {
        defaultActiveKey = child.props.eventKey;
      }
    });

    return defaultActiveKey !== undefined ? defaultActiveKey : 0;
  },

  handleClick(key, disabled, e) {
    e.preventDefault();
    let activeKey = this.state.activeKey;

    if (disabled) {
      return null;
    }

    if (this.props.onSelect) {
      this.props.onSelect(key);
    }

    if (activeKey !== key) {
      this.setState({
        activeKey: key,
        previousActiveKey: activeKey
      });
    }
  },

  renderNav() {
    let activeKey = this.state.activeKey;

    let navs = React.Children.map(this.props.children, (child, index) => {
      let {
        eventKey,
        key,
        disabled,
        navSize,
        navStyle,
        } = child.props;

      eventKey = eventKey !== undefined ? eventKey : index;
      key = key === undefined ? index : key;
      let active = eventKey === activeKey;

      return (
        <Button
          ref={'tabNav' + key}
          key={key}
          onClick={this.handleClick.bind(this, key, disabled)}
          active={active}
          disabled={disabled}
          className={active ? 'active' : null}
          amSize={navSize || 'sm'}
          amStyle={navStyle || 'primary'}
          hollow
        >
          {child.props.title}
        </Button>
      );
    });

    return (
      <ButtonGroup
        className={this.prefixClass('nav')}
        justify
      >
        {navs}
      </ButtonGroup>
    )
  },

  renderTabPanels() {
    let activeKey = this.state.activeKey;
    let panels = React.Children.map(this.props.children, (child, index) => {
      let {
        key,
        eventKey,
        children
        } = child.props;

      if (eventKey === undefined) {
        eventKey = index;
      }

      return (
        <Tabs.Item
          active={eventKey === activeKey}
          enventKey={eventKey}
          key={key ? key : 'tabPanel' + index}
        >
          {children}
        </Tabs.Item>
      );
    });

    return (
      <div
        className={this.prefixClass('body')}
      >
        {panels}
      </div>
    );
  },

  render() {
    let classSet = this.getClassSet();
    let {
      className,
      ...props
      } = this.props;

    return (
      <div
        {...props}
        className={classNames(classSet, className)}
      >
        {this.renderNav()}
        {this.renderTabPanels()}
      </div>
    );
  }
});

Tabs.Item = React.createClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classPrefix: React.PropTypes.string,
    title: React.PropTypes.node,
    eventKey: React.PropTypes.any,
    disabled: React.PropTypes.bool,
    active: React.PropTypes.bool,
    navSize: React.PropTypes.string,
    navStyle: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      classPrefix: 'tab',
    };
  },

  render() {
    let classSet = this.getClassSet(true);
    let {
      className,
      children,
      ...props
      } = this.props;

    classSet[this.prefixClass('panel')] = true;

    return (
      <div
        {...props}
        className={classNames(classSet, className)}
      >
        {children}
      </div>
    );
  }
});

export default Tabs;
