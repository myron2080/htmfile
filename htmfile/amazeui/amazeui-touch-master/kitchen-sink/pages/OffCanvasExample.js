import React from 'react';
import {
  Container,
  Group,
  Button,
  OffCanvas,
  OffCanvasTrigger,
  List,
} from 'amazeui-touch';

const OffCanvasExample = React.createClass({
  render() {
    return (
      <Container {...this.props}>
        <h2>Overlay</h2>

        <Group
          header="左侧显示 OffCanvas"
        >
          <OffCanvasTrigger
            offCanvas={<OffCanvas><p>OffCanvas 内容</p></OffCanvas>}
          >
            <Button amStyle="primary">显示左侧 Offcanvas</Button>
          </OffCanvasTrigger>
        </Group>

        <Group
          header="右侧显示 OffCanvas"
        >
          <OffCanvasTrigger
            placement="right"
            offCanvas={<OffCanvas><p>右侧边栏 OffCanvas 内容</p></OffCanvas>}
          >
            <Button amStyle="secondary">显示右侧 Offcanvas</Button>
          </OffCanvasTrigger>
        </Group>

        <h2>Push</h2>

        <Group
          header="右侧显示 OffCanvas"
        >
          <OffCanvasTrigger
            animation="push"
            pageContainer="#sk-root"
            offCanvas={<OffCanvas><p>OffCanvas 内容</p></OffCanvas>}
          >
            <Button amStyle="primary">显示左侧 Offcanvas</Button>
          </OffCanvasTrigger>
        </Group>

        <Group
          header="右侧显示 OffCanvas"
        >
          <OffCanvasTrigger
            animation="push"
            pageContainer="#sk-root"
            placement="right"
            offCanvas={<OffCanvas><p>右侧边栏 OffCanvas 内容</p></OffCanvas>}
          >
            <Button amStyle="secondary">显示右侧 Offcanvas</Button>
          </OffCanvasTrigger>
        </Group>
      </Container>
    );
  }
});

export default OffCanvasExample;
