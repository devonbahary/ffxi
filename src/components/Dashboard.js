import React from 'react';
import Items from './Items';
import Jobs from './Jobs';
import Profile from './Profile'
import Synths from './Synths';
import Tasks from './Tasks';

const Dashboard = () => (
  <div>
    <hr />
    <Profile />
    <hr />
    <Tasks />
    <hr />
    <Items />
    <hr />
    <Jobs />
    <hr />
    <Synths />
  </div>
);

export default Dashboard;
