const options = {
    modes: {
        default: [
          "drag-canvas",
          "drag-node",
          "zoom-canvas",
        ],
      },
      layout: {
        type: "gForce",
        preventOverlap: true,
        nodeSize: 40,
        gpuEnabled: true,
        onLayoutEnd: (e) => {
          console.log('layoutend', e)
        }
      },
      animate: true,
      defaultNode: {
        size: 40,
        fill: 'blue'
      },
      nodeStateStyles: {
        highlight: {
          opacity: 1,
        },
        dark: {
          opacity: 0.3,
        },
      },
      defaultEdge: {
        cursor: "pointer",
        stroke: '#6bf',
        style: {
          endArrow: {
            path: 'M 0,0 L 20,-5↵L 13.333333333333334,0 L 20,5 Z',
            d: 0,
          },
        },
      },

      edgeStateStyles: {
        selected: {
          stroke: '#8bf',
          shadowColor: 'blue',
          shadowBlur: 10
        },
        highlight: {
          opacity: 1,
          stroke: '#8bf',
        },
        dark: {
          opacity: 0.3,
        },
      },
}

export default options;