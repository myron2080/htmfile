import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Overlay Mixin
 *
 * @desc `overlay` is something like Popover, OffCavans, etc.
 */

export default {
  propTypes: {
    container: React.PropTypes.node
  },

  componentDidMount() {
    this._renderOverlay();
  },

  componentDidUpdate() {
    this._renderOverlay();
  },

  // Remove Overlay related DOM node
  componentWillUnmount() {
    this._unmountOverlay();

    if (this._overlayWrapper) {
      this.getContainerDOMNode().removeChild(this._overlayWrapper);
      this._overlayWrapper = null;
    }
  },

  // Create Overlay wrapper
  _mountOverlayWrapper() {
    this._overlayWrapper = document.createElement('div');
    this.getContainerDOMNode().appendChild(this._overlayWrapper);
  },

  // Render Overlay to wrapper
  _renderOverlay() {
    if (!this._overlayWrapper) {
      this._mountOverlayWrapper();
    }

    let overlay = this.renderOverlay();

    if (overlay !== null) {
      this._overlayInstance = ReactDOM.render(overlay, this._overlayWrapper);
    } else {
      // Unmount if the component is null for transitions to null
      this._unmountOverlay();
    }
  },

  // Remove a mounted Overlay from wrapper
  _unmountOverlay() {
    ReactDOM.unmountComponentAtNode(this._overlayWrapper);
    this._overlayInstance = null;
  },

  getOverlayDOMNode() {
    if (!this.isMounted()) {
      throw new Error(
        `getOverlayDOMNode(): A component must be mounted to
        have a DOM node.`);
    }

    if (this._overlayInstance) {
      // 包含 backdrop 时通过 refer 返回 overlay DOM 节点
      return ReactDOM.findDOMNode(this._overlayInstance.refs &&
        this._overlayInstance.refs.overlay || this._overlayInstance);
    }

    return null;
  },

  getContainerDOMNode() {
    return ReactDOM.findDOMNode(this.props.container) || document.body;
  }
};
