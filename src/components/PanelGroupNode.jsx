// 组合节点：左侧(P+A/B按钮)与右侧大面板(显示A/B)，拖动整体移动
import { Handle, Position, useReactFlow } from 'reactflow'
import NodeActions from './NodeActions'
import './NodeStyles.css'
import { getModeClass } from '../utils/panelUtils'

function PanelGroupNode({ id, data, selected }) {
  const isFocusedP = data?.focus === 'P'
  const letterP = data?.letterP || 'P'
  const content = data?.activeContent ?? ''
  const { setNodes } = useReactFlow()

  const modeClass = getModeClass(content)

  return (
    <div className={`custom-node panel-group-node ${modeClass} ${selected ? 'selected-node' : ''}`}>
      <NodeActions nodeId={id} />
      <div
        className={`group-left ${isFocusedP ? 'focused' : ''}`}
        onMouseDown={(e) => { e.stopPropagation(); setNodes((nds)=> nds.map(n => ({ ...n, selected: n.id === id }))) }}
        onClick={() => { data?.onSetFocusP?.(); }}
      >
        <div className="panel-buttons">
          <button className="panel-btn" onClick={(e) => { e.stopPropagation(); data?.onToggle?.('B') }}>B</button>
          <button className="panel-btn" onClick={(e) => { e.stopPropagation(); data?.onToggle?.('A') }}>A</button>
        </div>
        <div className="panel-letter">{letterP}</div>
      </div>
      {content && (
        <div
          className="group-right"
          onMouseDown={(e) => { e.stopPropagation(); setNodes((nds)=> nds.map(n => ({ ...n, selected: n.id === id }))) }}
        >
          <div className="panel-letter big">{content}</div>
        </div>
      )}
      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  )
}

export default PanelGroupNode
