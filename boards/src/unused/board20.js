import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {List, AutoSizer, WindowScroller} from 'react-virtualized';
import _ from 'lodash'


const SortableItem = SortableElement(({value}) => {
    return (
        <div style={{width :'100vw',  borderTop: '2px solid #333'}}>
            {value}
        </div>
    )
});

class VirtualList extends Component {
	render() {
		let {items} = this.props;

		return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer ignoreHeight>
            {({width}) => (
              <List
                ref="List"
                rowHeight={30}
                rowRenderer={({index}) => {
                  let {value} = items[index];
                  return <SortableItem index={index} value={value} />;
                }}
                rowCount={items.length}
                width={width}
                height={window.innerHeight}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
		);
	}
}

/*
 * Important note:
 * To access the ref of a component that has been wrapped with the SortableContainer HOC,
 * you *must* pass in {withRef: true} as the second param. Refs are opt-in.
 */
const SortableList = SortableContainer(VirtualList, {withRef: true});

export default class SortableComponent extends Component {
    state = {
        items: _.times(5000, index => ({ value: `item-${index}`, height: index%60 + 10 }))
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        if (oldIndex !== newIndex) {
            let {items} = this.state;

            this.setState({
                items: arrayMove(items, oldIndex, newIndex)
            });

            // We need to inform React Virtualized that the items have changed heights
            let inst = this.refs.SortableList.getWrappedInstance();

            inst.refs.List.recomputeRowHeights();
            inst.forceUpdate();
        }
    };
    render() {
        let {items} = this.state;

        return (
          <div style={{width: '100vw'}}>
            <SortableList ref="SortableList" items={items} onSortEnd={this.onSortEnd} />
          </div>
        )
    }
}
