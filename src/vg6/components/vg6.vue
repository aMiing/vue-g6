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
    this.addEvent()
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
          }
          // 先按下shift键，选择第一个对象时，其实应该是单选状态
          const hasSelectedTarget = _this.checkSelectedTarget(ALL_TYPE);

          // 非多选状态
          if (!keydown || !hasSelectedTarget || !multiple) {
            ALL_TYPE.forEach((type) => {
              graph.findAll(type, (combo) => {
                if (combo !== item) {
                  graph.clearItemStates(combo);
                  graph.setItemState(combo, "dark", true);
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
              _this.refreshSelectedStyle(c_type, item, ALL_TYPE);
            }
          }
        },
        onCanvasClick: function onCanvasClick() {
          var _this = this;
          var graph = this.graph;
          ALL_TYPE.forEach(type => {
            graph.findAll(type, combo => {
              graph.clearItemStates(combo)
            })
          })
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

    refreshSelectedStyle(type, item, ALL_TYPE) {
      const graph = this.graph;

      graph.setItemState(item, "dark", false);

      type == "node" &&
        graph.getEdges().forEach(function (edge) {
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
      type == "edge" &&
        (graph.setItemState(item.getTarget(), "dark", false),
        graph.setItemState(item.getSource(), "dark", false),
        graph.setItemState(item.getSource(), "highlight", true),
        graph.setItemState(item.getTarget(), "highlight", true));
      console.log(item)
    },

    checkSelectedTarget(ALL_TYPE) {
      let hasSelectedTarget = false;
      ALL_TYPE.forEach((type) => {
        const length = this.graph.findAllByState(type, 'selected')
          .length;
        length > 0 && (hasSelectedTarget = true);
      });
      console.log("hasSelectedTarget", hasSelectedTarget);
      return hasSelectedTarget
    },
    addEvent(){
      this.graph.on('beforelayout', evt => {
        console.log('beforelayout', evt)
      })

      this.graph.on('afterlayout', evt => {
        console.log('afterlayout', evt)
        this.$emit('afterLayout', this.graph)
      })

      this.graph.on('aftergraphrefresh', evt => {
        console.log('aftergraphrefresh', evt)
      })
    }
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
