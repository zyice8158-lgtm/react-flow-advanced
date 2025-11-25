export const areGraphEqual = (prevNodes = [], prevEdges = [], nodes = [], edges = []) => {
  const normNodes = (arr) =>
    arr.map(({ id, position, type, data }) => ({ id, position, type, data }))
      .sort((a, b) => (a.id > b.id ? 1 : -1))
  const normEdges = (arr) =>
    arr.map(({ id, source, target, sourceHandle, targetHandle, type, data }) => ({ id, source, target, sourceHandle, targetHandle, type, data }))
      .sort((a, b) => (a.id > b.id ? 1 : -1))

  const aN = JSON.stringify(normNodes(prevNodes))
  const bN = JSON.stringify(normNodes(nodes))
  const aE = JSON.stringify(normEdges(prevEdges))
  const bE = JSON.stringify(normEdges(edges))
  return aN === bN && aE === bE
}

export const viewportEqual = (a = { x: 0, y: 0, zoom: 1 }, b = { x: 0, y: 0, zoom: 1 }) =>
  a.x === b.x && a.y === b.y && a.zoom === b.zoom

