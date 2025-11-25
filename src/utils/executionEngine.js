// 节点执行状态
export const ExecutionStatus = {
  IDLE: 'idle',
  RUNNING: 'running',
  SUCCESS: 'success',
  ERROR: 'error',
  WAITING: 'waiting',
};

// 模拟节点执行
export async function executeNode(node, inputs) {
  // 模拟执行延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // 根据节点类型生成输出
  switch (node.type) {
    case 'lyricsInput':
      return { text: node.data.lyrics || '示例歌词文本' };
      
    case 'textToText':
      return { text: `处理后的文本: ${inputs.text || ''}` };
      
    case 'textSplitter': {
      const text = inputs.text || '';
      const mid = Math.floor(text.length / 2);
      return {
        text1: text.slice(0, mid),
        text2: text.slice(mid),
      };
    }
      
    case 'styleImageGen':
      return { image: `生成的图像 (基于: ${inputs.text || ''})` };
      
    case 'imageToVideo':
      return { video: `生成的视频 (基于: ${inputs.image || ''})` };
      
    case 'condition': {
      // 简单条件判断
      const value = inputs.input || '';
      const condition = Math.random() > 0.5; // 随机true/false
      return condition ? { true: value } : { false: value };
    }
      
    case 'loop':
      // 模拟循环
      return {
        'loop-body': inputs.input,
        complete: `循环完成: ${inputs.input}`,
      };
      
    case 'merge': {
      // 合并所有输入
      const merged = Object.values(inputs).join(' + ');
      return { output: merged };
    }
      
    default:
      return { output: '未知节点类型' };
  }
}

// 获取节点的输入数据
export function getNodeInputs(node, edges, nodeResults) {
  const inputs = {};
  
  // 找到所有指向该节点的边
  const incomingEdges = edges.filter(edge => edge.target === node.id);
  
  for (const edge of incomingEdges) {
    const sourceResult = nodeResults[edge.source];
    if (sourceResult && sourceResult.outputs) {
      // 从源节点的输出中获取对应handle的数据
      const outputData = sourceResult.outputs[edge.sourceHandle];
      if (outputData !== undefined) {
        inputs[edge.targetHandle] = outputData;
      }
    }
  }
  
  return inputs;
}

// 拓扑排序，确定节点执行顺序
export function getExecutionOrder(nodes, edges) {
  const adjacencyList = new Map();
  const inDegree = new Map();
  
  // 初始化
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  
  // 构建图
  edges.forEach(edge => {
    adjacencyList.get(edge.source).push(edge.target);
    inDegree.set(edge.target, inDegree.get(edge.target) + 1);
  });
  
  // 拓扑排序
  const queue = [];
  const order = [];
  
  // 找到所有入度为0的节点（起始节点）
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });
  
  while (queue.length > 0) {
    const nodeId = queue.shift();
    order.push(nodeId);
    
    // 减少相邻节点的入度
    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach(neighborId => {
      const newDegree = inDegree.get(neighborId) - 1;
      inDegree.set(neighborId, newDegree);
      if (newDegree === 0) {
        queue.push(neighborId);
      }
    });
  }
  
  // 检查是否有循环
  if (order.length !== nodes.length) {
    throw new Error('检测到循环依赖，无法执行工作流');
  }
  
  return order;
}

// 执行整个工作流
export async function executeWorkflow(nodes, edges, onNodeStart, onNodeComplete, onNodeError) {
  const nodeResults = {};
  
  try {
    // 获取执行顺序
    const executionOrder = getExecutionOrder(nodes, edges);
    
    // 按顺序执行每个节点
    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;
      
      try {
        // 通知开始执行
        if (onNodeStart) onNodeStart(nodeId);
        
        // 获取输入
        const inputs = getNodeInputs(node, edges, nodeResults);
        
        // 执行节点
        const outputs = await executeNode(node, inputs);
        
        // 保存结果
        nodeResults[nodeId] = {
          status: ExecutionStatus.SUCCESS,
          inputs,
          outputs,
          timestamp: new Date().toISOString(),
        };
        
        // 通知执行完成
        if (onNodeComplete) onNodeComplete(nodeId, outputs);
        
      } catch (error) {
        // 执行出错
        nodeResults[nodeId] = {
          status: ExecutionStatus.ERROR,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
        
        if (onNodeError) onNodeError(nodeId, error);
        throw error; // 停止执行
      }
    }
    
    return nodeResults;
    
  } catch (error) {
    console.error('工作流执行失败:', error);
    throw error;
  }
}
