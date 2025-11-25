import { useReactFlow } from 'reactflow';
import './NodePalette.css';

const nodeTemplates = [
  { type: 'lyricsInput', label: 'Lyrics Input', icon: '📝', color: '#fecaca' },
  { type: 'textToText', label: 'Text to Text', icon: '📄', color: '#86efac' },
  { type: 'textSplitter', label: 'Text Splitter', icon: '✂️', color: '#86efac' },
  { type: 'styleImageGen', label: 'Style Image Gen', icon: '🎨', color: '#93c5fd' },
  { type: 'imageToVideo', label: 'Image to Video', icon: '🎬', color: '#fda4af' },
  { type: 'condition', label: 'Condition', icon: '🔀', color: '#fbbf24' },
  { type: 'loop', label: 'Loop', icon: '🔁', color: '#a78bfa' },
  { type: 'merge', label: 'Merge', icon: '🔗', color: '#34d399' },
  { type: 'panelLeft', label: 'Panel P', icon: '🅿️', color: '#60a5fa' },
  { type: 'panelQ', label: 'Panel Q', icon: '🇶', color: '#f59e0b' },
  { type: 'panelRight', label: 'Right Panel', icon: '🅰️', color: '#3b82f6' },
  { type: 'panelGroup', label: 'Panel Group', icon: '🧩', color: '#3b82f6' },
];

function NodePalette() {
  const { setNodes } = useReactFlow();

  const addNode = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {},
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="node-palette">
      <div className="palette-header">
        <span className="palette-title">📦 Add Nodes</span>
      </div>
      <div className="palette-content">
        {nodeTemplates.map((template) => (
          <button
            key={template.type}
            className="palette-node-btn"
            onClick={() => addNode(template.type)}
            style={{ borderColor: template.color }}
            title={`Add ${template.label}`}
          >
            <span className="palette-node-icon">{template.icon}</span>
            <span className="palette-node-label">{template.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NodePalette;
