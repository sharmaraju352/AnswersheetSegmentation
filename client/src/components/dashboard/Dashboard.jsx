import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

class Dashboard extends Component {
  componentDidMount() {}
  render() {
    const { user } = this.props.auth;
    let dashboardContent;
    if (user.role.includes('admin')) {
      dashboardContent = (
        <div>
          <p className="lead text-muted">Welcome {user.name}</p>
          <Link to="/segmentation" className="btn btn-lg btn-info">
            Upload Answersheet
          </Link>
        </div>
      );
    } else {
      dashboardContent = (
        <div>
          <p className="lead text-muted">Welcome {user.name}</p>
          <Link to="/evaluation" className="btn btn-lg btn-info">
            Evaluate Answersheets
          </Link>
        </div>
      );
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Dashboard);
