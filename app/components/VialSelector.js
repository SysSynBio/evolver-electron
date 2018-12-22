import React, { Component } from 'react'
import { SelectableGroup, createSelectable,  SelectAll, DeselectAll  } from 'react-selectable-fast'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';


const disabledVial = []

function isDisabled(currentVial) {
  return disabledVial.includes(currentVial)
}


const styles = {
  card: {
    width: 500,
    height: 525,
    margin: '20px 5px 15px 5px',
  },
};

const Label = ({ selecting, selected, vial, strain }) => (
  <div
  className="album-label">
    <h2>
    Vial <span>{`${vial}`}</span>
    </h2>
    <span className="strain-label">{`${strain}`}</span>
    <br />
  </div>
)

class List extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.items !== this.props.items
  }

  render() {
    return (
      <div style={{width: 460}}>
        <div className="centered">
          {this.props.items.map(item => (
            <SelectableAlbum key={item.vial} strain={item.strain} vial={item.vial} selected={item.selected}/>
          ))}
        </div>
        <div className="button-position">
          <SelectAll className="selectable-button">
            <button  className="btn btn-sm btn-outline-secondary">Select All</button>
          </SelectAll>
          <DeselectAll className="selectable-button">
            <button className="btn btn-sm btn-outline-secondary">Clear Selection</button>
          </DeselectAll>
        </div>
      </div>
    )
  }
}

const Album = ({
  selectableRef, selected, selecting, strain, vial,
}) => (
  <div
    id = {"vialID-" + vial}
    ref={selectableRef}
    className={`
      ${(isDisabled(vial)) && 'not-selectable'}
      item
      ${selecting && 'selecting'}
      ${selected && 'selected'}
    `}
  >
    <div className="tick">+</div>
    <Label selected={selected} selecting={selecting} vial={vial} strain={strain}/>
  </div>
)

const SelectableAlbum = createSelectable(Album)



class VialSelector extends Component<Props>  {
  state = {
    disableFirstRow: false,
    buttonFront: "Vial Order",
    buttonBack: "Device Map",
    selectedItems: [],
    selectingItems: [],
  }

  handleSelecting = selectingItems => {
    console.log("Handle selecting");
            if (selectingItems.length !== this.state.selectingItems.length) {
      this.setState({ selectingItems })
    }
  }

  handleSelectionFinish = selectedItems => {
    console.log("Handle selection finish");
    console.log(selectedItems);
            this.setState({
      selectedItems: selectedItems,
      selectingItems: [],
    }, this.props.vialSelectionFinish(selectedItems))
  }

  handleSelectionClear = selectedItems => {  
    console.log("Handle selection clear");
  }

  toggleFirstRow = () => {
    this.setState({ disableFirstRow: !this.state.disableFirstRow })
  }

  toggleOrder = () => {
    this.setState({
      reversed: !this.state.reversed,
    })
  }

  render() {
    const { classes } = this.props;
    const { items } = this.props
    const { reversed } = this.state

    const orderedItems = reversed ? items.slice(12,16).concat(items.slice(8,12)).concat(items.slice(4,8)).concat(items.slice(0,4)) : items
    const buttonLabel = reversed ? this.state.buttonBack: this.state.buttonFront

    return (
        <Card className={classes.card}>
          <div className="vialArray-gui" style={{display: 'flex', justifyContent:'center', alignItems:'center',}}>
            <SelectableGroup
              ref={ref => (window.selectableGroup = ref)}
              className="main"
              clickClassName="tick"
              enableDeselect
              tolerance={0}
              deselectOnEsc={true}
              allowClickWithoutSelected={false}
              duringSelection={this.handleSelecting}
              onSelectionClear={this.handleSelectionClear}
              onSelectionFinish={this.handleSelectionFinish}
              ignoreList={['.not-selectable']}
            >
              <List items={orderedItems} />
            </SelectableGroup>
          </div>
          <div className= "toggle-button-position">
            <span  style={{paddingRight: 10}}> Toggle: </span >
            <button className = "btn btn-sm btn-outline-primary" onClick={this.toggleOrder}>{buttonLabel}</button>
          </div>
        </Card>
    )
  }
}

VialSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VialSelector);