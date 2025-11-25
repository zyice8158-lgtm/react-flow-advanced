// 独立黄色节点：显示Q，点击切换焦点并触发与P的内容互换
import NodeActions from './NodeActions'
import './NodeStyles.css'

function PanelQNode({ id, data, selected }) {
  const isFocused = data?.focus === 'Q'
  const letter = data?.letter || 'Q'

  return (
    <div className={`custom-node panel-q-node ${isFocused ? 'focused' : ''} ${selected ? 'selected-node' : ''}`} onClick={() => { data?.onSetFocus?.(); data?.onSwap?.(); }}>
      <NodeActions nodeId={id} />
      <div className="panel-letter">{letter}</div>
    </div>
  )
}

export default PanelQNode
