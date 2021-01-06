<template>
  <div id="container" ref="container"></div>
</template>

<script>
import G6 from "@antv/g6";
import config from "./config";

export default {
  name: "vg6",
  props: {
    data: {
      default: () => {},
      type: Object,
    },
    options: {
      default: () => {},
      type: Object,
    },
  },
  data: () => {
    return {
      test: "test",
    };
  },
  watch: {
    data: {
      handler(newV) {
        console.log("newV", newV);
        this.graph.refresh();
      },
      deep: true,
    },
    options: {
      handler(newV) {
        console.log("newV", newV);
        this.graph.paint();
      },
      deep: true,
    },
  },
  computed: {
    width() {
      return this.$refs.container.offsetWidth || 600;
    },
    height() {
      return this.$refs.container.offsetHeight || 600;
    },
  },
  mounted() {
    console.log(G6.Layout);
    console.log("data", this.data);
    this.initGraph();
  },
  methods: {
    initGraph() {
      const mergedOption = this.mergeOption();
      console.log("mergedOption", mergedOption);
      this.graph = new G6.Graph(mergedOption);
      this.graph.read(this.data);
    },
    mergeOption() {
      this.initBehavior();

      const options = Object.assign(
        {
          container: "container",
          width: this.width,
          height: this.height,
        },
        config,
        this.options
      );

      options.modes.default.push("click-select-item");
      return options;
    },
    initPlugin() {
      let plugins = [];
      if (this.toolbar && this.toolbar.content) {
        const toolbar = new G6.ToolBar();
        plugins.push(toolbar);
      }
      const menu = new G6.Menu({
        itemTypes: ["node", "edge", "combo", "canvas"],
        // getContent:
      });
      plugins.push(menu);
      return plugins;
    },
    initBehavior() {
      const _this = this;
      var DEFAULT_TRIGGER = "shift";
      const ALL_TYPE = ["node", "edge", "combo"];
      G6.registerBehavior("click-select-item", {
        getDefaultCfg() {
          return {
            multiple: true,
            trigger: DEFAULT_TRIGGER,
            selectedState: "selected",
          };
        },
        getEvents() {
          return {
            "node:click": "onClick",
            "edge:click": "onClick",
            "combo:click": "onClick",
            "canvas:click": "onCanvasClick",
            keyup: "onKeyUp",
            keydown: "onKeyDown",
          };
        },
        onClick: function onClick(evt) {
          var self = this;
          var item = evt.item;

          if (!item || item.destroyed) {
            return;
          }

          var c_type = item.getType();
          console.log("type", c_type);
          var graph = self.graph,
            keydown = self.keydown,
            multiple = self.multiple,
            shouldUpdate = self.shouldUpdate,
            shouldBegin = self.shouldBegin;

          if (!shouldBegin.call(self, evt)) {
            return;
          } // allow to select multiple nodes but did not press a key || do not allow the select multiple nodes

          if (!keydown || !multiple) {
            ALL_TYPE.forEach((type) => {
              graph
                .findAllByState(type, self.selectedState)
                .forEach((combo) => {
                  console.log("combo", combo);
                  if (combo !== item) {
                    graph.setItemState(combo, self.selectedState, false);
                  }
                });
            });
          }

          if (item.hasState(self.selectedState)) {
            if (shouldUpdate.call(self, evt)) {
              graph.setItemState(item, self.selectedState, false);
            }
          } else {
            if (shouldUpdate.call(self, evt)) {
              graph.setItemState(item, self.selectedState, true);
              // 更新选中样式
              _this.refreshSelectedStyle(c_type, item);
            }
          }
        },
        onCanvasClick: function onCanvasClick() {
          var _this = this;

          var graph = this.graph;
          graph.getNodes().forEach((node) => {
            graph.clearItemStates(node);
          });

          graph.getEdges().forEach((edge) => {
            graph.clearItemStates(edge);
          });

          graph.getCombos().forEach((combo) => {
            graph.clearItemStates(combo);
          });
        },
        onKeyDown: function onKeyDown(e) {
          var self = this;
          var code = e.key;

          if (!code) {
            return;
          }

          if (
            code.toLowerCase() === this.trigger.toLowerCase() ||
            code.toLowerCase() === "control"
          ) {
            self.keydown = true;
          } else {
            self.keydown = false;
          }
        },
        onKeyUp: function onKeyUp() {
          var self = this;
          self.keydown = false;
        },
      });
    },

    refreshSelectedStyle(type, item) {
      const graph = this.graph;
      graph.setAutoPaint(false);

      graph.getNodes().forEach(function (node) {
        graph.setItemState(node, "highlight", false);
        graph.setItemState(node, "dark", true);
      });
      graph.getEdges().forEach(function (node) {
        graph.setItemState(node, "highlight", false);
        graph.setItemState(node, "dark", true);
      });

      graph.setItemState(item, "dark", false);
      // graph.setItemState(item, "highlight", true);

      type == 'node' && graph.getEdges().forEach(function (edge) {
        if (edge.getSource() === item) {
          graph.setItemState(edge.getTarget(), "dark", false);
          graph.setItemState(edge.getTarget(), "highlight", true);
          graph.setItemState(edge, "highlight", true);
          edge.toFront();
        } else if (edge.getTarget() === item) {
          graph.setItemState(edge.getSource(), "dark", false);
          graph.setItemState(edge.getSource(), "highlight", true);
          graph.setItemState(edge, "highlight", true);
          edge.toFront();
        } else {
          graph.setItemState(edge, "highlight", false);
        }
      });
      type == 'edge' && (graph.setItemState(item.getTarget(), "dark", false),
          graph.setItemState(item.getTarget(), "highlight", true), 
          graph.setItemState(item.getSource(), "dark", false),
          graph.setItemState(item.getSource(), "highlight", true))
      graph.paint();
      graph.setAutoPaint(true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
