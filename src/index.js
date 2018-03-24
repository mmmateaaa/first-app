import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Form, Input, Container, Row, Col, ListGroup, ListGroupItem, Button, FormGroup, Label } from 'reactstrap';
import KeyQuotaEditor from './components/keyquota_editor';

class KeyQuota extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      newKeyQuotaName: [],
      selected: [],
      show: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({name: value});
  }

  handleKeyPress(event) {
    event.preventDefault();
    const newName = this.state.name;
    this.state.newKeyQuotaName.push(newName);
    this.setState({
      name: ''
    });
  }

  toggle(event) {
    this.setState({ show: event.target.name });
  }

  handleCheck(event) {
    const index = this.state.selected.indexOf(event.target.name);

    if (index < 0) {
      this.state.selected.push(event.target.name);
    } else {
      this.state.selected.splice(index, 1);
    }

    this.setState({
      selected: this.state.selected
    });

  }

  handleDelete(event) {
    const selected = this.state.selected;
    const keyQuotaName = this.state.newKeyQuotaName;
    for(let i = 0; i < selected.length; i++) {
      if(keyQuotaName.includes(selected[i])){
        let index = keyQuotaName.indexOf(selected[i])
        keyQuotaName.splice(index, 1);
      }
    }

    this.setState({
      newKeyQuotaName: keyQuotaName,
      selected:[]
    });
  }

  render() {
    return(
      <Container>
        <Row>
          <Col md="6">
            <Form onSubmit={this.handleKeyPress} className="name-input">
              <Input type="text" placeholder="New Key Quota" name="name" value={this.state.name} onChange={this.handleChange} required />
            </Form>
            <Button color="danger" onClick={this.handleDelete} className="keyquota-list-delete" outline>
              Delete
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <ListGroup>
              <ListGroupItem>Name</ListGroupItem>
                {this.state.newKeyQuotaName.map((newName, index) =>
                  <ListGroupItem key={index}>
                    <Form>
                      <FormGroup check inline>
                        <Label check>
                          <Input checked={this.state.selected.includes(newName)} type="checkbox" onChange={this.handleCheck} name={newName} />
                          <Button color="link" onClick={this.toggle} name={newName}>
                            {newName.toUpperCase()}
                          </Button>
                        </Label>
                      </FormGroup>
                    </Form>
                  </ListGroupItem>
                )}
            </ListGroup>
          </Col>
          <Col md="9">
            {this.state.newKeyQuotaName.map((newName, index) =>
              <div key={index}>
                {this.state.show.includes(newName) ? <KeyQuotaEditor value={newName} /> : null}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

ReactDOM.render(
  <KeyQuota />,
  document.getElementById('root')
);
