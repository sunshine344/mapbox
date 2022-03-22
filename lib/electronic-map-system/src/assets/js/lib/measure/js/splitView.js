/*
 * @Description: file content
 * @Author: xufeng
 * @Date: 2020-01-13 14:16:27
 * @LastEditTime: 2022-02-18 15:28:04
 * @FilePath: \cesium-s3m-demo\src\components\cesiumMap\js\baseControl\splitView.js
 */
/**
 * 卷帘对比
 * SplitView
 */
export default class SplitView {
    constructor(opt){
      if(!opt){
        return false;
      }
      for(let key in opt){
        this[key] = opt[key];
      }
      this.remove();
      this.$slider = document.createElement("div");
      this.$slider.id = "slider";
      this.$slider.style.position = 'absolute';
      this.$slider.style.left = "50%";
      this.$slider.style.top = "0px";
      this.$slider.style.width = "5px";
      this.$slider.style.height = "100%";
      this.$slider.style.backgroundColor = "#D3D3D3";
      this.$slider.style.zIndex = "9999";
      this.dom.appendChild(this.$slider);
      this.init();
    }
    init(){
      let $this = this;
      var layers = this.viewer.imageryLayers;
      // this.layer = layers.addImageryProvider(this.map);
      this.layer =this.map
      this.layer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
      this.viewer.scene.imagerySplitPosition = (this.$slider.offsetLeft) / this.$slider.parentElement.offsetWidth;
      var dragStartX = 0;
      document.getElementById('slider').addEventListener('mousedown', mouseDown, false);
      window.addEventListener('mouseup', mouseUp, false);
      window.addEventListener('mouseout', mouseOut, false);
      function mouseOut(){
          $this.$slider.style.cursor = 'ew-resize';
      }
      function mouseUp() {
          window.removeEventListener('mousemove', sliderMove, true);
      }
      function mouseDown(e) {
          dragStartX = e.clientX - $this.$slider.offsetLeft;
          window.addEventListener('mousemove', sliderMove, true);
      }
      function sliderMove(e) {
          $this.$slider.style.cursor = 'ew-resize';
          var splitPosition = (e.clientX - dragStartX) / $this.$slider.parentElement.offsetWidth;
          $this.$slider.style.left = 100.0 * splitPosition + '%';
          $this.viewer.scene.imagerySplitPosition = splitPosition;
      }
    }
    remove(){
        if(this.$slider){
            this.viewer.imageryLayers.remove(this.layer);
            this.dom.removeChild(this.$slider);
        }   
    }
}
