const fs = require('fs');
import React from 'react';
import {
  Doc,
  Markdown,
  Highlight,
} from '../_utils';

const NormalizeDoc = React.createClass({
  render() {
    return (
      <Doc>
        <Markdown>{require('./api.md')}</Markdown>
        <Highlight language="sass">
          {fs.readFileSync(`${__dirname}/../../src/scss/vendor/_normalize.scss`, 'utf-8')}
        </Highlight>
      </Doc>
    );
  }
});

export default NormalizeDoc;
