/** @flow */
import * as React from "react";
import {
  AutoSizer,
  MultiGrid,
  ScrollSync,
  Grid,
  List
} from "react-virtualized";
import styles from "./index2.css";
import scrollbarSize from 'dom-helpers/scrollbarSize';
// https://github.com/bvaughn/react-virtualized/blob/master/source/ScrollSync/ScrollSync.example.js
// const STYLE = {
//   border: "1px solid #ddd"
// };
// const STYLE_BOTTOM_LEFT_GRID = {
//   // borderRight: "2px solid #aaa",
//   backgroundColor: "#f7f7f7"
// };
// const STYLE_TOP_LEFT_GRID = {
//   borderBottom: "2px solid #aaa",
//   // borderRight: "2px solid #aaa",
//   fontWeight: "bold"
// };
// const STYLE_TOP_RIGHT_GRID = {
//   borderBottom: "1px solid #aaa",
//   fontWeight: "bold"
// };

const a = () => {
  const [state] = React.useState({
    fixedColumnCount: 1,
    fixedRowCount: 1,
    scrollToColumn: 0,
    scrollToRow: 0
  });

  const _cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <div className={styles.Cell} key={key} style={style}>
        {rowIndex === 0 ? (
          `Header: ${columnIndex}- ${rowIndex}`
        ) : (
          <span>{`${columnIndex} - ${rowIndex}`}</span>
        )}
      </div>
    );
  };

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <MultiGrid
          {...state}
          cellRenderer={_cellRenderer}
          columnWidth={75}
          columnCount={50}
          enableFixedColumnScroll
          enableFixedRowScroll
          height={300}
          rowHeight={70}
          rowCount={100}
          // style={STYLE}
          // styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
          // styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
          // styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
          width={width}
          hideTopRightGridScrollbar
          hideBottomLeftGridScrollbar
          hideBottomRightGridScrollbar
        />
      )}
    </AutoSizer>
  );
};

const b = () => {
  return (
    <ScrollSync>
      {({
        clientHeight,
        clientWidth,
        onScroll,
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth
      }) => (
        <div className="Table">
          <div className="LeftColumn">
            <List scrollTop={scrollTop} />
          </div>
          <div className="RightColumn">
            <Grid onScroll={onScroll} />
          </div>
        </div>
      )}
    </ScrollSync>
  );
};

const LEFT_COLOR_FROM = hexToRgb("#471061");
const LEFT_COLOR_TO = hexToRgb("#BC3959");
const TOP_COLOR_FROM = hexToRgb("#000000");
const TOP_COLOR_TO = hexToRgb("#333333");

