import React from 'react';
import axios from 'axios';
import Routers from '../router.js';
import { Link,withRouter } from 'react-router-dom';
import qs from 'qs';
import $ from 'jquery';
import '../css/normalize.css';
import  fetchJsonp  from  "fetch-jsonp";
import coordtransform from 'coordtransform';
import chaicon from '../img/fuwuqi.png';
import mapStyle from '../css/map.css';

import {Toast} from 'antd-mobile';


class Gckmap extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            longitude:'',
            latitude:'',
            gpsPoint:'',
            map:null,
            cls:[mapStyle.clickMapCls,mapStyle.clickMap]
        }
    };
    componentDidMount() {
        plus.key.addEventListener("backbutton", () => {
            this.props.history.go(-1)
        }); // 在这里调用plus api
        let paraId = {
            id:this.props.match.params.id
        };
        let paId = qs.stringify(paraId);
        axios({
            url:'/Falicity/QueryById',
            method:"POST",
            headers:{'accept':'application/json'},
            data:paId,
        }).then((res)=>{
            if(res.status == '200'){
                let data = res.data.data;
                fetchJsonp('https://restapi.amap.com/v3/assistant/coordinate/convert?parameters&key=55eb65bb8c098e4991add05e7140e867&locations='+data.lng+','+ data.lat+'&coordsys=gps')
                .then(res => res.json())
                .then((response) => {
                    let locations= response.locations.split(",");
                    this.setState({
                        longitude:locations[0],
                        latitude:locations[1]
                    },()=>{
                        console.log(this.state.longitude+'终1点'+this.state.latitude);
                        this.getPosition();
                    })
                },(err) => {
                    Toast.info(err, 2);
                }).catch((error) => {
                    Toast.info(error, 2);
                  });
            }
        }).catch((error)=>{
            Toast.info(error, 2);
        });
    };
    getPosition = () => {
        return navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    gpsPoint:coordtransform.wgs84togcj02(position.coords.longitude,position.coords.latitude)
                },()=>{
                    this.mapRen();
                });
            }
        ) 
    }
    mapRen = () => {
        var that = this;
        that.state.map = new AMap.Map('container',{
            center:that.state.gpsPoint,
            resizeEnable: true,
            zoom:15
        })
        
        that.state.map.plugin(["AMap.ToolBar"],function(){//工具条
            let toolopt = {
                offset :new AMap.Pixel(10,150)
            };
            var toolbar  = new AMap.ToolBar(toolopt);
            that.state.map.addControl(toolbar);
        })
        var marker;
        var icon = new AMap.Icon({//定义标记符号
            image:"http://vdata.amap.com/icons/b18/1/2.png",
            size:new AMap.Size(24,24)
        });
        marker = new AMap.Marker({
            offset:new AMap.Pixel(-12,-12),
            zIndex:101,
            map:that.state.map
        });
        //创建机箱位置
        new AMap.Marker({		        
            map: that.state.map,				
            position: new AMap.LngLat(that.state.longitude, that.state.latitude),
            // position: new AMap.LngLat(121.478593,31.238643),
            icon: new AMap.Icon({            		            
                size: new AMap.Size(40, 40),  //图标大小		            
                image: chaicon,		            
                imageOffset: new AMap.Pixel(0, 0)		        
            })        		    
        });
       
         //根据起始位置规划路线
         let pos = that.state.gpsPoint;
         let lng = pos[0];
         let lat  = pos[1];
         //构造路线导航类
        var driving = new AMap.Driving({
            map: that.state.map,
            policy:AMap.DrivingPolicy.LEAST_TIME
        });
        if(driving)
            driving.clearMap;
        // 根据起终点经纬度规划驾车导航路线
        driving.search(new AMap.LngLat(lng,lat), new AMap.LngLat(that.state.longitude, that.state.latitude), function(status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            console.log(result);
            if (status === 'complete') {
                console.log('绘制驾车路线完成')
            } else {
                console.log('获取驾车数据失败：' + result)
            }
            button.onclick = function(){
                driving.searchOnAMAP({
                    origin:result.origin,
                    destination:result.destination,
                });
            } 
        });
        var button = document.getElementById('callApp');
        $('#callApp').on("touchstart",function () {                
            $(this).attr("class",that.state.cls[0])            
        })            
        $('#callApp').on("touchend",function () {                
            $(this).attr("class",that.state.cls[1])            
        })
         //输入提示
         var autoOptions = {
            input:"tipinput"
        };
        var auto = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
            map:that.state.map
        });//构造地点查询
        AMap.event.addListener(auto,"select",select);//注册监听，选中某条触发
        function select(e){
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);//关键字查询
        }
        addCloudLayer();  //叠加云数据图层
        function addCloudLayer() {
             //加载云图层插件
            that.state.map.plugin('AMap.CloudDataLayer', function() {
            var layerOptions = {
                query: {keywords: ''},
                clickable: true
            };
            var cloudDataLayer = new AMap.CloudDataLayer('5dac09267bbf1941810a8285', layerOptions); //实例化云图层类
            cloudDataLayer.setMap(that.state.map); //叠加云图层到地图
            AMap.event.addListener(cloudDataLayer, 'click', function(result) {
                var clouddata = result.data;
                var photo = [];
                let picId = clouddata._id;
                let para = {
                id:picId
            };
            let pa = qs.stringify(para);
                axios({
                    url:'/Falicity/QueryById',
                    method:"POST",
                    headers:{'accept':'application/json'},
                    data:pa,
                }).then((res)=>{
                   if(res.status == '200'){
                        let img = res.data.data.fileName;
                        console.log(img);
                        if(img !== ''){
                            photo = ['<img style="width:90px;height:70px" src="' + 'http://115.29.230.26:8888/rsc/'+img + '"/><br>'];
                        }
                        imgShow(photo)
                   }
                }).catch((error)=>{
                    Toast.info(error, 2);
                });
                function imgShow(){
                    var infoWindow = new AMap.InfoWindow({
                        content: "<font class='title'>设备编号：" + clouddata._name + "</font><hr/>" + photo.join("") + "地址：" + clouddata._address + "<br />" + "创建时间：" + clouddata._createtime + "<br />" + "更新时间：" + clouddata._updatetime,
                        size: new AMap.Size(0, 0),
                        autoMove: true,
                        offset: new AMap.Pixel(0, -25)
                    });
                    infoWindow.open(that.state.map, clouddata._location);
                }
            });
        })
        }
    }  
  
    render(){
        return<div>
        <div style={{height:"100vh",width:"100%"}} id="container"></div>
        <div className={mapStyle.searchBox}>
            <span className={mapStyle.goIndex} onClick={this.goIndex}></span>
            <input type="text" id="tipinput"  className={mapStyle.searchIput} placeholder="请输入关键字"/>
        </div>
        <div className={mapStyle.mapBox}>
            <div className={mapStyle.clickMap} id='callApp'>点击高德地图导航</div>
        </div>
    </div>
    }
    goIndex = () => {
        this.props.history.go(-1);
    }
    
    componentWillUnmount(){
        plus.key.removeEventListener("backbutton", () => {
            this.props.history.go(-1)
        }); // 在这里调用plus api
    }
}

export default withRouter(Gckmap)