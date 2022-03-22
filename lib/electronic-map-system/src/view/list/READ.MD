<!--
 * @Author: your name
 * @Date: 2022-02-15 11:03:03
 * @LastEditTime: 2022-02-17 15:39:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \dianziditu\src\view\list\READ.MD
-->
<!-- 切换图层 -->
name图层名，唯一标识，url图层地址
1.changMap(name,url）
2.取消图层
name图层名
changMap(name,false）
<!-- 电子围栏 -->
map.vue里面方法
1.绘制多边形方法
    e为地图绘制后返回的
    drawRectange(function(e){})