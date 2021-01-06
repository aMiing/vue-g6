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
      },
      animate: true,
      defaultNode: {
        size: 40,
      },
      defaultEdge: {
        cursor: "pointer",
        style: {
          endArrow: {
            path: 'M 0,0 L 20,-5↵L 13.333333333333334,0 L 20,5 Z',
            d: 0,
          },
        },
      },
}

export default options;