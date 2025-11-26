// Panel组状态钩子：集中管理A/B切换、焦点与P/Q内容互换，并提供inject注入节点data
import { useCallback, useState } from 'react'

export function usePanelGroup() {
  const [contentChoice, setContentChoice] = useState('A')
  const [focusTarget, setFocusTarget] = useState('P')
  const [leftLetter, setLeftLetter] = useState('P')
  const [qLetter, setQLetter] = useState('Q')

  const toggleContent = useCallback((c) => {
    setContentChoice((prev) => (prev === c ? '' : c))
  }, [])

  const focusP = useCallback(() => setFocusTarget('P'), [])
  const focusQ = useCallback(() => setFocusTarget('Q'), [])

  const swapPQ = useCallback(() => {
    setLeftLetter((prevLeft) => {
      const oldLeft = prevLeft
      setQLetter(oldLeft)
      return qLetter
    })
  }, [qLetter])

  const inject = useCallback(
    (nds, setNodes) =>
      nds.map((node) => {
        if (node.type === 'panelGroup') {
          return {
            ...node,
            dragHandle: '.group-left, .group-right',
            style: { ...(node.style || {}), pointerEvents: 'none' },
            data: {
              ...node.data,
              onToggle: toggleContent,
              onSetFocusP: focusP,
              focus: focusTarget,
              letterP: leftLetter,
              activeContent: contentChoice,
            },
          }
        }
        if (node.type === 'panelQ') {
          return {
            ...node,
            data: {
              ...node.data,
              onSetFocus: focusQ,
              onSwap: swapPQ,
              onHoverIn: () =>
                setNodes((nds2) =>
                  nds2.map((n) =>
                    n.id === node.id
                      ? { ...n, style: { ...(n.style || {}), zIndex: 1000 } }
                      : n
                  )
                ),
              onHoverOut: () =>
                setNodes((nds2) =>
                  nds2.map((n) =>
                    n.id === node.id
                      ? { ...n, style: { ...(n.style || {}), zIndex: undefined } }
                      : n
                  )
                ),
              focus: focusTarget,
              letter: qLetter,
            },
          }
        }
        return node
      }),
    [toggleContent, focusP, focusQ, swapPQ, focusTarget, leftLetter, contentChoice, qLetter]
  )

  return { inject }
}
