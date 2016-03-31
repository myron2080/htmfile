import React from 'react';
import classNames from 'classnames';
import ClassNameMixin from './mixins/ClassNameMixin';
import Icon from './Icon';

const NavBar = React.createClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classPrefix: React.PropTypes.string,
    title: React.PropTypes.node,
    leftNav: React.PropTypes.array,
    rightNav: React.PropTypes.array,
    titleOnLeft: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      classPrefix: 'navbar',
      onSelect: () => {},
    };
  },

  renderTitle() {
    let {
      titleOnLeft,
      title,
      } = this.props;
    let titlePosition = this.prefixClass(titleOnLeft ? 'left' : 'center');

    return title ? (
      <h2
        className={classNames(this.prefixClass('title'), titlePosition)}
      >
        {title}
      </h2>
    ) : this.props.children;
  },

  renderNav(position) {
    let nav = this.props[position + 'Nav'];

    return nav && Array.isArray(nav) ? (
      <div
        className={classNames(this.prefixClass('nav'),
        this.prefixClass(position))}
      >
        {nav.map(this.renderNavItem)}
      </div>
    ) : null;
  },

  renderNavItem(item, index) {
    let Component = item.component || 'a';
    let itemProps = item.props || {};
    let navTitle = item.title ? (
      <span
        className={this.prefixClass('nav-title')}
        key='title'
      >
        {item.title}
      </span>
    ) : null;
    let navIconKey = 'icon';
    let navIcon = item.customIcon ? (
      <img
        src={item.customIcon}
        className={this.prefixClass('icon')}
        alt={item.title || null}
        key={navIconKey}
      />
    ) : item.icon ? (
      <Icon
        className={this.prefixClass('icon')}
        name={item.icon}
        key={navIconKey}
      />
    ) : null;

    return (
      <Component
        href={item.href}
        key={'navbarNavItem' + index}
        onClick={this.props.onSelect.bind(this, item)}
        {...itemProps}
        className={classNames(this.prefixClass('nav-item'), itemProps.className)}
      >
        {[navTitle, navIcon]}
      </Component>
    );
  },

  render() {
    let classSet = this.getClassSet();
    let {
      title,
      className,
      ...props
      } = this.props;

    return (
      <header
        {...props}
        className={classNames(classSet, className)}
      >
        {this.renderTitle()}
        {this.renderNav('left')}
        {this.renderNav('right')}
      </header>
    );
  }
});

export default NavBar;
