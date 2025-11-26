// Panel组状态钩子：集中管理A/B切换、焦点与P/Q内容互换，并提供inject注入节点data
import { useCallback, useState } from 'react'

export function usePanelGroup() {
  const [groupContent, setGroupContent] = useState({})
  const [groupFocus, setGroupFocus] = useState({})
  const [groupLeftLetter, setGroupLeftLetter] = useState({})
  const [qLetters, setQLetters] = useState({})

  const toggleContent = useCallback((groupId, c) => {
    setGroupContent((prev) => ({ ...prev, [groupId]: prev[groupId] === c ? '' : c }))
  }, [])

  const focusP = useCallback((groupId) => {
    setGroupFocus((prev) => ({ ...prev, [groupId]: 'P' }))
  }, [])

  const focusQ = useCallback((groupId) => {
    setGroupFocus((prev) => ({ ...prev, [groupId]: 'Q' }))
  }, [])

  const swapPQ = useCallback((groupId, qId) => {
    setGroupLeftLetter((prevLeft) => {
      const oldLeft = prevLeft[groupId] ?? 'P'
      const newLeft = qLetters[qId] ?? 'Q'
      setQLetters((prevQ) => ({ ...prevQ, [qId]: oldLeft }))
      return { ...prevLeft, [groupId]: newLeft }
    })
  }, [qLetters])

  const nearestGroupId = (qNode, groups) => {
    const qc = qNode.position
    let best = null
    let bestDist = Infinity
    for (const g of groups) {
      const gc = g.position
      const dx = (qc?.x ?? 0) - (gc?.x ?? 0)
      const dy = (qc?.y ?? 0) - (gc?.y ?? 0)
      const d = dx * dx + dy * dy
      if (d < bestDist) { bestDist = d; best = g.id }
    }
    return best ?? groups[0]?.id
  }

  const inject = useCallback(
    (nds, setNodes) => {
      const groups = nds.filter((n) => n.type === 'panelGroup')
      return nds.map((node) => {
        if (node.type === 'panelGroup') {
          const groupId = node.id
          const content = groupContent[groupId] ?? ''
          const focus = groupFocus[groupId] ?? 'P'
          const left = groupLeftLetter[groupId] ?? 'P'
          return {
            ...node,
            dragHandle: '.group-left, .group-right',
            style: { ...(node.style || {}), pointerEvents: 'none' },
            data: {
              ...node.data,
              onToggle: (c) => toggleContent(groupId, c),
              onSetFocusP: () => focusP(groupId),
              focus,
              letterP: left,
              activeContent: content,
            },
          }
        }
        if (node.type === 'panelQ') {
          const qId = node.id
          const groupId = node.data?.groupId ?? nearestGroupId(node, groups)
          const qLetter = qLetters[qId] ?? 'Q'
          const focus = groupFocus[groupId] ?? 'P'
          return {
            ...node,
            data: {
              ...node.data,
              groupId,
              onSetFocus: () => focusQ(groupId),
              onSwap: () => swapPQ(groupId, qId),
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
              focus,
              letter: qLetter,
            },
          }
        }
        return node
      })
    },
    [groupContent, groupFocus, groupLeftLetter, qLetters, toggleContent, focusP, focusQ, swapPQ]
  )

  return { inject }
}
