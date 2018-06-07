import React from 'react';
import { connect } from 'react-redux';
import { updateProfile } from '../../actions/profile';
import Heading from '../Heading';

class ProfileFame extends React.Component {
  handleBastokChange = (e) => {
    const bastokFame = Number(e.target.value);
    if (bastokFame >= 1 && bastokFame <= 9) {
      this.props.updateProfile({ bastokFame });
    }
  };

  handleSanDOriaChange = (e) => {
    const sanDOriaFame = Number(e.target.value);
    if (sanDOriaFame >= 1 && sanDOriaFame <= 9) {
      this.props.updateProfile({ sanDOriaFame });
    }
  };

  handleWindurstChange = (e) => {
    const windurstFame = Number(e.target.value);
    if (windurstFame >= 1 && windurstFame <= 9) {
      this.props.updateProfile({ windurstFame });
    }
  };

  handleJeunoChange = (e) => {
    const jeunoFame = Number(e.target.value);
    if (jeunoFame >= 1 && jeunoFame <= 9) {
      this.props.updateProfile({ jeunoFame });
    }
  };

  handleTenshodoChange = (e) => {
    const tenshodoFame = Number(e.target.value);
    if (tenshodoFame >= 1 && tenshodoFame <= 9) {
      this.props.updateProfile({ tenshodoFame });
    }
  };

  render() {
    return (
      <div className="ProfileFame">
        <Heading>
          Fame
        </Heading>
        <ul className="ProfileFame__list">
          <li className={this.props.bastokFame == 9 ? "ProfileFame__entity--capped" : "ProfileFame__entity"}>
            <label htmlFor="Bastok">
              Bastok
            </label>
            <input
              id="Bastok"
              type="number"
              value={this.props.bastokFame}
              onChange={this.handleBastokChange}
              min="1"
              max="9"
            />
          </li>
          <li className={this.props.sanDOriaFame == 9 ? "ProfileFame__entity--capped" : "ProfileFame__entity"}>
            <label htmlFor="San d'Oria">
              San d'Oria
            </label>
            <input
              id="San d'Oria"
              type="number"
              value={this.props.sanDOriaFame}
              onChange={this.handleSanDOriaChange}
              min="1"
              max="9"
            />
          </li>
          <li className={this.props.windurstFame == 9 ? "ProfileFame__entity--capped" : "ProfileFame__entity"}>
            <label htmlFor="Windurst">
              Windurst
            </label>
            <input
              id="Windurst"
              type="number"
              value={this.props.windurstFame}
              onChange={this.handleWindurstChange}
              min="1"
              max="9"
            />
          </li>
          <li className={this.props.jeunoFame == 9 ? "ProfileFame__entity--capped" : "ProfileFame__entity"}>
            <label htmlFor="Jeuno">
              Jeuno
            </label>
            <input
              id="Jeuno"
              type="number"
              value={this.props.jeunoFame}
              onChange={this.handleJeunoChange}
              min="1"
              max="9"
            />
          </li>
          <li className={this.props.tenshodoFame == 9 ? "ProfileFame__entity--capped" : "ProfileFame__entity"}>
            <label htmlFor="Tenshodo">
              Tenshodo
            </label>
            <input
              id="Tenshodo"
              type="number"
              value={this.props.tenshodoFame}
              onChange={this.handleTenshodoChange}
              min="1"
              max="9"
            />
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateProfile: (updates) => dispatch(updateProfile(updates))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFame);
