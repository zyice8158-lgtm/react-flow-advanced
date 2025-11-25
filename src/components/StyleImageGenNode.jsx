import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function StyleImageGenNode({ id }) {
  const [instruction, setInstruction] = useState('Describe the image subjects and styles');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  return (
    <div className="custom-node image-gen-node">
      <NodeActions nodeId={id} />
      <div className="node-header">
        <div className="header-left">
          <span className="node-icon">🎨</span>
          <span className="node-title">Style Image Gen</span>
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
          placeholder="Describe the image subjects and styles"
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
          <option value="4:3">4:3</option>
        </select>

        <div className="field">
          <label className="field-label">Choose Style(s) <span className="required">*</span></label>
          <span className="badge">+ Upload</span>
        </div>

        <div className="style-images">
          <div className="style-card selected">
            <img src="https://picsum.photos/200/150?random=1" alt="LA Sunshine" className="style-img" />
            <div className="style-name">LA Sunshine</div>
          </div>
          <div className="style-card">
            <img src="https://picsum.photos/200/150?random=2" alt="Sci-fi" className="style-img" />
            <div className="style-name">Sci-fi</div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="text" />
      <Handle type="source" position={Position.Right} id="image" />
    </div>
  );
}

export default StyleImageGenNode;
// 风格图生成节点：接收text生成image，包含风格选择UI
