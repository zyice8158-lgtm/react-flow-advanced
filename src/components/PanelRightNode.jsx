import NodeActions from './NodeActions'
import './NodeStyles.css'

function PanelRightNode({ id, data }) {
  const content = data?.activeContent ?? ''

  return (
    <div className="custom-node panel-right-node">
      <NodeActions nodeId={id} />
      <div className="panel-letter big">{content}</div>
    </div>
  )
}

export default PanelRightNode
