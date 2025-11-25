import { useReactFlow } from 'reactflow';

function NodeActions({ nodeId }) {
  const { getNode, setNodes, setEdges } = useReactFlow();

  // 复制节点
  const handleCopy = (e) => {
    e.stopPropagation();
    const node = getNode(nodeId);
    if (!node) return;

    const newNode = {
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // 保存节点数据
  const handleSave = (e) => {
    e.stopPropagation();
    const node = getNode(nodeId);
    if (!node) return;

    const nodeData = {
      ...node,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(nodeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `node-${nodeId}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 删除节点
  const handleDelete = (e) => {
    e.stopPropagation();
    
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  return (
    <div className="node-actions-wrapper">
      <div className="node-actions">
        <button
          className="action-btn copy-btn"
          onClick={handleCopy}
          title="复制节点"
        >
          📋
        </button>
        <button
          className="action-btn save-btn"
          onClick={handleSave}
          title="保存节点"
        >
          💾
        </button>
        <button
          className="action-btn delete-btn"
          onClick={handleDelete}
          title="删除节点"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default NodeActions;
// 节点动作条：复制/保存/删除等通用按钮
