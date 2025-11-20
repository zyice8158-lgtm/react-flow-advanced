import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function LoopNode({ id }) {
  const [loopType, setLoopType] = useState('forEach');
  const [iterations, setIterations] = useState('items.length');

  return (
    <div className="custom-node loop-node">
      <NodeActions nodeId={id} />
      <div className="node-header">
        <div className="header-left">
          <span className="node-icon">🔁</span>
          <span className="node-title">Loop</span>
        </div>
        <button className="icon-btn">⚙️</button>
        <button className="icon-btn close-btn">●</button>
      </div>
      <div className="node-content">
        <div className="field">
          <label className="field-label">Loop Type</label>
        </div>
        <select
          value={loopType}
          onChange={(e) => setLoopType(e.target.value)}
          className="select-input"
        >
          <option value="forEach">FOR EACH</option>
          <option value="map">MAP</option>
          <option value="for">FOR (count)</option>
          <option value="while">WHILE</option>
        </select>

        <div className="field">
          <label className="field-label">Iterations / Array <span className="required">*</span></label>
        </div>
        <input
          type="text"
          value={iterations}
          onChange={(e) => setIterations(e.target.value)}
          className="text-input"
          placeholder="e.g., items, 10, count < 100"
          style={{ marginBottom: '12px' }}
        />

        <div className="loop-info">
          <div className="info-row">
            <span className="info-label">Current Index:</span>
            <code className="info-code">i</code>
          </div>
          <div className="info-row">
            <span className="info-label">Current Item:</span>
            <code className="info-code">item</code>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="loop-body" 
        style={{ top: '40%' }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="complete" 
        style={{ background: '#3b82f6' }} 
      />
    </div>
  );
}

export default LoopNode;
