// 文本到文本节点：输入提示、选择模型，左右句柄为text
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function TextToTextNode({ id }) {
  const [instruction, setInstruction] = useState(`Task:
You are a professional pop music MV director, specializing in psychedelic and experimental artistic visual styles. Please...`);

  return (
    <div className="custom-node task-node">
      <NodeActions nodeId={id} />
      <div className="node-header">
        <div className="header-left">
          <span className="node-icon">📄</span>
          <span className="node-title">Text to Text</span>
        </div>
        <button className="icon-btn">⚙️</button>
        <button className="icon-btn close-btn">●</button>
      </div>
      <div className="node-content">
        <div className="field">
          <label className="field-label">Creative Instruction <span className="required">*</span></label>
          <button className="add-pdf-btn">📄 Add PDF</button>
        </div>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="text-input"
          placeholder="Task:"
          rows="3"
        />

        <div className="field">
          <label className="field-label">Choose AI Model(s) <span className="required">*</span></label>
        </div>
        <div className="model-selector">
          <button className="add-model-btn">+ Add models</button>
          <div className="selected-model">
            <span>✏️ Grok2</span>
            <button className="remove-btn">⊗</button>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="text" />
      <Handle type="source" position={Position.Right} id="text" />
    </div>
  );
}

export default TextToTextNode;
