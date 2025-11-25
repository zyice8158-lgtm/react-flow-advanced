// 定义Handle类型
export const HandleTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DATA: 'data',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  ANY: 'any',
};

// 定义节点配置
export const NodeConfig = {
  lyricsInput: {
    outputs: [
      { id: 'text', type: HandleTypes.TEXT, label: '文本输出' },
    ],
  },
  textToText: {
    inputs: [
      { id: 'text', type: HandleTypes.TEXT, label: '文本输入', required: true },
    ],
    outputs: [
      { id: 'text', type: HandleTypes.TEXT, label: '文本输出' },
    ],
  },
  textSplitter: {
    inputs: [
      { id: 'text', type: HandleTypes.TEXT, label: '文本输入', required: true },
    ],
    outputs: [
      { id: 'text1', type: HandleTypes.TEXT, label: '文本1' },
      { id: 'text2', type: HandleTypes.TEXT, label: '文本2' },
    ],
  },
  styleImageGen: {
    inputs: [
      { id: 'text', type: HandleTypes.TEXT, label: '文本输入', required: true },
    ],
    outputs: [
      { id: 'image', type: HandleTypes.IMAGE, label: '图像输出' },
    ],
  },
  imageToVideo: {
    inputs: [
      { id: 'image', type: HandleTypes.IMAGE, label: '图像输入', required: true },
    ],
    outputs: [
      { id: 'video', type: HandleTypes.VIDEO, label: '视频输出' },
    ],
  },
  condition: {
    inputs: [
      { id: 'input', type: HandleTypes.ANY, label: '输入', required: true },
    ],
    outputs: [
      { id: 'true', type: HandleTypes.ANY, label: 'True' },
      { id: 'false', type: HandleTypes.ANY, label: 'False' },
    ],
  },
  loop: {
    inputs: [
      { id: 'input', type: HandleTypes.ANY, label: '输入', required: true },
    ],
    outputs: [
      { id: 'loop-body', type: HandleTypes.ANY, label: '循环体' },
      { id: 'complete', type: HandleTypes.ANY, label: '完成' },
    ],
  },
  merge: {
    inputs: [
      { id: 'input-1', type: HandleTypes.ANY, label: '输入1' },
      { id: 'input-2', type: HandleTypes.ANY, label: '输入2' },
      { id: 'input-3', type: HandleTypes.ANY, label: '输入3' },
    ],
    outputs: [
      { id: 'output', type: HandleTypes.ANY, label: '输出' },
    ],
  },
};

// 类型兼容性检查
export function isCompatible(sourceType, targetType) {
  // ANY类型兼容所有类型
  if (sourceType === HandleTypes.ANY || targetType === HandleTypes.ANY) {
    return true;
  }
  
  // 相同类型兼容
  if (sourceType === targetType) {
    return true;
  }
  
  // 特殊兼容规则
  // TEXT可以转换为任何类型（作为输入）
  if (sourceType === HandleTypes.TEXT) {
    return true;
  }
  
  return false;
}

// 获取Handle类型
export function getHandleType(nodeType, handleId, isSource) {
  const config = NodeConfig[nodeType];
  if (!config) return HandleTypes.ANY;
  
  const handles = isSource ? config.outputs : config.inputs;
  if (!handles) return HandleTypes.ANY;
  
  const handle = handles.find(h => h.id === handleId);
  return handle ? handle.type : HandleTypes.ANY;
}

// 验证连接
export function validateConnection(sourceNode, sourceHandle, targetNode, targetHandle) {
  const errors = [];
  
  // 获取类型
  const sourceType = getHandleType(sourceNode.type, sourceHandle, true);
  const targetType = getHandleType(targetNode.type, targetHandle, false);
  
  // 类型兼容性检查
  if (!isCompatible(sourceType, targetType)) {
    errors.push(`类型不匹配：${sourceType} → ${targetType}`);
  }
  
  // 防止自连接
  if (sourceNode.id === targetNode.id) {
    errors.push('不能连接到自己');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sourceType,
    targetType,
  };
}

// 获取类型对应的颜色
export function getTypeColor(type) {
  switch (type) {
    case HandleTypes.TEXT:
      return '#86efac';
    case HandleTypes.IMAGE:
      return '#93c5fd';
    case HandleTypes.VIDEO:
      return '#fda4af';
    case HandleTypes.AUDIO:
      return '#c4b5fd';
    case HandleTypes.DATA:
      return '#fde047';
    case HandleTypes.BOOLEAN:
      return '#fdba74';
    case HandleTypes.NUMBER:
      return '#a78bfa';
    case HandleTypes.ANY:
      return '#d1d5db';
    default:
      return '#9ca3af';
  }
}
// 连接校验：定义各节点句柄类型与兼容规则，提供validateConnection
