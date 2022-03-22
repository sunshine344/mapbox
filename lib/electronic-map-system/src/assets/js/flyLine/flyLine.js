import LINE_ICON from "@assets/js/flyLine/line.png";
import Marker from "@assets/js/flyLine/marker.png";

function FlyLineLayer(name, viewer) {
	this.viewer = viewer;
	this.datasource = new Cesium.CustomDataSource(name);
	this.entities = this.datasource.entities;
	viewer.dataSources.add(this.datasource);
	this.entityList = [];

	/*
	    流纹纹理线
	    color 颜色
	    duration 持续时间 毫秒
	 */
	function PolylineTrailLinkMaterialProperty(color, duration) {
		this._definitionChanged = new Cesium.Event();
		this._color = undefined;
		this._colorSubscription = undefined;
		this.color = color;
		this.duration = duration;
		this._time = new Date().getTime();
	}

	function setPolylineTrailLinkSource(type) {
		let ptls = `czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
             czm_material material = czm_getDefaultMaterial(materialInput);\n\
             vec2 st = materialInput.st;\n\
             vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
             material.alpha = colorImage.a * color.a;\n\
             material.diffuse = (color.rgb);\n\
             return material;\n\
         }`; //顺时针(开始点到结束点为顺时针)
		switch (type) {
			case 1:
				ptls = `czm_material czm_getMaterial(czm_materialInput materialInput)\n\
          {\n\
               czm_material material = czm_getDefaultMaterial(materialInput);\n\
               vec2 st = materialInput.st;\n\
               vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
               material.alpha = colorImage.a * color.a;\n\
               material.diffuse = (color.rgb);\n\
               return material;\n\
           }`; //顺时针
				break;
			case 2:
				ptls =
					"czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                        {\n\
                            czm_material material = czm_getDefaultMaterial(materialInput);\n\
                            vec2 st = materialInput.st;\n\
                            vec4 colorImage = texture2D(image, vec2(fract(-(st.s + time)), st.t));\n\
                            material.alpha = colorImage.a * color.a;\n\
                            material.diffuse = (color.rgb);\n\
                            return material;\n\
                        }"; //逆时针
				break;
			case 3:
				ptls =
					"czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                        {\n\
                            czm_material material = czm_getDefaultMaterial(materialInput);\n\
                            vec2 st = materialInput.st;\n\
                            vec4 colorImage = texture2D(image, vec2(fract(-(st.t + time)), st.t));\n\
                            material.alpha = colorImage.a * color.a;\n\
                            material.diffuse = (color.rgb);\n\
                            return material;\n\
                        }"; //由上到下
				break;
			case 4:
				ptls =
					"czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                  {\n\
                      czm_material material = czm_getDefaultMaterial(materialInput);\n\
                      vec2 st = materialInput.st;\n\
                      vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.t));\n\
                      material.alpha = colorImage.a * color.a;\n\
                      material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                      return material;\n\
                  }"; //由下到上
		}
		Cesium.Material.PolylineTrailLinkSource = ptls;
		Cesium.Material._materialCache.addMaterial(
			Cesium.Material.PolylineTrailLinkType, {
				fabric: {
					type: Cesium.Material.PolylineTrailLinkType,
					uniforms: {
						color: new Cesium.Color(1.0, 0, 0, 0.5),
						image: Cesium.Material.PolylineTrailLinkImage,
						time: 0,
					},
					source: Cesium.Material.PolylineTrailLinkSource,
				},
				translucent: function (material) {
					return true;
				},
			}
		);
	}
	Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
		isConstant: {
			get: function () {
				return false;
			},
		},
		definitionChanged: {
			get: function () {
				return this._definitionChanged;
			},
		},
		color: Cesium.createPropertyDescriptor("color"),
	});
	PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
		return "PolylineTrailLink";
	};
	PolylineTrailLinkMaterialProperty.prototype.getValue = function (
		time,
		result
	) {
		if (!Cesium.defined(result)) {
			result = {};
		}
		result.color = Cesium.Property.getValueOrClonedDefault(
			this._color,
			time,
			Cesium.Color.WHITE,
			result.color
		);
		result.image = Cesium.Material.PolylineTrailLinkImage;
		result.time =
			((new Date().getTime() - this._time) % this.duration) / this.duration;
		return result;
	};
	PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
		return (
			this === other ||
			(other instanceof PolylineTrailLinkMaterialProperty &&
				Cesium.Property.equals(this._color, other._color))
		);
	};
	Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
	Cesium.Material.PolylineTrailLinkType = "PolylineTrailLink";
	Cesium.Material.PolylineTrailLinkImage = LINE_ICON;
	setPolylineTrailLinkSource(1);

	function parabolaEquation(options, resultOut) {
		//方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
		let h = options.height;
		let L =
			Math.abs(options.startPoint[0] - options.endPoint[0]) >
			Math.abs(options.startPoint[1] - options.endPoint[1]) ?
			Math.abs(options.startPoint[0] - options.endPoint[0]) :
			Math.abs(options.startPoint[1] - options.endPoint[1]);
		let num = options.num;
		let result = [];
		let dlt = L / num;
		if (
			Math.abs(options.startPoint[0] - options.endPoint[0]) >
			Math.abs(options.startPoint[1] - options.endPoint[1])
		) {
			//以lon为基准
			let delLat = (options.endPoint[1] - options.startPoint[1]) / num;
			if (options.startPoint[0] - options.endPoint[0] > 0) {
				dlt = -dlt;
			}
			for (let i = 0; i < num; i++) {
				let tempH =
					h -
					(Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) / Math.pow(L, 2);
				let lon = options.startPoint[0] + dlt * i;
				let lat = options.startPoint[1] + delLat * i;
				result.push([lon, lat, tempH]);
			}
		} else {
			//以lat为基准
			let delLon = (options.endPoint[0] - options.startPoint[0]) / num;
			if (options.startPoint[1] - options.endPoint[1] > 0) {
				dlt = -dlt;
			}
			for (let i = 0; i < num; i++) {
				let tempH =
					h -
					(Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) / Math.pow(L, 2);
				let lon = options.startPoint[0] + delLon * i;
				let lat = options.startPoint[1] + dlt * i;
				result.push([lon, lat, tempH]);
			}
		}
		if (resultOut != undefined) {
			resultOut = result;
		}
		return result;
	}
	//实体创建
	this.create = function (data) {
		let len = data.length;
		for (let i = 0; i < len; i++) {
			let points = parabolaEquation({
				startPoint: data[i].startPoint,
				endPoint: data[i].endPoint,
				height: data[i].height,
				num: data[i].num,
			});
			let pointArr = [];
			for (let n = 0; n < points.length; n++) {
				pointArr.push(points[n][0], points[n][1], points[n][2]);
			}
			let material = new Cesium.PolylineTrailLinkMaterialProperty(
				// new Cesium.Color.fromCssColorString(data[i].color),
				new Cesium.Color.fromCssColorString(data[i].color),
				data[i].time
			);

			this.entityList.push(
				this.datasource.entities.add({
                    id:i,
                    properties:data[i].properties?data[i].properties:'',
					name: "PolylineTrailLink",
					attr: data[i].attr,
					startPoint: data[i].startPoint,
					endPoint: data[i].endPoint,
					transportType: data[i].transportType,
					details: data[i].details,
					polyline: {
						positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
						width: data[i].width,
						material: material,
					},
				}),


			);
		}
		this.createPoints(data)
		return this.datasource;
	};
	// billboard:{
	//         image:item.img,
	//         pixelOffset:option.billboardpixelOffset?new Cesium.Cartesian2(option.billboardpixelOffset[0],option.billboardpixelOffset[1]):new Cesium.Cartesian2(0,0),//广告牌位移位置
	//         verticalOrigin:Cesium.VerticalOrigin.CENTER,
	//         width:option.width?option.width:_this.fontSize(113),
	//         height:option.height?option.height:_this.fontSize(106),
	//         // pixelOffset:new Cesium.Cartesian2(280,-60),//广告牌位移位置
	//         color: Cesium.Color.WHITE.withAlpha(0.8),
	//         // scaleByDistance: new Cesium.NearFarScalar(2000, 1, 10000, 0.6),//根据广告牌与相机的距离获取或设置广告牌的近和远缩放属性。广告牌的比例将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。超出这些范围时，广告牌的比例将保持在最近的范围内。如果未定义，scaleByDistance将被禁用
	//         pixelOffsetScaleByDistance: new Cesium.NearFarScalar( //据广告牌与摄像头的距离，获取或设置广告牌的近像素偏移量和远像素偏移量缩放属性。广告牌的像素偏移将在 NearFarScalar＃nearValue 和 NearFarScalar＃farValue ，而摄像头距离在上下限之内指定的 NearFarScalar＃near 和 NearFarScalar＃far 代码> 。在这些范围之外，广告牌的像素偏移比例将保持钳位到最近的范围。如果未定义，pixelOffsetScaleByDistance将被禁用。
	//             2000,
	//             1,
	//             10000,
	//             0.2
	//         )
	// },
	//添加label
	this.createLabel = function (data) {
		let len = data.length;
		for (let i = 0; i < len; i++) {
			this.entityList.push(
				this.datasource.entities.add({
					name: "label",
					position: Cesium.Cartesian3.fromDegrees(
						data[i].position[0],
						data[i].position[1]
					),
					point: {
						pixelSize: 6,
						color: Cesium.Color.BLUE,
					},
					label: {
						text: data[i].text,
						scale: data[i].scale,
						fillColor: Cesium.Color.WHITE,
						style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						outlineWidth: 6,
						font: "35px Fira Code Medium",
						pixelOffset: new Cesium.Cartesian2(0, -30),
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						showBackground: true,
						backgroundColor: Cesium.Color.fromCssColorString("#000"),
					},
				})
			);
		}

	};
	this.createPoints = function (data) {
		if (data instanceof Array) {
			data.forEach((item) => {
				this.entityList.push(
					this.datasource.entities.add({
						name: 'linepoint',
						position: Cesium.Cartesian3.fromDegrees(item.startPoint[0], item.startPoint[1], item.startPoint[2] ? item.startPoint[2] : 0),
						billboard: {
							image: Marker,
							verticalOrigin: Cesium.VerticalOrigin.CENTER,
							color: Cesium.Color.fromCssColorString("#00ACFF"),
							width: fontSize(20),
							height: fontSize(20),
						},
						label: {
							text: item.startText ? item.startText : '',
							// scale: data[i].scale,
							fillColor: Cesium.Color.fromCssColorString(item.textColor ? item.textColor : "#000"),
							style: Cesium.LabelStyle.FLL,
							outlineWidth: 6,
							font: "20px Fira Code Medium",
							pixelOffset: new Cesium.Cartesian2(0, -30),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							showBackground: false,
							// backgroundColor: Cesium.Color.fromCssColorString("#000"),
						}

					}),
					this.datasource.entities.add({
						name: 'linepoint',
						position: Cesium.Cartesian3.fromDegrees(item.endPoint[0], item.endPoint[1], item.endPoint[2] ? item.endPoint[2] : 0),
						billboard: {
							image: Marker,
							verticalOrigin: Cesium.VerticalOrigin.CENTER,
							color: Cesium.Color.fromCssColorString("#00ACFF"),
							width: fontSize(20),
							height: fontSize(20),
						},
						label: {
							text: item.endtext ? item.endtext : '',
							// scale: data[i].scale,
							fillColor: Cesium.Color.fromCssColorString(item.textColor ? item.textColor : "#000"),
							style: Cesium.LabelStyle.FLL,
							outlineWidth: 6,
							font: "20px Fira Code Medium",
							pixelOffset: new Cesium.Cartesian2(0, -30),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							showBackground: false,
							// backgroundColor: Cesium.Color.fromCssColorString("#000"),
						}

					})
				)




			})
		}

		function fontSize(res) {
			let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			if (!clientWidth) {
				return res
			}
			return res * (clientWidth / 1920);
		}

	}
	//设置着色器
	this.setPTLS = function (type) {
		setPolylineTrailLinkSource(type);
	};
	//实体显示隐藏
	this.show = function (isShow) {
		this.datasource.show = isShow;
	};
	//实体销毁
	this.destroyed = function () {
		this.entityList.forEach((en) => {
			this.datasource.entities.remove(en);
		});
		this.entityList = [];
	};
}
export default FlyLineLayer;
// map.flyLineLayer.create( [
//     {
//       color: "rgba(233, 226, 23)",//颜色
//       width: 20,//宽度
//       height: 50000,//最大高度
//       time: 3000,//移动时间
//       startPoint: [ 84.71425640407554, 28.414740798285404],//开始点
//       endPoint: [85.22124177443375,  25.306200618942945],//结束点
//       num: 1000,//点位密集度
//     },
//     {
//       color: "rgb(240, 22, 6)",//颜色
//       width: 10,//宽度
//       height: 500000,//最大高度
//       time: 5000,//移动时间
//       startPoint: [ 87.294994715175, 28.52129662633051],//开始点
//       endPoint: [88.72501886864728,  23.902538207133958],//结束点
//       num: 10000,//点位密集度
//     },
//     {
//       color: "rgba(213, 6, 240)",//颜色
//       width: 50,//宽度
//       height: 500000,//最大高度
//       time: 5000,//移动时间
//       startPoint: [92.13408527060605, 30.251395131933617],//开始点
//       endPoint: [92.18407751497747,22.368529762445338],//结束点
//       num: 1000,//点位密集度
//     },
//   ])
