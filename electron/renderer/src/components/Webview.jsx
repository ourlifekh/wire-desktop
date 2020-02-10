/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import './Webview.css';

import React, {Component} from 'react';

import * as EVENT_TYPE from '../lib/eventType';

export default class Webview extends Component {
  constructor(props) {
    super(props);

    this.isHidden = false;
    window.addEventListener(EVENT_TYPE.PREFERENCES.SET_HIDDEN, () => (this.isHidden = true), false);
  }

  componentDidMount() {
    const {src, partition} = this.props;

    // set unknown props
    // see: https://facebook.github.io/react/warnings/unknown-prop.html
    // see: https://github.com/electron/electron/issues/6046
    this.webview.partition = partition ? `persist:${partition}` : '';
    this.webview.src = src;

    this.webview.addEventListener('ipc-message', this._onIpcMessage);
    this.webview.addEventListener('dom-ready', () => {
      if (!this.isHidden) {
        this.focusWebviewIfVisible();
      }
    });
  }

  componentDidUpdate() {
    this.focusWebviewIfVisible();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible !== nextProps.visible;
  }

  _onIpcMessage = event => {
    this.props.onIpcMessage(event);
  };

  focusWebviewIfVisible() {
    if (this.webview) {
      if (this.props.visible) {
        this.webview.focus();
      } else {
        this.webview.blur();
      }
    }
  }

  render() {
    const {visible, partition, src, onPageTitleUpdated, onIpcMessage, ...validProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <webview
        {...validProps}
        style={{display: visible ? 'flex' : 'none', pointerEvents: visible ? 'auto' : 'none'}}
        ref={webview => (this.webview = webview)}
      />
    );
  }
}
