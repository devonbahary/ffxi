import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { fetchItems } from '../actions/items';
import { fetchJobs } from '../actions/jobs';
import { fetchProfile } from '../actions/profile';
import { fetchSynths } from '../actions/synths';
import { fetchTasks } from '../actions/tasks';
import Dashboard from '../components/Dashboard';

class AppRouter extends React.Component {
  componentWillMount() {
    this.props.fetchItems();
    this.props.fetchJobs();
    this.props.fetchProfile();
    this.props.fetchSynths();
    this.props.fetchTasks();
  };

  render() {
    return (
      <BrowserRouter>
        <main id="main-content">
          <Switch>
            <Route path='/' exact component={Dashboard} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchItems: () => dispatch(fetchItems()),
  fetchJobs: () => dispatch(fetchJobs()),
  fetchProfile: () => dispatch(fetchProfile()),
  fetchSynths: () => dispatch(fetchSynths()),
  fetchTasks: () => dispatch(fetchTasks())
});

export default connect(undefined, mapDispatchToProps)(AppRouter);
