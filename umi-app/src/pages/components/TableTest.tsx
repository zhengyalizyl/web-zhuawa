import React, { useState, useEffect, useRef } from "react";
import {
  Column,
  Table,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import "react-virtualized/styles.css";
import { loremIpsum } from "lorem-ipsum";

function Collapsible({
  children,
  title,
  onChange,
  setSelectIndex,
  index,
  selectIndex,
    listRef,
    cache,
}) {
  const [expanded, setExpanded] = useState(false);
  const onClick = () => {
    setExpanded(!expanded);
    if (selectIndex.indexOf(index) < 0) {
      setSelectIndex([...selectIndex, index]);
    } else {
      let a = selectIndex.filter((item) => item != index);
      setSelectIndex(a);
    }
    console.log(cache,'cache')
    cache?.clear(index, 0); // 展开时清除缓存
    onChange && onChange();
    listRef.current.recomputeRowHeights(index);
  };
  return (
    <>
      <div className="accordHeader" 
       style={{whiteSpace:'break-spaces'}}
      onClick={() => onClick()}>
        {title}
      </div>
      {selectIndex.indexOf(index) > -1 && <>{children}</>}
    </>
  );
}


const reasonCellVoid = (
  cellData,
  dataKey,
  parent,
  rowIndex,
  rowData,
  // style,
  listRef,
  setSelectIndex,
  selectIndex,
  cache,
) => {
  // console.log(selectIndex, setSelectIndex, listRef, "-----selectIndex");
  let index = rowIndex;
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={dataKey}
      parent={parent}
      rowIndex={rowIndex}
    >
      {({ registerChild, measure }) => (
        <div className="row" ref={registerChild}>
          <Collapsible
            title={rowData.name}
            listRef={listRef}
            setSelectIndex={setSelectIndex}
            selectIndex={selectIndex}
            index={index}
            onChange={measure}
            cache={cache}
          >
            <div className="image">hhhio</div>
            <div className="content">
              <div>{rowData.name}</div>
              <div>
                <span className="a">{rowData.text}</span>
              </div>
            </div>
          </Collapsible>
        </div>
      )}
    </CellMeasurer>
  );
};

function App() {
  const [arr, setArr] = useState<any>([]);
  const [selectIndex, setSelectIndex] = useState([]);
  const listRef = useRef();
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });
  useEffect(() => {
    for (let i = 0; i < 1000; i++) {
      setArr((prevArr) => [
        ...prevArr,
        {
          number: i,
          name: loremIpsum({
            count: 7,
            units: "sentences",
            sentenceLowerBound: 1,
            sentenceUpperBound: 2,
          }),
          text: loremIpsum({
            count: Math.random() > 0.5 ? 10 : 5,
            units: "sentences",
            sentenceLowerBound: 4,
            sentenceUpperBound: 8,
          }),
        },
      ]);
    }
  
  }, []);

  useEffect(()=>{
    if (listRef && listRef.current) {
      cache.clearAll();
      listRef.current.recomputeRowHeights();
      listRef.current.forceUpdateGrid();
    }
  },[arr])


  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>

      <div style={{ height: "300px", width: "90%" }}>
        <AutoSizer>
          {({ height, width }) => (
            <Table
              gridStyle={{ outline: "none" }}
              width={width}
              height={height}
              headerHeight={20}
              ref={listRef}
              // rowHeight={70}
              rowCount={arr.length}
              rowGetter={({ index }) => arr[index]}
              // deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              // rowRenderer={renderRow}
            >
              <Column width={200} label="Number" dataKey="number" />
              <Column
                width={600}
                label="Name"
                dataKey="name"
                cellRenderer={({
                  cellData,
                  dataKey,
                  parent,
                  rowIndex,
                  rowData,
                }) => {
                  return reasonCellVoid(
                    cellData,
                    dataKey,
                    parent,
                    rowIndex,
                    rowData,
                    listRef,
                    setSelectIndex,
                    selectIndex,
                    cache
                  );
                }}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

export default App;
