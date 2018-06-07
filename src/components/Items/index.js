import React from 'react';
import { connect } from 'react-redux';
import { addItem } from '../../actions/items';
import Heading from '../Heading';
import ItemForm from './ItemForm';
import ItemsItem from './ItemsItem';

class Items extends React.Component {
  state = {
    isAddItem: false
  };

  addItem = (item) => {
    this.setState(() => ({ isAddItem: false }));
    this.props.addItem(item);
  };

  handleToggleAddItem = () => this.setState((prevState) => ({ isAddItem: !prevState.isAddItem }));

  render() {
    return (
      <div className="Items">
        <Heading>
          Items
        </Heading>
        <div className="Items__contents">
          {this.props.items.length > 0 ? (
            <ul>
              {this.props.items.map(item => (
                <li key={item.id}>
                  <ItemsItem item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No items founds.</p>
          )}
          <button
            type="button"
            className={this.state.isAddItem ? 'Items__addItemButton--close' : 'Items__addItemButton'}
            onClick={this.handleToggleAddItem}
            >
              {this.state.isAddItem ? 'Close' : 'Add Item'}
            </button>
            {this.state.isAddItem && <ItemForm onSubmit={this.addItem} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  items: state.items
});

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItem(item))
});

export default connect(mapStateToProps, mapDispatchToProps)(Items);
