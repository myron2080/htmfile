import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';

const Index = React.createClass({
  getDefaultProps() {
    return {
      transition: 'rfr',
    };
  },

  renderItems() {
    const pages = [
      'Page1',
      'Page2',
    ];

    return pages.map((item, index) => {
      return (
        <List.Item
          linkComponent={Link}
          linkProps={{to: `/${item.toLowerCase()}`}}
          title={item}
          key={index}
        />
      );
    });
  },

  render() {
    return (
      <View>
        <NavBar
          amStyle="primary"
          title="AMT Starter Kit"
        />
        <Container scrollable>
          <Group
            header="Welcome to AMT."
            noPadded
          >
            <List>
              {this.renderItems()}
            </List>
          </Group>
        </Container>
      </View>
    );
  },
});

export default Index;
