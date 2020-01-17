import React from 'react';
import '../css/normalize.css';
import Routers from '../router.js';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import qs from 'qs';
import indexStyle from '../css/index.css';
import List from './List.jsx';
import {Toast } from 'antd-mobile';
import group from '../group.js';
import fetchJsonp from  "fetch-jsonp";

import {connect} from 'react-redux';

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            groupedArray:[],
            isFoot: true,
            isLoading:false,
            i:0,
            n:0,
            length:0,
            value : ''||1,//按设施编号、安装位置模糊查询
            cls:[indexStyle.inputIndex,indexStyle.inputIndexcls],
        }
    }
     //按设施编号、安装位置模糊查询
     getValue = (e) => {
        this.setState({
            value:e.target.value,
        })
    };
    componentDidMount(){
        this.inpValue.value = '';
        document.addEventListener("keypress", this.keypr);
        let that = this;
        $('#but').on("touchstart",function () {                
            $(this).attr("class",that.state.cls[1])            
        })            
        $('#but').on("touchend",function () {                
            $(this).attr("class",that.state.cls[0])            
        });
        this.genData();
        fetchJsonp('https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=13412365478')
          .then(res => res.json())
          .then(data => {
            console.log(data)
        })
    };
    keypr = (e) => {
        if(e.keyCode == '13'){
            e.preventDefault();
            this.genData();
        }
    }
    render(){
        return <div className={indexStyle.bg}>
            <header className={indexStyle.headerbox}>
                <span className={indexStyle.search} onClick={this.search}></span>
                <div className={indexStyle.searchBox}>
                    <input className={indexStyle.inputB} ref={(ref)=>{this.inpValue=ref}} onChange={this.getValue} type="text" placeholder="请输入设备编号，安装位置"/>
                </div>
                <span className={indexStyle.headerspan} onClick={this.tuichu}>退出</span>
            </header>
            <div ref={(ref)=>{this.list=ref}} className={indexStyle.list}>
                {this.renderInfo()}
            </div>
            <footer className={indexStyle.footerIdnex}>
                <div className={indexStyle.addBox}>
                   <Link to='/add'> <input className={indexStyle.inputIndex} id="but" type="button" value="添加设施"/></Link>
                </div>
        </footer>
        <div className={indexStyle.boxShow}></div>
    </div>
    };
    //搜索
    search = () => {
        this.genData();
    };
    genData = () => {
        if(this.state.value !== ''){
            let para = {
                value:this.state.value
            };
            let pa = qs.stringify(para);
                axios({
                    url:'/Falicity/Query',
                    method:"POST",
                    headers:{'accept':'application/json'},
                    data:pa,
                }).then((res)=>{
                   if(res.status == '200'){
                    let data = res.data.data.reverse();
                    let groupedArray = group(data,200);
                    let length = groupedArray.length;
                    if(length <= 0){
                        Toast.info('无数据', 2);
                        return false;
                    }
                    this.setState({
                        groupedArray:groupedArray[this.state.i]||groupedArray[0],
                        length:length,
                        isLoading:false
                    },()=>{
                        this.headerHande()
                    })
                   }
                }).catch((error)=>{
                    Toast.info(error, 2);
                });
                this.inpValue.value = ''
        }
    };
    renderInfo=()=>{
      return <div>
            <div style={{width:"100%"}} ref={(ref)=>{this.lis=ref}}>
                    {this.state.groupedArray.map((item)=>{
                    return  <List {...item} key={item.id}></List>
                })}
        </div>
        <div className={this.state.isLoading?indexStyle.loading:indexStyle.loadingHide}>Loading...</div>
      </div>
    }
    headerHande = () => {
        let that = this;
        var searchBox = document.querySelector('header');
        let listTop = this.list;
        let lisHeight = this.lis.offsetHeight;//页面总高度
        let listHeight = this.list.offsetHeight;//可视区域高度
        console.log(lisHeight+'-------'+listHeight);
        listTop.onscroll = function(){
            var offsetTop = listTop.scrollTop;
            if((offsetTop + listHeight - 30) >= lisHeight && that.state.isFoot ){
                that.setState({
                    isFoot: false,
                    isLoading:true
                },()=>{
                    that.genData();
                })
                if(that.state.i<that.state.length){
                    that.setState({
                        isFoot: true,
                    },() => {
                        that.setState({
                            n:that.state.i++,
                        },()=>{
                            that.genData();
                        })
                    })
                }
                console.log('到达底部'+ that.state.i)
            }else if(offsetTop <= 30){
                that.setState({
                    n:that.state.i --,
                },()=>{
                    that.genData();
                })
                console.log('到达顶部'+ that.state.n)
            }
            var opacity=0;
            if(offsetTop < 80){
                opacity=offsetTop/80;
                searchBox.style.backgroundColor="rgba(6,33,70,"+opacity+")";
            }else if(offsetTop>80){
                searchBox.style.backgroundColor="rgba(6,33,70,1)";
            }
        }
    };
    tuichu = () => {
        void plus.runtime.quit();
    };

}

const mapStateToProps = (state,ownProps) => {
    return {
        props:state.token,
    }
}
export default connect(mapStateToProps)(Home);