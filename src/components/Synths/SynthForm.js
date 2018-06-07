import React from 'react';

class SynthForm extends React.Component {
  state = {
    name: this.props.synth ? this.props.synth.name : '',
    craft: this.props.synth ? this.props.synth.craft : 'Alchemy',
    lv: this.props.synth ? this.props.synth.lv : 1,
    crystal: this.props.synth ? this.props.synth.crystal : 'Fire',
    type: this.props.synth ? this.props.synth.type : 'profit',
    sellPrice: this.props.synth ? this.props.synth.sellPrice : 0
  };

  handleCraftChange = (e) => {
    const craft = e.target.value;
    this.setState(() => ({ craft }));
  };

  handleLvChange = (e) => {
    const lv = Number(e.target.value);
    if (lv >= 1 && lv <= 110) {
      this.setState(() => ({ lv }));
    }
  };

  handleCrystalChange = (e) => {
    const crystal = e.target.value;
    this.setState(() => ({ crystal }));
  };

  handleNameChange = (e) => {
    const name = e.target.value;
    this.setState(() => ({ name }));
  };

  handleTypeChange = (e) => {
    const type = e.target.value;
    this.setState(() => ({ type }));
  };

  handleSellPriceChange = (e) => {
    const sellPrice = Number(e.target.value);
    if (sellPrice >= 0) {
      this.setState(() => ({ sellPrice }));
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit({
      ...this.state,
      sellPrice: this.state.type === 'synth' ? 0 : this.state.sellPrice
    });
    this.setState(() => ({
      name: '',
      craft: 'Alchemy',
      lv: 1,
      crystal: 'Fire',
      type: 'profit',
      sellPrice: 0
    }))
  };

  render() {
    const elements = ['Fire', 'Ice', 'Wind', 'Earth', 'Lightning', 'Water', 'Light', 'Dark'];
    const crafts = ['Alchemy', 'Bonecraft', 'Clothcraft', 'Cooking', 'Fishing', 'Goldsmithing',
      'Leathercraft', 'Smithing', 'Woodworking'];

    return (
      <form
        className="SynthForm"
        onSubmit={this.handleSubmit}
      >
        <div>
          <label htmlFor="lv">
            Lv
          </label>
          <input
            id="lv"
            type="number"
            value={this.state.lv}
            onChange={this.handleLvChange}
            min="1"
            max="110"
            required
          />
          <select value={this.state.craft} onChange={this.handleCraftChange}>
            {crafts.map(craft => (
              <option value={craft} key={craft}>
                {craft}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className={`${this.state.crystal.toLowerCase()}-color`}
            value={this.state.crystal}
            onChange={this.handleCrystalChange}
            >
              {elements.map(element => (
                <option value={element} key={element} className={`${element.toLowerCase()}-color`}>
                  {element}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder={this.props.synth ? `edit name` : 'add synth'}
              value={this.state.name}
              onChange={this.handleNameChange}
              autoFocus
              required
            />
            <select value={this.state.type} onChange={this.handleTypeChange}>
              <option value="profit">
                profit
              </option>
              <option value="synth">
                synth
              </option>
            </select>
            {this.state.type === 'profit' && (
              <span>
                <label htmlFor="sellPrice">
                  Price
                </label>
                <input
                  id="sellPrice"
                  type="number"
                  value={this.state.sellPrice}
                  onChange={this.handleSellPriceChange}
                  step="100"
                  min="0"
                />
              </span>
            )}
            <button type="submit">
              {!!this.props.synth ? 'Update' : 'Add Synth'}
            </button>
            {this.props.synth && (
              <button type="button" onClick={this.props.onCancel}>
                Cancel
              </button>
            )}
        </div>
      </form>
    );
  }
}

export default SynthForm;
