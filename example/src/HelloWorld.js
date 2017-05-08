import React, { Component } from 'react';
import { intlShape, defineMessages } from 'react-intl';

const t = defineMessages({
  helloWorld: {
    id: 'hello_world',
    description: 'A greeting to the world',
    defaultMessage: 'Hello {name}'
  },
  name: {
    id: 'hello_name',
    description: 'Name input field placeholder',
    defaultMessage: 'Your name'
  }
});

class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  onNameChange(newName) {
    this.setState({ name: newName });
  }

  render() {
    const { formatMessage } = this.context.intl;

    return (
      <div>
        {formatMessage(t.helloWorld, { name: this.state.name })}
        <input
          type="text"
          onChange={e => this.onNameChange(e.target.value)}
          placeholder={formatMessage(t.name)}
        />
      </div>
    );
  }
}

HelloWorld.contextTypes = { intl: intlShape };

export default HelloWorld;
