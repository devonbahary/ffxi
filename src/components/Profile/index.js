import React from 'react';
import ProfileFame from './ProfileFame';
import ProfileMissions from './ProfileMissions';

const Profile = () => (
  <div className="Profile">
    <div className="Profile__contents">
      <ProfileMissions />
      <ProfileFame />
    </div>
  </div>
);

export default Profile;
