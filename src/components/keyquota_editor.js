import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form, Label, Input, Container, Row, Col, Table, Button, Alert } from 'reactstrap';
//import KeyQuotaList from '../components/keyquota_list';

const annoucmentList = [
  'Anno 1',
  'Anno 3',
  'BusyAnno',
  'Overflow',
  'NoAnswerAnno'
];

const destinationType = [
  'Annoucment',
  'Public Directory Number',
  'Direct Dialed Destination',
  'SIP Destination',
  'Logical Destination',
  'Key Quota',
  'Percetange Distribution'
];

export default class KeyQuotaEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: '',
      to: '',
      destinationType: 'Annoucment',
      annoucment: true,
      destination: 'Anno 1',
      keyQuotaList: [],
      visible: false,
      value: this.props.value
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.save = this.save.bind(this);
    this.change = this.change.bind(this);
  }

  change(value) {
    if(value !== 'Annoucment') {
      this.setState({
        annoucment: false,
        destination: ''
      });
    } else this.setState({
      annoucment: true,
      destination: 'Anno 1'
     });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    if(name === "from") {
      this.setState({from: value});
    } else if(name === "to") {
      this.setState({to: value});
    } else if(name === "destinationType") {
      this.setState({destinationType: value});
      this.change(value);
    } else if(name === "destination" || "annoucmentList") {
      this.setState({destination: value});
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if(this.state.from <= this.state.to) {
      this.setState({
        keyQuotaList: this.state.keyQuotaList.concat({
          from: parseInt(this.state.from, 10),
          to: parseInt(this.state.to, 10),
          destinationType: this.state.destinationType,
          destination: this.state.destination
        }),
        from: parseInt(this.state.to, 10) + 1,
        to: parseInt(this.state.to, 10) + 1,
        destinationType: this.state.destinationType,
        destination: this.state.destination
      })
    }
  }

  handleDelete(event) {
    const keyQuotaList = this.state.keyQuotaList;
    for(let i = 0; i < keyQuotaList.length; i++) {
      var name = parseInt(event.target.name, 10);
      if(keyQuotaList[i].from === name) {
        keyQuotaList.splice(i, 1);
        this.setState({keyQuotaList: keyQuotaList});
      }
    }
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  save(event) {
    var keyQuotaList = this.state.keyQuotaList;
    var XMLWriter = require('xml-writer');
    var x = new XMLWriter(true);

    x.startDocument();
      x.startElement('MgtFeatures');
        x.startElement('MgtFeatureSequenceDistribution').writeAttribute('FeatureName', this.state.value).writeAttribute('ResetSpecification', 9);
        for(let i = 0; i < keyQuotaList.length; i++) {
          x.startElement('SequenceQuota').writeAttribute('SequenceFrom', this.state.keyQuotaList[i].from).writeAttribute('SequenceTo', this.state.keyQuotaList[i].to);
            x.startElement('EndFeatureDirectDestination').writeAttribute('DestinationType', this.state.keyQuotaList[i].destinationType).writeAttribute('Destination', this.state.keyQuotaList[i].destination).endElement();
          x.endElement();
        }
    x.endDocument();

    for(let i = 0; i < keyQuotaList.length-1; i++) {
      if((keyQuotaList[0].from !== 1)
        || (keyQuotaList[i].from > keyQuotaList[i+1].from)
        || (keyQuotaList[i].to > keyQuotaList[i+1].to)
        || ((keyQuotaList[i+1].from - keyQuotaList[i].to) !== 1)) {
          this.setState({ visible: true });
          return;
      } else this.setState({ visible: false });
    }

    console.log(x.toString());

  }

  render() {
    return (
      <Container>
        <div>
          <h1 className="inline">{this.state.value.toUpperCase()}</h1>
          <Button className="float-right" size="sm" onClick={this.save}>Save</Button>
        </div>
        <Row>
          <Col md="3">
            <Form onSubmit={this.handleSubmit}>
              <Label for="from">From:</Label>
              <Input type="number" name="from" value={this.state.from} onChange={this.handleChange} required />

              <Label for="to">To:</Label>
              <Input type="number" name="to" value={this.state.to} onChange={this.handleChange} required />

              <Label for="destinationType">Destination Type:</Label>
              <Input type="select" name="destinationType" value={this.state.destinationType} onChange={this.handleChange}>
                {destinationType.map((destType, index) =>
                  <option key={index}>{destType}</option>
                )}
              </Input>

              <Label for="destination">Destination:</Label>
              {this.state.annoucment ? (
                  <Input type="select" name="annoucmentList" value={this.state.destination} onChange={this.handleChange}>
                    {annoucmentList.map((annList, index) =>
                      <option key={index}>{annList}</option>
                    )}
                  </Input>
                ) : (
                  <Input type="text" name="destination" value={this.state.destination} onChange={this.handleChange} required />
                )
              }

              <Label />
              <Input type="submit" value="Add" />
            </Form>
          </Col>
          <Col md="9">
            <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
              Your values are not valid. Please check them!
            </Alert>
            <Table bordered>
              <thead>
                <tr>
                  <th>From:</th>
                  <th>To:</th>
                  <th>Destination type:</th>
                  <th>Destination:</th>
                </tr>
              </thead>
              <tbody>
              {this.state.keyQuotaList.map((keyQuota, index) =>
                <tr key={index}>
                  <td>{keyQuota.from}</td>
                  <td>{keyQuota.to}</td>
                  <td>{keyQuota.destinationType}</td>
                  <td>{keyQuota.destination}</td>
                  <td><Button size="sm" name={keyQuota.from} onClick={this.handleUpdate} color="danger" outline>Update</Button></td>
                  <td><Button size="sm" name={keyQuota.from} onClick={this.handleDelete} color="danger" outline>Delete</Button></td>
                </tr>
              )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}
