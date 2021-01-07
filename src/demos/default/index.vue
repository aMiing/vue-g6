<template>
  <div id="app">
    <vg6 :data="graphData" :options="options" @afterLayout="afterLayout" />
  </div>
</template>

<script>
import data from "../mock";
import options from "./options";

export default {
  name: "vg6Page",

  data() {
    return {
      graphData: data,
      options: options,
    };
  },
  mounted(){
    console.log(this.graphData)

  },
  methods: {
    afterLayout(graph){
      console.log(graph)
      this.graph = graph;
      console.log(this.graph.getNodes())
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
