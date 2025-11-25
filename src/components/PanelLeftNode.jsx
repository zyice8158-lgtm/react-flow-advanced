import { Handle, Position } from 'reactflow'
import NodeActions from './NodeActions'
import './NodeStyles.css'

function PanelLeftNode({ id, data }) {
  const isFocused = data?.focus === 'P'
  const letter = data?.letter || 'P'

  return (
    <div className={`custom-node panel-left-node ${isFocused ? 'focused' : ''}`} onClick={() => { data?.onSetFocus?.(); }}>
      <NodeActions nodeId={id} />
      <div className="panel-buttons">
        <button className="panel-btn" onClick={(e) => { e.stopPropagation(); data?.onContentChange?.('B') }}>B</button>
        <button className="panel-btn" onClick={(e) => { e.stopPropagation(); data?.onContentChange?.('A') }}>A</button>
      </div>
      <div className="panel-letter">{letter}</div>
      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  )
}

export default PanelLeftNode
