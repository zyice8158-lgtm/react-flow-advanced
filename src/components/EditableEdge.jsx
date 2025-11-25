import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from 'reactflow';

function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [label, setLabel] = useState(data?.label || 'text');

  const onLabelChange = (evt) => {
    setLabel(evt.target.value);
  };

  const onLabelBlur = () => {
    setIsEditing(false);
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: { ...edge.data, label },
          };
        }
        return edge;
      })
    );
  };

  const onLabelClick = (evt) => {
    evt.stopPropagation();
    setIsEditing(true);
  };

  const onKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      evt.target.blur();
    }
  };

  const onDelete = (evt) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="nodrag nopan"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={onLabelChange}
              onBlur={onLabelBlur}
              onKeyDown={onKeyDown}
              autoFocus
              className="edge-label-input"
              style={{
                padding: '6px 12px',
                border: '2px solid #ef4444',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                outline: 'none',
                background: 'white',
                minWidth: '60px',
                textAlign: 'center',
              }}
            />
          ) : (
            <>
              <div
                onClick={onLabelClick}
                className="edge-label-display"
                style={{
                  padding: '6px 12px',
                  border: '2px solid #ef4444',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#1f2937',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  minWidth: '50px',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#dc2626';
                  e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {label}
              </div>
              {(isHovered || selected) && (
                <button
                  onClick={onDelete}
                  className="edge-delete-btn"
                  style={{
                    width: '22px',
                    height: '22px',
                    padding: '0',
                    border: 'none',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#dc2626';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ef4444';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="删除连接线"
                >
                  ×
                </button>
              )}
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default EditableEdge;
// 自定义可编辑边：支持标签、删除等交互
