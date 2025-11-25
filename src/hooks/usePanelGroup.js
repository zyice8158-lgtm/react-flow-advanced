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
    (nds) =>
      nds.map((node) => {
        if (node.type === 'panelGroup') {
          return {
            ...node,
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
