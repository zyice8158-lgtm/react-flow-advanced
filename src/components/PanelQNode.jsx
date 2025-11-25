import NodeActions from './NodeActions'
import './NodeStyles.css'

function PanelQNode({ id, data }) {
  const isFocused = data?.focus === 'Q'
  const letter = data?.letter || 'Q'

  return (
    <div className={`custom-node panel-q-node ${isFocused ? 'focused' : ''}`} onClick={() => { data?.onSetFocus?.(); data?.onSwap?.(); }}>
      <NodeActions nodeId={id} />
      <div className="panel-letter">{letter}</div>
    </div>
  )
}

export default PanelQNode
