import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function MergeNode({ id }) {
  const [mergeType, setMergeType] = useState('concat');
  const [inputCount] = useState(3);

  return (
    <div className="custom-node merge-node">
      <NodeActions nodeId={id} />
      <div className="node-header">
        <div className="header-left">
          <span className="node-icon">🔗</span>
          <span className="node-title">Merge</span>
        </div>
        <button className="icon-btn">⚙️</button>
        <button className="icon-btn close-btn">●</button>
      </div>
      <div className="node-content">
        <div className="field">
          <label className="field-label">Merge Strategy</label>
        </div>
        <select
          value={mergeType}
          onChange={(e) => setMergeType(e.target.value)}
          className="select-input"
        >
          <option value="concat">CONCAT (array)</option>
          <option value="merge">MERGE (object)</option>
          <option value="zip">ZIP (parallel)</option>
          <option value="race">RACE (first)</option>
          <option value="all">ALL (wait all)</option>
        </select>

        <div className="merge-info">
          <span className="info-badge">
            📊 Inputs: {inputCount}
          </span>
        </div>
      </div>
      
      {/* Multiple input handles */}
      {[...Array(inputCount)].map((_, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index + 1}`}
          style={{ top: `${30 + index * 20}%` }}
        />
      ))}
      
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

export default MergeNode;
