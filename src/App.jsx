// 应用入口页面：注册节点类型、初始化React Flow画布与执行/历史/连接等交互逻辑
import 'reactflow/dist/style.css';
import './App.css';

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
} from 'reactflow';

import ImageToVideoNode from './components/ImageToVideoNode';
import LyricsInputNode from './components/LyricsInputNode';
import StyleImageGenNode from './components/StyleImageGenNode';
import TextSplitterNode from './components/TextSplitterNode';
import TextToTextNode from './components/TextToTextNode';
import ConditionNode from './components/ConditionNode';
import LoopNode from './components/LoopNode';
import MergeNode from './components/MergeNode';
import EditableEdge from './components/EditableEdge';
import NodePalette from './components/NodePalette';
import WorkflowControls from './components/WorkflowControls';
import ExecutionPanel from './components/ExecutionPanel';
import { useHistory } from './hooks/useHistory';
import { validateConnection } from './utils/nodeValidation';
import { executeWorkflow, ExecutionStatus } from './utils/executionEngine';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePanelGroup } from './hooks/usePanelGroup';
import PanelQNode from './components/PanelQNode';
import PanelGroupNode from './components/PanelGroupNode';

// Register custom node types
const nodeTypes = {
  lyricsInput: LyricsInputNode,
  textToText: TextToTextNode,
  textSplitter: TextSplitterNode,
  styleImageGen: StyleImageGenNode,
  imageToVideo: ImageToVideoNode,
  condition: ConditionNode,
  loop: LoopNode,
  merge: MergeNode,
  panelQ: PanelQNode,
  panelGroup: PanelGroupNode,
};

// Register custom edge types
const edgeTypes = {
  editable: EditableEdge,
};

// Initial nodes
const initialNodes = [
  {
    id: 'panel-group',
    type: 'panelGroup',
    position: { x: 80, y: 80 },
    data: {},
  },
  {
    id: 'panel-q',
    type: 'panelQ',
    position: { x: 90, y: 300 },
    data: {},
  },
];

// Initial edges
const initialEdges = [];

function Flow() {
  const {
    nodes: historyNodes,
    edges: historyEdges,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useHistory(initialNodes, initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(historyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(historyEdges);
  const panelGroup = usePanelGroup();
  
  // 使用ref来跟踪是否是程序触发的更新
  const isInternalUpdate = useRef(false);

  // 当历史记录改变时更新节点和边
  useEffect(() => {
    isInternalUpdate.current = true;
    setNodes(historyNodes);
    setEdges(historyEdges);
    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 0);
  }, [historyNodes, historyEdges, setNodes, setEdges]);

  useEffect(() => {
    setNodes((nds) => panelGroup.inject(nds, setNodes))
  }, [panelGroup.inject, setNodes])

  // 监听节点和边的变化，记录到历史
  useEffect(() => {
    if (!isInternalUpdate.current) {
      const timer = setTimeout(() => {
        pushHistory(nodes, edges);
      }, 300); // 防抖300ms
      return () => clearTimeout(timer);
    }
  }, [nodes, edges, pushHistory]);

  const onConnect = useCallback(
    (params) => {
      // 添加动画和样式
      const newEdge = {
        ...params,
        type: 'editable',
        animated: true,
        data: { label: 'text' },
        style: { stroke: '#86efac', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // 连接验证状态
  const [connectionError, setConnectionError] = useState(null);
  
  // 执行相关状态
  const [executionResults, setExecutionResults] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionPanelOpen, setExecutionPanelOpen] = useState(false);
  const [nodeStatuses, setNodeStatuses] = useState({});

  // 验证连接是否有效
  const isValidConnection = useCallback((connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return false;
    
    const validation = validateConnection(
      sourceNode,
      connection.sourceHandle,
      targetNode,
      connection.targetHandle
    );
    
    if (!validation.valid) {
      setConnectionError(validation.errors.join(', '));
      setTimeout(() => setConnectionError(null), 3000);
      return false;
    }
    
    setConnectionError(null);
    return true;
  }, [nodes]);
  
  // 执行工作流
  const handleExecute = useCallback(async () => {
    setIsExecuting(true);
    setExecutionPanelOpen(true);
    setExecutionResults({});
    setNodeStatuses({});
    
    try {
      await executeWorkflow(
        nodes,
        edges,
        // onNodeStart
        (nodeId) => {
          setNodeStatuses(prev => ({ ...prev, [nodeId]: ExecutionStatus.RUNNING }));
          // 更新节点样式
          setNodes(nds => nds.map(node => 
            node.id === nodeId 
              ? { ...node, data: { ...node.data, executionStatus: ExecutionStatus.RUNNING } }
              : node
          ));
        },
        // onNodeComplete
        (nodeId, outputs) => {
          setNodeStatuses(prev => ({ ...prev, [nodeId]: ExecutionStatus.SUCCESS }));
          setExecutionResults(prev => ({
            ...prev,
            [nodeId]: {
              status: ExecutionStatus.SUCCESS,
              outputs,
              timestamp: new Date().toISOString(),
            }
          }));
          // 更新节点样式
          setNodes(nds => nds.map(node => 
            node.id === nodeId 
              ? { ...node, data: { ...node.data, executionStatus: ExecutionStatus.SUCCESS } }
              : node
          ));
        },
        // onNodeError
        (nodeId, error) => {
          setNodeStatuses(prev => ({ ...prev, [nodeId]: ExecutionStatus.ERROR }));
          setExecutionResults(prev => ({
            ...prev,
            [nodeId]: {
              status: ExecutionStatus.ERROR,
              error: error.message,
              timestamp: new Date().toISOString(),
            }
          }));
          // 更新节点样式
          setNodes(nds => nds.map(node => 
            node.id === nodeId 
              ? { ...node, data: { ...node.data, executionStatus: ExecutionStatus.ERROR } }
              : node
          ));
        }
      );
    } catch (error) {
      console.error('工作流执行失败:', error);
      alert('工作流执行失败: ' + error.message);
    } finally {
      setIsExecuting(false);
      // 清除节点状态
      setTimeout(() => {
        setNodes(nds => nds.map(node => ({ 
          ...node, 
          data: { ...node.data, executionStatus: undefined } 
        })));
      }, 2000);
    }
  }, [nodes, edges, setNodes]);

  // 键盘快捷键删除选中的节点和连接线
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // 检查是否在输入框中
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        
        event.preventDefault();
        
        // 删除选中的节点
        setNodes((nds) => nds.filter((node) => !node.selected));
        // 删除选中的连接线
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setNodes, setEdges]);

  return (
    <div className="react-flow-container">
      <WorkflowControls 
        resetHistory={resetHistory}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExecute={handleExecute}
        isExecuting={isExecuting}
        onToggleExecutionPanel={() => setExecutionPanelOpen(!executionPanelOpen)}
      />
      <NodePalette />
      <ExecutionPanel
        isOpen={executionPanelOpen}
        onClose={() => setExecutionPanelOpen(false)}
        executionResults={executionResults}
        isExecuting={isExecuting}
      />
      {connectionError && (
        <div className="connection-error">
          ⚠️ {connectionError}
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        
        minZoom={0.2}
        maxZoom={2}
        fitView
        connectionMode="loose"
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#86efac', strokeWidth: 2 }}
        snapToGrid={true}
        snapGrid={[15, 15]}
        selectNodesOnDrag={false}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        defaultEdgeOptions={{
          type: 'editable',
          animated: true,
          data: { label: 'text' },
          style: { stroke: '#86efac', strokeWidth: 2 },
        }}
      >
        <Background patternColor="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
