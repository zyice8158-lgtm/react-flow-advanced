import React from 'react';
import './ExecutionPanel.css';

const ExecutionPanel = ({ isOpen, onClose, executionResults, isExecuting }) => {
  if (!isOpen) return null;

  return (
    <div className="execution-panel">
      <div className="execution-panel-header">
        <h3>执行结果</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="execution-panel-content">
        {isExecuting && (
          <div className="execution-status">
            <div className="spinner"></div>
            <span>工作流执行中...</span>
          </div>
        )}
        
        {!isExecuting && Object.keys(executionResults).length === 0 && (
          <div className="execution-empty">
            <p>暂无执行结果</p>
            <p className="hint">点击工具栏的"运行"按钮开始执行工作流</p>
          </div>
        )}
        
        {!isExecuting && Object.keys(executionResults).length > 0 && (
          <div className="execution-results">
            {Object.entries(executionResults).map(([nodeId, result]) => (
              <div key={nodeId} className={`result-item ${result.status}`}>
                <div className="result-header">
                  <span className="node-id">{nodeId}</span>
                  <span className={`status-badge ${result.status}`}>
                    {result.status === 'success' ? '✓ 成功' : '✗ 失败'}
                  </span>
                </div>
                
                {result.inputs && Object.keys(result.inputs).length > 0 && (
                  <div className="result-section">
                    <h4>输入</h4>
                    <div className="data-content">
                      {Object.entries(result.inputs).map(([key, value]) => (
                        <div key={key} className="data-item">
                          <span className="data-key">{key}:</span>
                          <span className="data-value">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.outputs && Object.keys(result.outputs).length > 0 && (
                  <div className="result-section">
                    <h4>输出</h4>
                    <div className="data-content">
                      {Object.entries(result.outputs).map(([key, value]) => (
                        <div key={key} className="data-item">
                          <span className="data-key">{key}:</span>
                          <span className="data-value">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.error && (
                  <div className="result-section error">
                    <h4>错误</h4>
                    <div className="error-message">{result.error}</div>
                  </div>
                )}
                
                {result.timestamp && (
                  <div className="result-footer">
                    <span className="timestamp">{new Date(result.timestamp).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionPanel;
