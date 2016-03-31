import React from 'react';
import {
  Container,
  Group,
  Button,
  Modal,
  Field,
  List,
} from 'amazeui-touch';

const ModalExample = React.createClass({
  open() {
    this.refs.modal.open();
  },

  close() {
    this.refs.modal.close();
  },

  handleSelect(data) {
    let role = this.refs.modal.props.role;

    // 确定和取消放在一起处理
    // data 为 true 时为 `确定`
    if (role === 'confirm') {
      console.log('你的选择是：「' + (data ? '确定' : '取消')  + '」')
    } else if (role === 'prompt') {
      console.log('输入的数据是：' + data);
    }
  },

  render() {
    return (
      <div>
        <Button
          amStyle='primary'
          onClick={this.open}
        >
          {this.props.title}
        </Button>

        {React.cloneElement(React.Children.only(this.props.children), {
          ref: 'modal',
          onSelect: this.handleSelect
        })}
      </div>
    );
  }
});

const ModalExamples = React.createClass({
  render() {
    return (
      <Container {...this.props}>
        <Group
          header="默认 Modal"
        >
          <ModalExample title="普通 Modal">
            <Modal
              title="Modal 标题"
            >
              Modal 内容
            </Modal>
          </ModalExample>
        </Group>

        <Group
          header="Alert"
        >
          <ModalExample
            title="Alert Modal"
          >
            <Modal
              role="alert"
              title="Amaze UI"
            >
              这一个 Alert 窗口。
            </Modal>
          </ModalExample>
        </Group>

        <Group
          header="Confirm"
        >
          <ModalExample
            title="Confirm Modal"
          >
            <Modal
              role="confirm"
              title="Amaze UI"
            >
              这一个 Confirm 窗口。
            </Modal>
          </ModalExample>
        </Group>

        <Group
          header="Prompt"
        >
          <ModalExample
            title="Prompt Modal"
          >
            <Modal
              role="prompt"
              title="Amaze UI"
            >
              输入你的 IQ 卡密码：
              <Field placeholder="把 IQ 卡密码交出来" />
            </Modal>
          </ModalExample>
        </Group>

        <Group
          header="多个输入框"
        >
          <ModalExample
            title="Prompt Modal"
          >
            <Modal
              role="prompt"
              title="Login"
            >
              <div className="form-set">
                <Field placeholder="Name." />
                <Field placeholder="Password." />
              </div>
            </Modal>
          </ModalExample>
        </Group>

        <Group
          header="Loading"
        >
          <ModalExample
            title="Loading Modal"
          >
            <Modal
              title="使劲加载中..."
              role="loading"
            />
          </ModalExample>
        </Group>

        <Group
          header="Actions"
        >
          <ModalExample
            title="Actions Modal"
          >
            <Modal
              role="actions"
            >
              <div className="modal-actions-group">
                <List>
                  <List.Item className="modal-actions-header">分享到</List.Item>
                  <List.Item>微信</List.Item>
                  <List.Item className="modal-actions-alert"> Twitter</List.Item>
                </List>
              </div>
            </Modal>
          </ModalExample>
        </Group>

        <Group
          header="Popup"
        >
          <ModalExample title="Popup Modal">
            <Modal role="popup" title="爱过什么女爵的滋味">
              <p>为你封了国境<br/>为你赦了罪<br/>为你撤了历史记载<br/>为你涂了装扮<br/>为你喝了醉<br/>为你建了城池围墙<br/>一颗热的心穿着冰冷外衣<br/>一张白的脸漆上多少褪色的情节<br/>在我的空虚身体里面<br/>爱上哪个肤浅的王位<br/>在你的空虚宝座里面<br/>爱过什麽女爵的滋味<br/>为你封了国境</p><p>为你赦了罪<br/>为你撤了历史记载<br/>一颗热的心<br/>穿着冰冷外衣<br/>一张白的脸<br/>漆上多少褪色的情节<br/>在我的空虚身体里面<br/>爱上哪个肤浅的王位<br/>在你的空虚宝座里面<br/>爱过什麽女爵的滋味<br/>在我的空虚身体里面<br/>爱上哪个肤浅的王位<br/>在你的空虚宝座里面<br/>爱过什麽女爵的滋味</p>
            </Modal>
          </ModalExample>
        </Group>
      </Container>
    );
  }
});

export default ModalExamples;
