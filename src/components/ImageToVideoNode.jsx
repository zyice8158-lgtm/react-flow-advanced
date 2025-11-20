import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function ImageToVideoNode({ id }) {
  const [instruction, setInstruction] = useState('psychedelic effects, special effects, illusions, natural movements, cinematic');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  return (
    <div className="custom-node video-node">
      <NodeActions nodeId={id} />
      <div className="node-header">
        <div className="header-left">
          <span className="node-icon">🎬</span>
          <span className="node-title">Image to Video</span>
        </div>
        <button className="icon-btn">⚙️</button>
        <button className="icon-btn close-btn">●</button>
      </div>
      <div className="node-content">
        <div className="field">
          <label className="field-label">Creative Instruction <span className="required">*</span></label>
        </div>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="text-input"
          placeholder="psychedelic effects, special effects, illusions, natural movements, cinematic"
          rows="2"
        />

        <div className="field">
          <label className="field-label">Aspect Ratio</label>
        </div>
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          className="select-input"
        >
          <option value="16:9">16:9</option>
          <option value="1:1">1:1</option>
          <option value="9:16">9:16</option>
        </select>

        <div className="field">
          <label className="field-label">Choose AI Model(s) <span className="required">*</span></label>
        </div>
        <div className="model-selector">
          <button className="add-model-btn">+ Add models</button>
          <div className="selected-model">
            <span>🎬 Runway Gen3</span>
            <button className="remove-btn">⊗</button>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="image" />
      <Handle type="source" position={Position.Right} id="video" />
    </div>
  );
}

export default ImageToVideoNode;

