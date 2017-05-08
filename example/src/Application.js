import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import HelloWorld from './HelloWorld';
import nlMessages from './nlMessages';

class Application extends Component {
  render() {
    return (
      <IntlProvider locale="nl" messages={nlMessages}>
        <HelloWorld />
      </IntlProvider>
    );
  }
}

ReactDOM.render(Application, document.getElementById('app'));
