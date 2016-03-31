import React from 'react';
import classNames from 'classnames';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import ClassNameMixin from './mixins/ClassNameMixin';
import Icon from './Icon';

// @see https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html
// To improve reliability, CSSTransitionGroup will no longer listen to
// transition events. Instead, you should specify transition durations
// manually using props such as `transitionEnterTimeout={500}`.
// NOTE: It should less than CSS animation duration, if not, the animation
// be not smooth. It maybe a bug of React.
const TRANSITION_TIMEOUT = 250;

const Notification = React.createClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classPrefix: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    amStyle: React.PropTypes.string,
    closeBtn: React.PropTypes.bool,
    animated: React.PropTypes.bool,
    visible: React.PropTypes.bool,
    onDismiss: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      classPrefix: 'notification',
      closeBtn: true,
      onDismiss: () => {},
    };
  },

  renderCloseBtn() {
    return this.props.closeBtn ? (
      <Icon
        className={this.prefixClass('icon')}
        name="close"
        onClick={this.props.onDismiss}
      />
    ) : null;
  },

  render() {
    let classSet = this.getClassSet();
    let {
      title,
      className,
      animated,
      visible,
      ...props
      } = this.props;

    classSet[this.prefixClass('animated')] = animated;

    let notificationBar = visible ? (
      <div
        {...props}
        className={classNames(classSet, className)}
        key="notification"
      >
        <div className={this.prefixClass('content')}>
          {title ? (
            <h3 className={this.prefixClass('title')}>
              {title}
            </h3>
          ) : null}
          {this.props.children}
        </div>
        {this.renderCloseBtn()}
      </div>
    ) : null;

    return animated ? (
      <CSSTransitionGroup
        component="div"
        transitionName="notification"
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        {notificationBar}
      </CSSTransitionGroup>
    ) : notificationBar;
  }
});

export default Notification;
