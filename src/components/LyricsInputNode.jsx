import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeActions from './NodeActions';
import './NodeStyles.css';

function LyricsInputNode({ id, data }) {
  const [lyrics, setLyrics] = useState(`Here is an original R&B song that captures the essence of the millennial generation's zeitgeist, ennui, with a touch of technological futurism and psychedelic elements:
(Digital Dreamscape)

Verse 1
In the glow of my screen, I feel so serene,
But the emptiness inside, it's like a silent scream.`);

  const executionStatus = data?.executionStatus;

  return (
    <div className="custom-node lyrics-node" data-execution-status={executionStatus}>
      <NodeActions nodeId={id} />
      {executionStatus && (
        <div className={`execution-badge ${executionStatus}`}>
          {executionStatus === 'running' && '⏳'}
          {executionStatus === 'success' && '✓'}
          {executionStatus === 'error' && '✗'}
        </div>
      )}
      <div className="node-header">
        <span className="node-icon">📝</span>
        <span className="node-title">Paste your lyrics here...</span>
      </div>
      <div className="node-content">
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          className="lyrics-input"
          placeholder="Here is an original R&B song that captures the essence of the millennial generation's zeitgeist..."
          rows="8"
        />
      </div>
      <Handle type="source" position={Position.Right} id="text" />
    </div>
  );
}

export default LyricsInputNode;

