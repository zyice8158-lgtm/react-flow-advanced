// Panel工具：根据内容A/B/空返回样式模式类名
export const getModeClass = (content) => {
  if (content === 'A') return 'a-visible'
  if (content === 'B') return 'b-visible'
  return 'collapsed'
}
