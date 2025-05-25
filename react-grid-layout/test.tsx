import React, { useState, useCallback } from "react";
import GridLayout from "react-grid-layout";
import {
  DndContext,
  useDraggable,
  useDroppable,
  rectIntersection,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { Tabs, Button } from "antd";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

type CardType = {
  id: string;
  title: string;
  content: React.ReactNode;
  isTabGroup?: boolean;
  tabs?: CardType[];
};

const initialCards: CardType[] = [
  { id: "1", title: "卡片1", content: <div>内容1</div> },
  { id: "2", title: "卡片2", content: <div>内容2</div> },
  { id: "3", title: "卡片3", content: <div>内容3</div> },
];

const initialLayout = [
  { i: "1", x: 0, y: 0, w: 4, h: 4 },
  { i: "2", x: 4, y: 0, w: 4, h: 4 },
  { i: "3", x: 8, y: 0, w: 4, h: 4 },
];

function DraggableCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    userSelect: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

function DroppableCard({
  id,
  isActive,
  isDragging,
  children,
}: {
  id: string;
  isActive: boolean;
  isDragging: boolean;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    outline: isActive ? "3px solid #1890ff" : isOver && isDragging ? "3px dashed #1890ff" : undefined,
    transition: "outline 0.2s ease",
    height: "100%",
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default function DragMergeTabsDemo() {
  const [cards, setCards] = useState<CardType[]>(initialCards);
  const [layoutState, setLayoutState] = useState(initialLayout);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState<string | null>(null);
  // 维护每个 Tab 组当前激活 Tab id
  const [activeTabKeys, setActiveTabKeys] = useState<Record<string, string>>({});

  // Tabs 切换时更新激活的 tab key
  const onTabsChange = useCallback(
    (tabGroupId: string, activeKey: string) => {
      // console.log(`切换 Tab 组 ${tabGroupId} 到 Tab ${activeKey}`);
      setActiveTabKeys((prev) => ({ ...prev, [tabGroupId]: activeKey }));
    },
    []
  );

  // 渲染单个卡片内容，支持合并的 Tab 组
  function renderCardContent(card: CardType) {
    if (card.isTabGroup && card.tabs && card.tabs.length > 0) {
      // 默认激活第一个 tab
      const activeKey = activeTabKeys[card.id] || card.tabs[0].id;
      return (
        <Tabs
          activeKey={activeKey}
          onChange={(key) => onTabsChange(card.id, key)}
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === "remove") {
              // 关闭 Tab
              const newTabs = card.tabs!.filter((t) => t.id !== targetKey);
              if (newTabs.length === 1) {
                // 只有一个 Tab，拆分成普通卡片
                setCards((prev) => {
                  const withoutGroup = prev.filter((c) => c.id !== card.id);
                  return [...withoutGroup, newTabs[0]];
                });
                setLayoutState((prevLayout) => {
                  const groupLayout = prevLayout.find((l) => l.i === card.id);
                  if (!groupLayout) return prevLayout;
                  const restLayout = prevLayout.filter((l) => l.i !== card.id);
                  return [
                    ...restLayout,
                    {
                      i: newTabs[0].id,
                      x: groupLayout.x,
                      y: groupLayout.y,
                      w: groupLayout.w,
                      h: groupLayout.h,
                    },
                  ];
                });
                // 删除该组的激活状态
                setActiveTabKeys((prev) => {
                  const copy = { ...prev };
                  delete copy[card.id];
                  return copy;
                });
                return;
              }
              // 更新组内 tabs
              setCards((prev) =>
                prev.map((c) => (c.id === card.id ? { ...c, tabs: newTabs } : c))
              );
              // 如果关闭的是当前激活 tab，切换激活到第一个 tab
              if (activeKey === targetKey && newTabs.length > 0) {
                onTabsChange(card.id, newTabs[0].id);
              }
            }
          }}
          style={{ height: "100%" }}
          items={card.tabs.map((tab) => ({
            label: tab.title,
            key: tab.id,
            children: <div style={{ padding: 12 }}>{tab.content}</div>,
          }))}
        />
      );
    }
    return <div style={{ padding: 12 }}>{card.content}</div>;
  }

  // 拖拽开始
  const handleDragStart = useCallback(({ active }) => {
    setDraggingId(active.id);
    setMergeTargetId(null);
  }, []);

  // 拖拽结束
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggingId(null);
      if (over && active.id !== over.id) {
        const activeCard = cards.find((c) => c.id === active.id);
        const overCard = cards.find((c) => c.id === over.id);
        if (!activeCard || !overCard) return;

        // 过滤掉拖拽卡和目标卡
        let newCards = cards.filter((c) => c.id !== active.id && c.id !== over.id);

        if (overCard.isTabGroup) {
          // 目标已经是 Tab 组，追加新 Tab
          const existingTabIds = new Set(overCard.tabs?.map((t) => t.id));
          let newTab = activeCard;
          if (existingTabIds.has(activeCard.id)) {
            newTab = { ...activeCard, id: activeCard.id + "_copy" };
          }
          const updatedTabs = [...(overCard.tabs || []), newTab];
          newCards.push({ ...overCard, tabs: updatedTabs });
        } else {
          // 两个单卡合并成 Tab 组
          newCards.push({
            id: overCard.id,
            title: overCard.title + " + " + activeCard.title,
            content: null,
            isTabGroup: true,
            tabs: [overCard, activeCard],
          });
        }

        // 布局中移除拖拽卡片对应布局，保留目标卡片位置
        const newLayout = layoutState.filter((l) => l.i !== active.id);

        setCards(newCards);
        setLayoutState(newLayout);
        setMergeTargetId(null);
        // 新合并组默认激活第一个 Tab
        setActiveTabKeys((prev) => ({
          ...prev,
          [over.id]: (overCard.isTabGroup ? overCard.tabs?.[0].id : activeCard.id) || over.id,
        }));
      } else {
        setMergeTargetId(null);
      }
    },
    [cards, layoutState]
  );

  // 拖拽悬浮目标变化
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over, active } = event;
    if (over && over.id !== active.id) {
      setMergeTargetId(over.id as string);
    } else {
      setMergeTargetId(null);
    }
  }, []);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={rectIntersection}
    >
      <GridLayout
        className="layout"
        layout={layoutState}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={(layout) => setLayoutState(layout)}
        draggableHandle=".drag-handle"
      >
        {cards.map((card) => {
          const isDragging = draggingId === card.id;
          const isActive = mergeTargetId === card.id;
          return (
            <div
              key={card.id}
              data-grid={layoutState.find((l) => l.i === card.id)}
              style={{ border: isActive ? "3px solid #1890ff" : "1px solid #ddd", borderRadius: 4, background: "#fff", overflow: "hidden" }}
            >
              <DroppableCard id={card.id} isActive={isActive} isDragging={isDragging}>
                <DraggableCard id={card.id}>
                  <div className="drag-handle" style={{ padding: 8, backgroundColor: "#eee", cursor: "move" }}>
                    {card.title}
                  </div>
                </DraggableCard>
                <div style={{ height: "calc(100% - 40px)", overflow: "auto" }}>
                  {renderCardContent(card)}
                </div>
              </DroppableCard>
            </div>
          );
        })}
      </GridLayout>
    </DndContext>
  );
}