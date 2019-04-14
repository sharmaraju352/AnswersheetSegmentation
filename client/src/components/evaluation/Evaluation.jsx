import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SERVER_URL } from '../../utils/config';
import axios from 'axios';
import SketchPad from '../SketchPad/SketchPad';
export default class Evaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: {
        1: ['S0123']
      },
      questionMarksMap: {
        1: 10
      },
      selectedQuestion: 1,
      selectedSeatNumber: '',
      givenMarks: '',
      modal: false
    };
  }
  componentDidMount() {
    axios
      .get('/api/segmentation/getAnswersheets')
      .then(res => {
        this.setState({ questions: res.data.questions });
      })
      .catch(err =>
        console.log('Error while fetching answersheets for evaluation')
      );

    axios
      .get('/api/segmentation/getQuestionMarksMap')
      .then(res => {
        this.setState({ questionMarksMap: res.data.questionMarksMap });
      })
      .catch(err =>
        console.log('Error while fetching answersheets for evaluation')
      );
  }
  toggleModal = seat_number => {
    this.setState({
      modal: !this.state.modal,
      selectedSeatNumber: seat_number
    });
  };
  submitMarks = () => {
    const { selectedQuestion, selectedSeatNumber, givenMarks } = this.state;
    this.toggleModal();
    axios
      .post(
        '/api/segmentation/evaluate/' +
          selectedQuestion +
          '/' +
          selectedSeatNumber +
          '/' +
          givenMarks
      )
      .then(res => {
        console.log('evaluation result: ', res.data);
      })
      .catch(err => console.log('Error while evaluating answersheet'));
  };
  onMarksChange = e => {
    const { questionMarksMap, selectedQuestion } = this.state;
    if (e.target.value) {
      if (parseInt(e.target.value) > questionMarksMap[selectedQuestion]) {
        this.setState({ givenMarks: '' });
        alert('Given marks cannot be greater than out of marks');
      } else {
        this.setState({ givenMarks: e.target.value });
      }
    } else {
      this.setState({ givenMarks: '' });
    }
  };
  render() {
    const {
      questions,
      selectedQuestion,
      selectedSeatNumber,
      questionMarksMap,
      givenMarks
    } = this.state;
    let content;
    content = (
      <div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggleModal}>
            Evaluate Question {selectedQuestion}
          </ModalHeader>
          <ModalBody>
            <SketchPad
              background={
                SERVER_URL +
                'api/segmentation/' +
                selectedSeatNumber +
                '/answer/' +
                selectedQuestion
              }
            />
          </ModalBody>
          <ModalFooter>
            <div className="row text-center">
              <div className="form-group col-sm-4">
                <label htmlFor="usr">Marks</label>
                <input
                  type="text"
                  name="givenMarks"
                  value={givenMarks}
                  onChange={this.onMarksChange}
                  className="form-control"
                />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="pwd">Out Of</label>
                <input
                  type="number"
                  className="form-control"
                  value={questionMarksMap[selectedQuestion]}
                  disabled
                />
              </div>
              <div className="form-group col-sm-4 rem-2">
                <input type="submit" onClick={this.submitMarks} />
              </div>
            </div>
          </ModalFooter>
        </Modal>
        <div className="container">
          <h3>Questions and answers</h3>
          <div className="master_detail">
            <div className="row">
              <div className="col-md-2 col-sm-12 col-xs-12">
                <div className="master_list">
                  <div className="list-group">
                    {Object.keys(questions).map((question, index) => (
                      <button
                        key={index}
                        type="button"
                        className="list-group-item"
                        onClick={() => {
                          this.setState({ selectedQuestion: question });
                        }}
                      >
                        Question {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-10 col-sm-12 col-xs-12">
                <div className="detail_list">
                  <article className="grow fadeIn">
                    <div className="container">
                      <div className="row">
                        {questions[selectedQuestion].map(
                          (seat_number, index) => (
                            <div className="column">
                              <a
                                className="thumbnail"
                                onClick={() => this.toggleModal(seat_number)}
                              >
                                <img
                                  key={index}
                                  className="img-thumbnail"
                                  height="250rem"
                                  width="250rem"
                                  src={
                                    SERVER_URL +
                                    'api/segmentation/' +
                                    seat_number +
                                    '/answer/' +
                                    selectedQuestion
                                  }
                                />
                              </a>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return <div>{content}</div>;
  }
}
