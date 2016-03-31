/**
 * @see https://github.com/yuanyan/boron
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import ClassNameMixin from './mixins/ClassNameMixin';
import CSSCore from './utils/CSSCore';
import Events from './utils/Events';
import TransitionEvents from './utils/TransitionEvents';
import Button from './Button';
import Icon from './Icon';
import Loader from './Loader';

// MUST be equal to $modal-duration in _modal.scss
const TRANSITION_TIMEOUT = 300;

const Modal = React.createClass({
  mixins: [ClassNameMixin],

  propTypes: {
    classPrefix: React.PropTypes.string,
    role: React.PropTypes.oneOf(['alert', 'confirm', 'prompt', 'loading',
      'actions', 'popup']),
    title: React.PropTypes.node,
    confirmText: React.PropTypes.string,
    cancelText: React.PropTypes.string,
    closeBtn: React.PropTypes.bool,
    closeViaBackdrop: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    onOpen: React.PropTypes.func,
    onClosed: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      classPrefix: 'modal',
      confirmText: '确定',
      cancelText: '取消',
      closeBtn: true,
      onSelect: () => {
      },
      onOpen: () => {
      },
      onClosed: () => {
      },
    };
  },

  getInitialState() {
    return {
      closed: true,
      isClosing: false,
    };
  },

  isClosed() {
    return this.state.closed;
  },

  handleBackdropClick(e) {
    if (e.target !== e.currentTarget || !this.props.closeViaBackdrop) {
      return;
    }

    this.close();
  },

  isPopup() {
    return this.props.role === 'popup';
  },

  isActions() {
    return this.props.role === 'actions';
  },

  // Get input data for prompt modal
  getFieldData() {
    let data = [];
    let inputs = ReactDOM.findDOMNode(this)
      .querySelectorAll('input[type=text]');

    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        data.push(inputs[i].value);
      }
    }

    return (data.length === 0) ? null : ((data.length === 1) ? data[0] : data);
  },

  handleSelect(data, e) {
    if (this.props.role === 'prompt' && data) {
      data = this.getFieldData();
    }

    this.close();
    this.props.onSelect.call(this, data, e);
  },

  open() {
    if (this.isClosed()) {
      this.setState({
        isClosing: false,
        closed: false
      });

      this.props.onOpen();
    }
  },

  close() {
    if (this.isClosed() || this.state.isClosing) {
      return;
    }

    this.setState({
      isClosing: true
    });
  },

  handleClosed() {
    this.setState({
      closed: true,
      isClosing: false,
    });
    this.props.onClosed();
  },

  renderActions(classSet) {
    classSet[this.props.classPrefix] = false;

    return (
      <div
        className={classNames(this.props.className, classSet)}
        key="modalActions"
        ref="modal"
      >
        {this.props.children}
        <div className={this.prefixClass('actions-group')}>
          <Button
            onClick={this.close}
            block
            amStyle={this.props.btnStyle || 'secondary'}
          >
            {this.props.cancelText}
          </Button>
        </div>
      </div>
    );
  },

  renderPopup(classSet) {
    classSet[this.props.classPrefix] = false;

    let {
      className,
      title,
      children,
      ...props
      } = this.props;

    return (
      <div
        {...props}
        className={classNames(className, classSet, this.setClassNS('popup'))}
        key="modalPopup"
        ref="modal"
      >
        <div className={this.setClassNS('popup-inner')}>
          <div className={this.setClassNS('popup-header')}>
            {title ? (
              <h4 className={this.setClassNS('popup-title')}>
                {title}
              </h4>
            ) : null}
            <Icon
              name="close"
              className={this.setClassNS('popup-icon')}
              onClick={this.close}
            />
          </div>
          <div className={this.setClassNS('popup-body')}>
            {children}
          </div>
        </div>
      </div>
    );
  },

  renderHeader() {
    let {
      title,
      closeBtn,
      role
      } = this.props;
    let closeIcon = closeBtn && !role ? (
      <Icon
        name="close"
        className={this.prefixClass('icon')}
        onClick={this.close}
      />
    ) : null;

    return (title || closeIcon) ? (
      <div
        className={this.prefixClass('header')}
        key="modalHeader"
      >
        {title ? (
          <h4
            className={this.prefixClass('title')}
          >
            {title}
          </h4>) : null}
        {closeIcon}
      </div>) : null;
  },

  // Render alert/confirm/prompt buttons
  renderFooter() {
    let buttons;
    let btnClass = this.prefixClass('btn');
    let {
      role,
      confirmText,
      cancelText,
      } = this.props;

    switch (role) {
      case 'alert':
        buttons = (
          <span
            key="modalBtn"
            onClick={this.handleSelect.bind(this, null)}
            className={btnClass}
          >
            {confirmText}
          </span>);
        break;
      case 'confirm':
      case 'prompt':
        let cancel = (role === 'prompt') ? null : false;
        buttons = [cancelText, confirmText].map((text, i) => {
          return (
            <span
              key={'modalBtn' + i}
              onClick={this.handleSelect.bind(this, i === 0 ? cancel : true)}
              className={btnClass}
            >
              {text}
            </span>
          );
        });
        break;
      default:
        buttons = null;
    }

    return buttons ? (
      <div className={this.prefixClass('footer')}>
        {buttons}
      </div>
    ) : null;
  },

  // Using transition appear to fix animation issue on iOS Safari
  // @see https://github.com/amazeui/amazeui-touch/issues/11
  renderTransition(children) {
    return (
      <CSSTransitionGroup
        transitionName={this.prefixClass('transition')}
        transitionAppear={true}
        transitionAppearTimeout={TRANSITION_TIMEOUT}
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        {children}
      </CSSTransitionGroup>
    );
  },

  renderBackdrop(children) {
    const onClick = this.handleBackdropClick || null;
    const preventDefault = (e) => {
      // prevent window scroll when touch backdrop
      e.preventDefault();
    };

    let classSet = {};

    classSet[this.prefixClass('backdrop')] = true;
    classSet[this.setClassNS('active')] = true;
    classSet[this.prefixClass('backdrop-out')] = this.state.isClosing;

    return (
      <span>
        {children}
        <div
          className={classNames(classSet)}
          style={{height: window.innerHeight}}
          ref="backdrop"
          onClick={onClick}
          onTouchMove={preventDefault}
        ></div>
      </span>
    );
  },

  render() {
    let {
      closed,
      isClosing,
      } = this.state;

    if (closed) {
      return null;
    }

    // listen out animation end envent
    if (isClosing) {
      let node = this.refs.modal;

      if (node) {
        let closedHandler = (e) => {
          if (e && e.target !== node) {
            return;
          }

          TransitionEvents.off(node, closedHandler);
          this.handleClosed();
        };

        TransitionEvents.on(node, closedHandler);
      }
    }

    let classSet = this.getClassSet();
    let {
      role,
      className,
      title,
      children,
      modalWidth,
      modalHeight,
      ...props
      } = this.props;
    let modal;

    classSet[this.prefixClass('out')] = isClosing;
    role && (classSet[this.prefixClass(role)] = true);

    if (this.isActions()) {
      modal = this.renderTransition(this.renderActions(classSet));
    } else if (this.isPopup()) {
      modal = this.renderTransition(this.renderPopup(classSet));
    } else {
      let style = {
        width: modalWidth,
        height: modalHeight
      };

      modal = (
        <div
          {...props}
          style={style}
          ref="modalContainer"
          className={classNames(classSet, className)}
        >
          <div
            className="modal-inner"
            ref="modal"
          >
            <div
              className={this.prefixClass('dialog')}
            >
              {this.renderHeader()}
              <div
                className={this.prefixClass('body')}
                ref="modalBody"
              >
                {role === 'loading' ?
                  (children ? children : <Loader />) :
                  children}
              </div>
              {this.renderFooter()}
            </div>
          </div>
        </div>
      );
    }

    return this.renderBackdrop(modal);
  }
});

export default Modal;