class Board extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      columnWidth: 75,
      columnCount: 50,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount: 100,
      scrollLeft:0
    };

    this._renderBodyCell = this._renderBodyCell.bind(this);
    this._renderHeaderCell = this._renderHeaderCell.bind(this);
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
    this.onScroll2=this.onScroll2.bind(this);
  }

  onScroll2=(val,fn)=>{
     console.log(val)
     const {scrollLeft,scrollWidth,clientWidth} =val;
     if(scrollLeft<400){
      //   val.scrollLeft=400;
      //  this.setState({
      //   scrollLeft:400
      //  })
       return fn(val)
     }
     this.setState({
      scrollLeft
     })

     fn(val)
     
  }
  render() {
    const {
      columnCount,
      columnWidth,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
    } = this.state;



    return (
      <div>
        <ScrollSync>
          {({
            clientHeight,
            clientWidth,
            onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollRight,
            scrollWidth
          }) => {
             
            const x = scrollLeft / (scrollWidth - clientWidth);
            // const x = scrollLeft / (scrollWidth - clientWidth);
            const y = scrollTop / (scrollHeight - clientHeight);
            console.log(scrollbarSize());
            const leftBackgroundColor = mixColors(
              LEFT_COLOR_FROM,
              LEFT_COLOR_TO,
              y
            );
            const leftColor = "#ffffff";
            const topBackgroundColor = mixColors(
              TOP_COLOR_FROM,
              TOP_COLOR_TO,
              x
            );
            const topColor = "#ffffff";
            const middleBackgroundColor = mixColors(
              leftBackgroundColor,
              topBackgroundColor,
              0.5
            );
            const middleColor = "#ffffff";

            return (
              <div className={styles.GridRow}>
                <div
                  className={styles.LeftSideGridContainer}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    color: leftColor,
                    backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`
                  }}
                >
                  <Grid
                    cellRenderer={this._renderLeftHeaderCell}
                    className={styles.HeaderGrid}
                    width={columnWidth}
                    height={rowHeight}
                    rowHeight={rowHeight}
                    columnWidth={columnWidth}
                    rowCount={1}
                    columnCount={4}
                  />
                </div>
   
                <div
                  className={styles.LeftSideGridContainer}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: rowHeight,
                    // color: leftColor,
                    color:'green',
                    backgroundColor: `rgb(${leftBackgroundColor.r},${leftBackgroundColor.g},${leftBackgroundColor.b})`
                  }}
                >
                  <Grid
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    cellRenderer={this._renderLeftSideCell}
                    columnWidth={columnWidth}
                    columnCount={4}
                    className={styles.LeftSideGrid}
                    height={height - scrollbarSize()}
                    rowHeight={rowHeight}
                    rowCount={rowCount}
                    scrollTop={scrollTop}
                    width={columnWidth}
                  /> 
                </div>
              <div>
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <div>
                        <div
                          style={{
                            backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`,
                            color: topColor,
                            height: rowHeight,
                            width: width - scrollbarSize()
                          }}
                        >
                           <Grid
                            className={styles.HeaderGrid}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={this._renderHeaderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            style={{overflow:'hidden !important'}}
                            width={width - scrollbarSize()}
                          /> 
                        </div>
                        <div
                          style={{
                            backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                            color: middleColor,
                            height,
                            width
                          }}
                        >
                          <Grid
                            className={styles.BodyGrid}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={height}
                            onScroll={e=>this.onScroll2(e,onScroll)}
                            overscanColumnCount={overscanColumnCount}
                            overscanRowCount={overscanRowCount}
                            cellRenderer={this._renderBodyCell}
                            rowHeight={rowHeight}
                            rowCount={rowCount}
                            scrollLeft={scrollLeft}
                            width={width}
                          />
                        </div>
                      </div>
                    )}
                  </AutoSizer>
                </div> 
              </div>
            );
          }}
        </ScrollSync>
      </div>
    );
  }

  _renderBodyCell({ columnIndex, key, rowIndex, style }) {
    console.log(columnIndex,key,rowIndex)
    if (columnIndex < 1) {
      return;
    }

    return this._renderLeftSideCell({ columnIndex, key, rowIndex, style });
  }

  _renderHeaderCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }

    return this._renderLeftHeaderCell({ columnIndex, key, rowIndex, style });
  }

  _renderLeftHeaderCell({ columnIndex, key, rowIndex, style }) {
    return (
      <div
        className={styles.headerCell}
        key={key}
        style={style}
      >
        {`C${columnIndex}`}
      </div>
    );
  }

  _renderLeftSideCell({ columnIndex, key, rowIndex, style }) {
    // const rowClass = rowIndex % 2 === 0
    //   ? columnIndex % 2 === 0 ? styles.evenRow : styles.oddRow
    //   : columnIndex % 2 !== 0 ? styles.evenRow : styles.oddRow
    // const classNames = cn(rowClass, styles.cell)

    return (
      <div
        // className={classNames}
        key={key}
        style={style}
      >
        {`R${rowIndex}, C${columnIndex}`}
      </div>
    );
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors(color1, color2, amount) {
  const weight1 = amount;
  const weight2 = 1 - amount;

  const r = Math.round(weight1 * color1.r + weight2 * color2.r);
  const g = Math.round(weight1 * color1.g + weight2 * color2.g);
  const b = Math.round(weight1 * color1.b + weight2 * color2.b);

  return { r, g, b };
}

export default Board;
