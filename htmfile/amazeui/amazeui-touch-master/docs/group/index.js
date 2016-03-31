const fs = require('fs');
import React from 'react';
import {
  Doc,
  Markdown,
  Highlight,
} from '../_utils';

const GroupDoc = React.createClass({
  render() {
    return (
      <Doc>
        <Markdown>{require('./api.md')}</Markdown>
      </Doc>
    );
  }
});

export default GroupDoc;
