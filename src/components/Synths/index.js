import React from 'react';
import { connect } from 'react-redux';
import { addSynth } from '../../actions/synths';
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  synths: state.synths
});

const mapDispatchToProps = (dispatch) => ({
  addSynth: (synth) => dispatch(addSynth(synth))
});

export default connect(mapStateToProps, mapDispatchToProps)(Synths);
