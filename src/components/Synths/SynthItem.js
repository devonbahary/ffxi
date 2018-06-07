import React from 'react';
import { connect } from 'react-redux'
import { editSynth, removeSynth } from '../../actions/synths';
import SynthForm from './SynthForm';

class SynthItem extends React.Component {
  state = {
    isEdit: false
  };

  editSynth = (updates) => {
    this.props.editSynth(updates);
    this.setState(() => ({ isEdit: false }));
  };

  handleToggleEdit = () => this.setState((prevState) => ({ isEdit: !prevState.isEdit }));

  render() {
    const { name, craft, lv, crystal, sellPrice } = this.props.synth;
    return (
      <div className="SynthItem">
        {this.state.isEdit ? (
          <SynthForm synth={this.props.synth} onSubmit={this.editSynth} onCancel={this.handleToggleEdit} />
        ) : (
          <div>
            [{craft}] <span className={`${crystal.toLowerCase()}-color`}>{name}</span>({lv}) {!!sellPrice && (<span className="SynthItem__sellPrice">{sellPrice}g</span>)}
            <div className="SynthItem__buttons">
              <button type="button" onClick={this.handleToggleEdit}>
                Edit
              </button>
              <button type="button" onClick={this.props.removeSynth}>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  editSynth: (updates) => dispatch(editSynth(ownProps.synth.id, updates)),
  removeSynth: () => dispatch(removeSynth(ownProps.synth.id))
});

export default connect(undefined, mapDispatchToProps)(SynthItem);
