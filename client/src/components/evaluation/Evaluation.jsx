import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SERVER_URL } from '../../utils/config';
import axios from 'axios';
import SketchPad from '../SketchPad/SketchPad';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
class Evaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: {
        S0124: ['1_1', '1_2']
      },
      questionMarksMap: {
        1: 10
      },
      selectedSeatNumber: '',
      selectedOccurance: '',
      givenMarks: '',
      modal: false,
      questionNumberToShow: ''
    };
  }
  componentDidMount() {
    const questionNumberToShow = this.props.auth.user.name.charAt(7);
    let questionsObject = {};
    let seat_number;
    axios
      .get('/api/segmentation/getAnswersheets')
      .then(res => {
        const questions = res.data.questions;
        console.log('result from API: ', questions);
        for (var key in questions) {
          if (questions.hasOwnProperty(key)) {
            for (var i = 0; i < questions[key].length; i++) {
              const q = questions[key][i].split('_')[0];
              if (q === questionNumberToShow) {
                if (questionsObject.hasOwnProperty(key)) {
                  if (questionsObject[key].indexOf(questions[key][i]) === -1) {
                    questionsObject[key].push(questions[key][i]);
                  }
                } else {
                  questionsObject[key] = [questions[key][i]];
                  if (!seat_number) {
                    seat_number = key;
                  }
                }
              }
            }
          }
        }
        console.log('processing result: ', questionsObject);
      })
      .catch(err =>
        console.log('Error while fetching answersheets for evaluation')
      );

    axios
      .get('/api/segmentation/getQuestionMarksMap')
      .then(res => {
        this.setState({
          questionMarksMap: res.data.questionMarksMap,
          questionNumberToShow,
          questions: questionsObject,
          selectedSeatNumber: seat_number
        });
      })
      .catch(err =>
        console.log('Error while fetching answersheets for evaluation')
      );
  }
  toggleModal = (seat_number, occurance) => {
    console.log('selected seat_number in toggleModel: ', seat_number);
    this.setState({
      modal: !this.state.modal,
      selectedSeatNumber: seat_number,
      selectedOccurance: occurance,
      givenMarks: ''
    });
  };
  submitMarks = () => {
    const {
      questionNumberToShow,
      selectedOccurance,
      selectedSeatNumber,
      givenMarks
    } = this.state;
    this.toggleModal();
    axios
      .post(
        '/api/segmentation/evaluate/' +
          questionNumberToShow +
          '/' +
          selectedOccurance +
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
    const { questionMarksMap, questionNumberToShow } = this.state;
    if (e.target.value) {
      if (parseInt(e.target.value) > questionMarksMap[questionNumberToShow]) {
        this.setState({ givenMarks: '' });
        alert('Given marks cannot be greater than out of marks');
      } else {
        this.setState({ givenMarks: e.target.value });
      }
    } else {
      this.setState({ givenMarks: '' });
    }
  };
  getThumbnails = () => {
    const { questions, questionNumberToShow } = this.state;
    let thumbs = [];
    for (var key in questions) {
      if (questions.hasOwnProperty(key)) {
        for (var i = 0; i < questions[key].length; i++) {
          if (questions[key][i].split('_')[0] == questionNumberToShow) {
            let thumb = {};
            thumb.seat_number = key;
            thumb.question = questionNumberToShow;
            thumb.occurance = questions[key][i].split('_')[1];
            thumbs.push(thumb);
          }
        }
      }
    }
    console.log('thumbs: ', thumbs);
    return thumbs;
  };
  render() {
    const {
      questionNumberToShow,
      selectedSeatNumber,
      selectedOccurance,
      questionMarksMap,
      givenMarks
    } = this.state;

    console.log('This.state: ', this.state);
    let content;
    content = (
      <div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggleModal}>
            Evaluate Question {questionNumberToShow}
          </ModalHeader>
          <ModalBody>
            <SketchPad
              background={
                SERVER_URL +
                'api/segmentation/' +
                selectedSeatNumber +
                '/answer/' +
                questionNumberToShow +
                '/' +
                selectedOccurance
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
                  value={questionMarksMap[questionNumberToShow]}
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
                    <button type="button" className="list-group-item">
                      Question {questionNumberToShow}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-10 col-sm-12 col-xs-12">
                <div className="detail_list">
                  <article className="grow fadeIn">
                    <div className="container">
                      <div className="row">
                        {this.getThumbnails(questionNumberToShow).map(
                          (thumb, index) => (
                            <div className="column">
                              <img
                                alt="Thumbnail"
                                key={index}
                                className="img-thumbnail"
                                height="250rem"
                                width="250rem"
                                src={
                                  SERVER_URL +
                                  'api/segmentation/' +
                                  thumb.seat_number +
                                  '/answer/' +
                                  thumb.question +
                                  '/' +
                                  thumb.occurance
                                }
                                onClick={() =>
                                  this.toggleModal(
                                    thumb.seat_number,
                                    thumb.occurance
                                  )
                                }
                              />
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

Evaluation.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Evaluation);
