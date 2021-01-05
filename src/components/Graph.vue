<template>
  <div id="container" ref="container">
  </div>
</template>

<script>
import G6 from "@antv/g6";
import gData from "./mock";

export default {
  name: "graphComponent",
  props: {},
  data: () => {
    return {
      test: "test",
    };
  },
  computed: {
    width(){
      return this.$refs.container.offsetWidth || 600
    },
    height(){
       return this.$refs.container.offsetHeight || 600
    }
  },
  mounted() {
    console.log(G6.Layout);
    console.log("data", gData);
    this.initGraph();
  },
  methods: {
    initGraph() {
      this.graph = new G6.Graph({
        container: "container",
        width: this.width,
        height: this.height,
        modes: {
          default: ["drag-canvas", "drag-node", "zoom-canvas", "click-select"],
        },
        layout: {
          type: "gForce",
          linkDistance: 50,
          center: [this.width / 2, this.height / 2],
        },
        // animate: true,
        defaultNode: {
          size: 30,
        },
      });
      this.graph.data(gData);
      this.graph.render();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right:0;
}
</style>
