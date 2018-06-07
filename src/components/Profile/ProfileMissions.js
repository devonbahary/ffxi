import React from 'react';
import { connect } from 'react-redux';
import { updateProfile } from '../../actions/profile';
import Heading from '../Heading';
import originalMissionsList from '../../db/originalMissionsList';
import rozMissionsList from '../../db/rozMissionsList';
import copMissionsList from '../../db/copMissionsList';
import toauMissionsList from '../../db/toauMissionsList';
import wotgMissionsList from '../../db/wotgMissionsList';
import soaMissionsList from '../../db/soaMissionsList';
import rovMissionsList from '../../db/rovMissionsList';

class ProfileMissions extends React.Component {
  handleOriginalMissionChange = (e) => {
    const originalMissionIndex = e.target.value;
    this.props.updateProfile({ originalMissionIndex });
  };

  handleRoZMissionChange = (e) => {
    const rozMissionIndex = e.target.value;
    this.props.updateProfile({ rozMissionIndex });
  };

  handleCoPMissionChange = (e) => {
    const copMissionIndex = e.target.value;
    this.props.updateProfile({ copMissionIndex });
  };

  handleToAUMissionChange = (e) => {
    const toauMissionIndex = e.target.value;
    this.props.updateProfile({ toauMissionIndex });
  };

  handleWotGMissionChange = (e) => {
    const wotgMissionIndex = e.target.value;
    this.props.updateProfile({ wotgMissionIndex });
  };

  handleSoAMissionChange = (e) => {
    const soaMissionIndex = e.target.value;
    this.props.updateProfile({ soaMissionIndex });
  };

  handleRoVMissionChange = (e) => {
    const rovMissionIndex = e.target.value;
    this.props.updateProfile({ rovMissionIndex });
  };

  render() {
    return (
      <div className="ProfileMissions">
        <Heading>
          Missions
        </Heading>
        <ul className="ProfileMissions_list">
          <li className={Number(this.props.originalMissionIndex) + 1 === originalMissionsList.length ? "ProfileMissions__mission--capped" : "ProfileMissions__mission"}>
            <label htmlFor="OriginalMission">
              <b>Rank </b>
            </label>
            <select
              id="OriginalMission"
              value={this.props.originalMissionIndex}
              onChange={this.handleOriginalMissionChange}
            >
              {originalMissionsList.map((mission, index) => (
                <option key={index} value={index}>
                  {mission}
                </option>
              ))}
            </select>
          </li>
          <li className={Number(this.props.rozMissionIndex) + 1 === rozMissionsList.length ? "ProfileMissions__mission--capped" : "ProfileMissions__mission"}>
            <label htmlFor="Rise of the Zilart">
              <b>RoZ </b>
            </label>
            <select
              id="Rise of the Zilart"
              value={this.props.rozMissionIndex}
              onChange={this.handleRoZMissionChange}
            >
              {rozMissionsList.map((mission, index) => (
                <option key={index} value={index}>
                  {mission}
                </option>
              ))}
            </select>
          </li>
          <li className={Number(this.props.copMissionIndex) + 1 === copMissionsList.length ? "ProfileMissions__mission--capped" : "ProfileMissions__mission"}>
            <label htmlFor="Chains of Promathia">
              <b>CoP </b>
            </label>
            <select
              id="Chains of Promathia"
              className={Number(this.props.copMissionIndex) + 1 === copMissionsList.length ? "ProfileMissions__missionSelect--capped" : ""}
              value={this.props.copMissionIndex}
              onChange={this.handleCoPMissionChange}
            >
              {copMissionsList.map((mission, index) => (
                <option key={index} value={index}>
                  {mission}
                </option>
              ))}
            </select>
          </li>
          <li className={Number(this.props.toauMissionIndex) + 1 === toauMissionsList.length ? "ProfileMissions__mission--capped" : "ProfileMissions__mission"}>
            <label htmlFor="OriginalMission">
              <b>ToAU </b>
            </label>
            <select
              id="OriginalMission"
              value={this.props.toauMissionIndex}
              onChange={this.handleToAUMissionChange}
            >
              {toauMissionsList.map((mission, index) => (
                <option key={index} value={index}>
                  {mission}
                </option>
              ))}
            </select>
          </li>
          <li className={Number(this.props.wotgMissionIndex) + 1 === wotgMissionsList.length ? "ProfileMissions__mission--capped" : "ProfileMissions__mission"}>
            <label htmlFor="Wings of the Goddess">
              <b>WotG </b>
            </label>
            <select
              id="Wings of the Goddess"
              value={this.props.wotgMissionIndex}
              onChange={this.handleWotGMissionChange}
            >
              {wotgMissionsList.map((mission, index) => (
                <option key={index} value={index}>
                  {mission}
                </option>
              ))}
            </select>
          </li>
          <li className={Number(this.props.soaMissionIndex) + 1 === soaMissionsList.length ? "ProfileMissions__mission--capped" : "ProfileMissions__mission"}>
            <label htmlFor="Seekers of Adoulin">
              <b>SoA </b>
            </label>
            <select
              id="Seekers of Adoulin"
              value={this.props.soaMissionIndex}
              onChange={this.handleSoAMissionChange}
            >
              {soaMissionsList.map((mission, index) => (
                <option key={index} value={index}>
                  {mission}
                </option>
              ))}
            </select>
          </li>
          <li className={Number(this.props.rovMissionIndex) + 1 === rovMissionsList.length ? "ProfileMissions__mission--capped" : "ProfileMissions__mission"}>
            <label htmlFor="Rhapsodies of Vana'diel">
              <b>RoV </b>
            </label>
            <select
              id="Rhapsodies of Vana'diel"
              value={this.props.rovMissionIndex}
              onChange={this.handleRoVMissionChange}
            >
              {rovMissionsList.map((mission, index) => (
                <option key={index} value={index}>
                  {mission}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  originalMissionIndex: state.profile.originalMissionIndex,
  rozMissionIndex: state.profile.rozMissionIndex,
  copMissionIndex: state.profile.copMissionIndex,
  toauMissionIndex: state.profile.toauMissionIndex,
  wotgMissionIndex: state.profile.wotgMissionIndex,
  soaMissionIndex: state.profile.soaMissionIndex,
  rovMissionIndex: state.profile.rovMissionIndex,
});

const mapDispatchToProps = (dispatch) => ({
  updateProfile: (updates) => dispatch(updateProfile(updates))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMissions);
