import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Table, Button } from 'reactstrap';

export default class KeyQuotaList extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      text: '',
      isEditing: false
    };

    this.onClickEdit = this.onClickEdit.bind(this);
    this.onSaveEdit = this.onSaveEdit.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);
  }

  onClickEdit() {
    this.setState({ isEditing: !this.state.isEditing });
  }

  onSaveEdit() {
    this.setState({
      text: this.state.text,
      isEditing: false
    });
  }

  onTextChanged(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    return(
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
        {this.props.keyQuotaList.map((keyQuota, index) =>
          <tr key={index}>
            <td>{keyQuota.from}
              /*{this.state.isEditing ? '' : <span>{keyQuota.from}</span>}
              {this.state.isEditing ? <span><input value={keyQuota.from} onChange={this.onTextChanged} /></span> : '' }
              {this.state.isEditing ? '' : <button onClick={this.onClickEdit}>Edit</button>}
            <button onClick={this.onSaveEdit}>Save</button>*/
            </td>
            <td>{keyQuota.to}</td>
            <td>{keyQuota.destinationType}</td>
            <td>{keyQuota.destination}</td>
            <td><Button size="sm" name={keyQuota.from} onClick={this.props.handleDelete} color="danger" outline>Delete</Button></td>
          </tr>
        )}
        </tbody>
      </Table>
    );
  }
}
