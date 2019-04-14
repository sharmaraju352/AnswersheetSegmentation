import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  uploadAnswerSheet,
  clearQuestions
} from '../../actions/segmentationActions';
import InputGroup from '../common/InputGroup';
import Spinner from '../common/Spinner';
import { SERVER_URL } from '../../utils/config';

class Segmentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seat_number: '',
      selectedFile: null,
      errors: {},
      selectedQuestion: 1,
      modal: false
    };
  }
  componentDidMount() {
    console.log('componentDidMount called');
    this.props.clearQuestions();
  }
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  onFileSelect = e => {
    this.setState({
      selectedFile: e.target.files[0],
      loaded: 0
    });
  };
  onSubmit = e => {
    e.preventDefault();

    const data = new FormData();
    data.append('seat_number', this.state.seat_number);
    data.append('file', this.state.selectedFile, this.state.selectedFile.name);
    this.props.uploadAnswerSheet(data);
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { errors, seat_number, selectedQuestion } = this.state;
    const { file_uploaded, loading, questions } = this.props.segmentation;

    let content;
    if (loading) {
      content = <Spinner />;
    } else {
      content = (
        <form onSubmit={this.onSubmit}>
          <InputGroup
            placeholder="Student seat number"
            name="seat_number"
            icon="fa fa-user"
            value={seat_number}
            onChange={this.onChange}
            error={errors.seat_number}
          />
          <input
            id="file"
            type="file"
            name="selectedFile"
            onChange={this.onFileSelect}
            accept="application/pdf"
          />
          <div> {Math.round(file_uploaded, 2)} %</div>
          <input
            type="submit"
            value="Submit"
            className="btn btn-info btn-block mt-4"
          />
        </form>
      );
    }

    return <div>{content}</div>;
  }
}

Segmentation.propTypes = {
  uploadAnswerSheet: PropTypes.func.isRequired,
  clearQuestions: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  segmentation: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  segmentation: state.segmentation
});

export default connect(
  mapStateToProps,
  { uploadAnswerSheet, clearQuestions }
)(Segmentation);
