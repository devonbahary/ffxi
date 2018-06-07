import React from 'react';
import { connect } from 'react-redux';
import { updateJobs } from '../../actions/jobs';
import Heading from '../Heading';

class Jobs extends React.Component {
  handleJobChange = (e, job) => {
    let updates = {}
    const lv = Number(e.target.value);
    if (lv >= 1 && lv <= 99) {
      updates[job] = lv;
      this.props.updateJobs(updates);
    }
  };

  handleJobUnlock = (job) => {
    if (confirm(`Unlock ${job}?`)) {
      let updates = {};
      updates[job] = 1;
      this.props.updateJobs(updates)
    }
  };

  render() {
    return (
      <div className="Jobs">
        <Heading>
          Jobs
        </Heading>
        <ul className="Jobs__list">
          {Object.entries(this.props.jobs).map(job => (
            <li
              key={job[0]}
              className={job[1] == 99 ? "Jobs__listItem--capped" : job[1] ? "Jobs__listItem" : "Jobs__listItem--locked"}
              onClick={job[1] ? () => {} : () => this.handleJobUnlock(job[0])}
            >
              <label htmlFor={job[0]}>
                {job[0]}
              </label>
              <input
                type="number"
                value={job[1]}
                onChange={(e) => this.handleJobChange(e, job[0])}
                min="1"
                max="99"
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  jobs: state.jobs
});

const mapDispatchToProps = (dispatch) => ({
  updateJobs: (updates) => dispatch(updateJobs(updates))
});

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
