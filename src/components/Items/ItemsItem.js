import React from 'react';
import { connect } from 'react-redux';
import { editItem, removeItem } from '../../actions/items';
import ItemForm from './ItemForm';

class ItemsItem extends React.Component {
  state = {
    isEdit: false
  };

  editItem = (updates) => {
    this.props.editItem(updates);
    this.setState(() => ({ isEdit: false }));
  };

  handleToggleEdit = () => this.setState((prevState) => ({ isEdit: !prevState.isEdit }));

  render() {
    const { name, source, sourceName, sourceLocation, cost } = this.props.item;
    return (
      <div className="ItemsItem">
        {this.state.isEdit ? (
          <ItemForm item={this.props.item} onSubmit={this.editItem} onCancel={this.handleToggleEdit} />
        ) : (
          <div>
            {name} <span className="ItemsItem__details">[{source === 'AH' ? cost : sourceName}{source !== 'AH' && sourceLocation && `, ${sourceLocation}`}]</span>
            <div className="ItemsItem__buttons">
              <button type="button" onClick={this.handleToggleEdit}>
                Edit
              </button>
              <button type="button" onClick={this.props.removeItem}>
                Remove
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  editItem: (updates) => dispatch(editItem(ownProps.item.id, updates)),
  removeItem: () => dispatch(removeItem(ownProps.item.id))
});

export default connect(undefined, mapDispatchToProps)(ItemsItem);
