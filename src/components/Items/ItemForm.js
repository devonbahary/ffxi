import React from 'react';

class ItemForm extends React.Component {
  state = {
    name: this.props.item ? this.props.item.name : '',
    source: this.props.item ? this.props.item.source : 'AH',
    sourceName: this.props.item ? this.props.item.sourceName : '',
    sourceLocation: this.props.item ? this.props.item.sourceLocation : '',
    cost: this.props.item ? this.props.item.cost : 0
  };

  handleNameChange = (e) => {
    const name = e.target.value;
    this.setState(() => ({ name }));
  };

  handleSourceChange = (e) => {
    const source = e.target.value;
    this.setState(() => ({ source }));
  };

  handleSourceNameChange = (e) => {
    const sourceName = e.target.value;
    this.setState(() => ({ sourceName }));
  };

  handleSourceLocationChange = (e) => {
    const sourceLocation = e.target.value;
    this.setState(() => ({ sourceLocation }));
  };

  handleCostChange = (e) => {
    const cost = e.target.value;
    this.setState(() => ({ cost }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState(() => ({
      name: '',
      source: 'AH',
      sourceName: '',
      price: 0
    }));
  };

  render() {
    const sources = ['AH', 'Quest', 'NM', 'NPC'];

    return (
      <form className="ItemForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
          placeholder="name"
          autoFocus
          required
        />
        <select value={this.state.source} onChange={this.handleSourceChange}>
          {sources.map(source => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
        {this.state.source === 'AH' ? (
          <span>
            <label htmlFor="cost">
              Cost
            </label>
            <input
              id="cost"
              type="number"
              value={this.state.cost}
              onChange={this.handleCostChange}
              min="1"
            />
          </span>
        ) : (
          <span>
            <input
              type="text"
              value={this.state.sourceName}
              onChange={this.handleSourceNameChange}
              placeholder={this.state.source}
              required
            />
            <input
              type="text"
              value={this.state.sourceLocation}
              onChange={this.handleSourceLocationChange}
              placeholder="location"
            />
          </span>
        )}
        <button type="submit">
          {this.props.item ? 'Update' : 'Add Item'}
        </button>
        {this.props.item && (
          <button type="button" onClick={this.props.onCancel}>
            Cancel
          </button>
        )}
      </form>
    );
  }
}

export default ItemForm;
