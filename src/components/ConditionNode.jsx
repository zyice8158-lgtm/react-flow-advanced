import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function ConditionNode({ id }) {
  const [condition, setCondition] = useState('item.score > 80');
  const [operator, setOperator] = useState('if');

  return (
    <div className="custom-node condition-node">
      <NodeActions nodeId={id} />
      <div className="node-header">
        <div className="header-left">
          <span className="node-icon">🔀</span>
          <span className="node-title">Condition</span>
        </div>
        <button className="icon-btn">⚙️</button>
        <button className="icon-btn close-btn">●</button>
      </div>
      <div className="node-content">
        <div className="field">
          <label className="field-label">Operator</label>
        </div>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="select-input"
        >
          <option value="if">IF</option>
          <option value="switch">SWITCH</option>
          <option value="filter">FILTER</option>
        </select>

        <div className="field">
          <label className="field-label">Condition <span className="required">*</span></label>
        </div>
        <textarea
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="text-input"
          placeholder="e.g., item.score > 80"
          rows="2"
        />

        <div className="condition-info">
          <span className="info-badge">💡 Tip: Use JavaScript expressions</span>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true" 
        style={{ top: '35%', background: '#22c55e' }} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false" 
        style={{ top: '65%', background: '#ef4444' }} 
      />
    </div>
  );
}

export default ConditionNode;
