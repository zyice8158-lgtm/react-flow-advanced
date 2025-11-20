import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function TextSplitterNode({ id }) {
  const [instruction, setInstruction] = useState('Describe how you want the text splitted');

  return (
    <div className="custom-node splitter-node">
      <NodeActions nodeId={id} />
      <div className="node-header">
        <div className="header-left">
          <span className="node-icon">✂️</span>
          <span className="node-title">Text Splitter</span>
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
          placeholder="Describe how you want the text splitted"
          rows="2"
        />
      </div>
      <Handle type="target" position={Position.Left} id="text" />
      <Handle type="source" position={Position.Right} id="text1" style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right} id="text2" style={{ top: '60%' }} />
    </div>
  );
}

export default TextSplitterNode;

