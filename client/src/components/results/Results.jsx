import React, { Component } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../utils/config';

class Results extends Component {
  constructor() {
    super();
    this.state = {
      results: {
        S0124: {
          marks: 150,
          thumbnailQuestion: '4'
        }
      },
      detailedResult: {
        '1': 10
      },
      showDetails: false,
      selectedSeatNumber: ''
    };
  }
  componentDidMount() {
    axios
      .get('/api/segmentation/getEvaluationResults')
      .then(res => {
        console.log(res.data);
        this.setState({ results: res.data.results });
      })
      .catch(err => console.log('Error: ', err));
  }
  showDetails = seat_number => {
    console.log('seat_number: ', seat_number);
    axios
      .get('/api/segmentation/getDetailedEvaluationResults/' + seat_number)
      .then(res => {
        this.setState({
          detailedResult: res.data.detailedResult,
          showDetails: true,
          selectedSeatNumber: seat_number
        });
      })
      .catch(err => console.log('Error: ', err));
  };
  render() {
    const {
      results,
      showDetails,
      detailedResult,
      selectedSeatNumber
    } = this.state;
    let content;
    if (!showDetails) {
      content = Object.keys(results).map((key, index) => (
        <div className="row" key={index}>
          <div className="column">
            <img
              alt="Thumbnail"
              className="img-thumbnail"
              height="250rem"
              width="250rem"
              src={
                SERVER_URL +
                'api/segmentation/' +
                key +
                '/answer/' +
                results[key].thumbnailQuestion
              }
              onClick={() => this.showDetails(key)}
            />
            <h3>
              {key}: {results[key].marks}
            </h3>
          </div>
        </div>
      ));
    } else {
      content = Object.keys(detailedResult).map((key, index) => (
        <div className="row" key={index}>
          <div className="column">
            <img
              alt="Thumbnail"
              className="img-thumbnail"
              height="250rem"
              width="250rem"
              src={
                SERVER_URL +
                'api/segmentation/' +
                selectedSeatNumber +
                '/answer/' +
                key
              }
            />
            <h3>
              {key}: {detailedResult[key]}
            </h3>
          </div>
        </div>
      ));
    }

    return <div>{content}</div>;
  }
}

export default Results;
