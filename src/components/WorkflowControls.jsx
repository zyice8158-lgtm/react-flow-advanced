import { useCallback, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import './WorkflowControls.css';

function WorkflowControls({ resetHistory, undo, redo, canUndo, canRedo, onExecute, isExecuting, onToggleExecutionPanel }) {
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();

  // 保存工作流到文件
  const saveWorkflow = useCallback(() => {
    const workflow = {
      nodes: getNodes(),
      edges: getEdges(),
      version: '1.0',
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [getNodes, getEdges]);

  // 从文件加载工作流
  const loadWorkflow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workflow = JSON.parse(event.target.result);
          
          if (workflow.nodes && workflow.edges) {
            setNodes(workflow.nodes);
            setEdges(workflow.edges);
            
            // 重置历史记录
            if (resetHistory) {
              resetHistory(workflow.nodes, workflow.edges);
            }
            
            // 延迟执行fitView以确保节点已渲染
            setTimeout(() => {
              fitView({ duration: 300 });
            }, 50);
            
            alert('✅ 工作流加载成功！');
          } else {
            alert('❌ 无效的工作流文件格式');
          }
        } catch (error) {
          alert('❌ 解析工作流文件失败：' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges, fitView, resetHistory]);

  // 清空画布
  const clearWorkflow = useCallback(() => {
    if (confirm('确定要清空整个工作流吗？此操作无法撤销。')) {
      setNodes([]);
      setEdges([]);
      if (resetHistory) {
        resetHistory([], []);
      }
      localStorage.removeItem('workflow-autosave');
    }
  }, [setNodes, setEdges, resetHistory]);

  // 自动保存到localStorage
  useEffect(() => {
    const autoSave = () => {
      const workflow = {
        nodes: getNodes(),
        edges: getEdges(),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('workflow-autosave', JSON.stringify(workflow));
    };

    // 每5秒自动保存一次
    const interval = setInterval(autoSave, 5000);

    // 组件卸载时清理
    return () => clearInterval(interval);
  }, [getNodes, getEdges]);

  // 从localStorage恢复工作流
  const restoreAutoSave = useCallback(() => {
    const saved = localStorage.getItem('workflow-autosave');
    if (!saved) {
      alert('没有找到自动保存的工作流');
      return;
    }

    try {
      const workflow = JSON.parse(saved);
      if (workflow.nodes && workflow.edges) {
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
        if (resetHistory) {
          resetHistory(workflow.nodes, workflow.edges);
        }
        setTimeout(() => {
          fitView({ duration: 300 });
        }, 50);
        alert(`✅ 已恢复自动保存（${new Date(workflow.timestamp).toLocaleString()}）`);
      }
    } catch (error) {
      alert('❌ 恢复失败：' + error.message);
    }
  }, [setNodes, setEdges, fitView, resetHistory]);

  return (
    <div className="workflow-controls">
      <div className="controls-group">
        <button 
          className="control-btn save-btn" 
          onClick={saveWorkflow}
          title="保存工作流到文件"
        >
          💾 保存
        </button>
        <button 
          className="control-btn load-btn" 
          onClick={loadWorkflow}
          title="从文件加载工作流"
        >
          📂 加载
        </button>
        <button 
          className="control-btn restore-btn" 
          onClick={restoreAutoSave}
          title="恢复自动保存"
        >
          ⏮️ 恢复
        </button>
        <button 
          className="control-btn clear-btn" 
          onClick={clearWorkflow}
          title="清空画布"
        >
          🗑️ 清空
        </button>
        <div className="divider"></div>
        <button
          className="control-btn history-btn"
          onClick={undo}
          disabled={!canUndo}
          title="撤销 (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          className="control-btn history-btn"
          onClick={redo}
          disabled={!canRedo}
          title="重做 (Ctrl+Y)"
        >
          ↷
        </button>
        <div className="divider"></div>
        <button
          className={`control-btn execute-btn ${isExecuting ? 'executing' : ''}`}
          onClick={onExecute}
          disabled={isExecuting}
          title="运行工作流"
        >
          {isExecuting ? '⏳ 运行中...' : '▶️ 运行'}
        </button>
        <button
          className="control-btn results-btn"
          onClick={onToggleExecutionPanel}
          title="查看执行结果"
        >
          📊 结果
        </button>
      </div>
      <div className="autosave-indicator">
        <span className="pulse-dot"></span>
        <span className="autosave-text">自动保存中...</span>
      </div>
    </div>
  );
}

export default WorkflowControls;
// 顶部工作流控制条：保存/加载/清空/撤销重做/执行/结果开关
