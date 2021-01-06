<template>
  <div id="app">
    <vg6 :data="graphData" :options="options" />
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
      // this.graphData = data;
      // this.options = options;
    console.log(this.graphData)

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
