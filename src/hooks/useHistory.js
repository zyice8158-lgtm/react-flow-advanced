import { useState, useCallback, useEffect } from 'react';
import { areGraphEqual, viewportEqual } from '../utils/historyUtils'

const MAX_HISTORY = 50; // 最多保存50步历史记录

export function useHistory(initialNodes, initialEdges) {
  const [history, setHistory] = useState({
    past: [],
    present: { nodes: initialNodes, edges: initialEdges, viewport: { x: 0, y: 0, zoom: 1 } },
    future: [],
  });

  // 添加新图状态到历史记录（忽略仅选择变化）
  const pushHistory = useCallback((nodes, edges) => {
    setHistory((prev) => {
      if (areGraphEqual(prev.present.nodes, prev.present.edges, nodes, edges)) return prev
      const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY)
      return {
        past: newPast,
        present: { nodes, edges, viewport: prev.present.viewport },
        future: [],
      }
    })
  }, [])

  // 记录视口变化（平移/缩放）
  const pushViewport = useCallback((viewport) => {
    setHistory((prev) => {
      if (viewportEqual(prev.present.viewport, viewport)) return prev
      const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY)
      return {
        past: newPast,
        present: { ...prev.present, viewport },
        future: [],
      }
    })
  }, [])

  // 撤销
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  // 重做
  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // 重置历史记录
  const resetHistory = useCallback((nodes, edges) => {
    setHistory({
      past: [],
      present: { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } },
      future: [],
    });
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 检查是否在输入框中
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl+Z 或 Cmd+Z 撤销
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y 或 Cmd+Shift+Z 重做
      else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'y' || (e.key === 'z' && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  return {
    nodes: history.present.nodes,
    edges: history.present.edges,
    viewport: history.present.viewport,
    pushHistory,
    pushViewport,
    undo,
    redo,
    resetHistory,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
// 画布历史栈：记录节点/边变更，支持撤销/重做与防抖
