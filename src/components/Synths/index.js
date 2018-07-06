import React from 'react';
import { connect } from 'react-redux';
import { addSynth, updateCrafts } from '../../actions/synths';
import synthFilter from '../../selectors/synths';
import Heading from '../Heading';
import SynthForm from './SynthForm';
import SynthItem from './SynthItem';

class Synths extends React.Component {
  state = {
    isAddSynth: false
  };

  addSynth = (synth) => {
    this.props.addSynth(synth);
    this.setState(() => ({ isAddSynth: false }));
  };

  handleToggleAddSynth = () => this.setState((prevState) => ({ isAddSynth: !prevState.isAddSynth }));

  handleCraftChange = (e, craft) => {
    let updates = {}
    const lv = Number(e.target.value);
    if (lv >= 0 && lv <= 110) {
      updates[craft] = lv;
      this.props.updateCrafts(updates);
    }
  };

  render() {
    return (
      <div className="Synths">
        <Heading>
          Synths
        </Heading>
        <div className="Synths__contents">
          {this.props.synths.length > 0 ? (
            <ul>
              {this.props.synths.map(synth => (
                <li key={synth.id}>
                  <SynthItem synth={synth} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No synths found.</p>
          )}
          <button
            type="button"
            className={this.state.isAddSynth ? "Synths__addSynthButton--close" : "Synths__addSynthButton"}
            onClick={this.handleToggleAddSynth}
          >
            {this.state.isAddSynth ? 'Close' : 'Add Synth'}
          </button>
          {this.state.isAddSynth && (
            <SynthForm onSubmit={this.addSynth} />
          )}
          <ul className="Synths__crafts">
            {Object.entries(this.props.crafts).map(craft => (
              <li
                key={craft[0]}
                className={craft[1] == 110 ? "Synths__craftItem--capped" : "Synths__craftItem"}
              >
                <label htmlFor={craft[0]}>
                  {craft[0]}
                </label>
                <input
                  type="number"
                  value={craft[1]}
                  onChange={(e) => this.handleCraftChange(e, craft[0])}
                  min="0"
                  max="110"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  synths: synthFilter(state.synths.items),
  crafts: state.synths.crafts
});

const mapDispatchToProps = (dispatch) => ({
  addSynth: (synth) => dispatch(addSynth(synth)),
  updateCrafts: (updates) => dispatch(updateCrafts(updates))
});

export default connect(mapStateToProps, mapDispatchToProps)(Synths);
