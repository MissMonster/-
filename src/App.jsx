import React from "react";
import $ from 'jquery';
import axios from 'axios';
import qs from 'qs';
import appstyle from './css/app.css';
import './css/normalize.css';
import { Toast } from 'antd-mobile';
import imgURL from "./img/bigtitle.png";
import Routers from './router.js';
import setAuthToken from './setAuthToken.js';
// 引入解析token方法
// import jwt_decode from 'jwt-decode'

// 实现ui组件和数据连接
// import {connect} from 'react-redux';
import {store} from './store';

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            Img : imgURL,
            username : '',
            password : '',
            isload:true,
            className01:appstyle.loginButton,
            className02:appstyle.clss
        }
    };
    usename(e){
        this.setState({
            username:e.target.value
        })
        this.nam.className = appstyle.cls;
        this.it.className = appstyle.iT;
        this.pwdV.className = "";
        this.ib.className = "";
        this.em.className = ''
    }
    password(e){
        this.setState({
            password:e.target.value
        })
    }
   componentDidMount(){
        this.init();
        if(this.nam.value == ''&&this.pwdV.value == ''){
            this.nam.value = window.localStorage.getItem("user") || "";
            this.pwdV.value = window.localStorage.getItem("pass") || "";
        }
        console.log( this.nam.value+'-----'+this.pwdV.value);
        document.addEventListener("keypress", this.keypr);
        let that = this;
        $('#loginButton').on("touchstart",function () {                
            $(this).attr("class",that.state.className02)            
        })            
        $('#loginButton').on("touchend",function () {                
            $(this).attr("class",that.state.className01)            
        })
   };
    render(){
        return <div className={appstyle.bg}>
                <div className={appstyle.titleBox}>
                    <img src={this.state.Img} alt=""/>
                </div>
                <div className={appstyle.inputBox}>
                    <form action="" method="">
                        <div className={appstyle.inputI} >
                            <span className={appstyle.spanLeft}></span>
                            <input ref={(ref)=>{this.nam=ref}} onClick={this.oNam} onChange={this.usename.bind(this)} type="text" placeholder="请输入用户名"/>
                            <i ref={(ref)=>{this.it=ref}} onClick={this.clear}></i>
                        </div>
                        <div className={appstyle.inputI}>
                            <span className={appstyle.spanRight}></span>
                            <input ref={(ref)=>{this.pwdV=ref}} onClick={this.oPwd} onChange={this.password.bind(this)} type="password" placeholder="请输入密码"/>
                            <em ref={(ref)=>{this.em=ref}}></em>
                            <i ref={(ref)=>{this.ib=ref}} onClick={this.clear}></i>
                        </div>
                        <div className={appstyle.inputI} style={{border:0}}>
                            <input className={this.state.className01} type="button" id="loginButton" value="登录" onClick={this.login}/>
                        </div> 
                    </form>
                </div>
            </div>
    };

    init = () => {
        var eye = this.em;
        var ppw = this.pwdV;
        var a = 0;
        $(eye).click(function(){
            a += 1;
            if(a%2 == 0){
                $(ppw).prop('type','password');
            }else if(a%2 != 0){
                $(ppw).prop('type','text');
            }
        })
    };
    clear = () => {
        this.nam.value = "";
        this.pwdV.value = "";
    };
    oNam = () => {
        this.nam.className = appstyle.cls;
        this.it.className = appstyle.iT;
        this.pwdV.className = "";
        this.ib.className = "";
        this.em.className = ''
    }
    oPwd = () => {
        this.nam.className = "";
        this.pwdV.className = appstyle.cls;
        this.it.className = "";
        this.ib.className = appstyle.iB;
        this.em.className =appstyle.eye;
    }
    keypr = (e) => {
        if(e.keyCode == '13'){
            e.preventDefault();
            var history = this.props.history;
            var namValue = this.nam.value;
            var nocus =()=>{
                this.it.className = appstyle.iT;
                this.nam.focus();
                this.nam.className = appstyle.cls;
                this.pwdV.className ="";
                this.ib.className = "";
                this.em.className = ''
            };
            
            var pewValue = this.pwdV.value;
            var pocus = () =>{
                this.pwdV.focus();
                this.nam.className = '';
                this.pwdV.className = appstyle.cls;
                this.it.className = "";
                this.ib.className = appstyle.iB;
                this.em.className =appstyle.eye;
            };
            let para = {
                username: this.state.username||window.localStorage.getItem("user"),
                pwd: this.state. password||window.localStorage.getItem("pass"),
            };
            let pa = qs.stringify(para);
            store.dispatch(async (dispatch)=>{
                axios({
                    method:"POST",
                    headers:{'accept':' application/json'},
                    url:'/User/Login',
                    data:pa
                }).then((res) => {
                    if(namValue == ''){
                        Toast.info(res.data.message, 2);
                        nocus();
                        return false;
                    } 
                    if(pewValue == ''){
                        Toast.info('请输入密码', 2);
                        pocus();
                        return false;
                    }
                    if(res.data.code == '500'){
                        // if(namValue == ths)
                        Toast.info(res.data.message, 2);
                        nocus();
                        if(res.data.message == "密码不正确"){
                            pocus();
                        }
                        return false;
                    }
                    if(res.data.code == '200'){
                        Toast.info('正在登录...', 2);
                        var token = res.data.token;
                        sessionStorage.setItem('access-user', token); 
                        setAuthToken(token)
                        dispatch(setCurrentUser(token));
                        if(this.nam.value !== '' && this.pwdV.value !== ''){
                            window.localStorage.setItem("user",this.nam.value);
                            window.localStorage.setItem("pass",this.pwdV.value);
                        }
                        history.push('/home');
                    }
                }).catch(function(error){
                    Toast.info('登录失败',2);
                    console.log(error);
                });
                // history.push('/home');
            })
        }
    }
    login = () =>{
        var history = this.props.history;
        var namValue = this.nam.value;
        var nocus =()=>{
            this.it.className = appstyle.iT;
            this.nam.focus();
            this.nam.className = appstyle.cls;
            this.pwdV.className ="";
            this.ib.className = "";
            this.em.className = ''
        };
        
        var pewValue = this.pwdV.value;
        var pocus = () =>{
            this.pwdV.focus();
            this.nam.className = '';
            this.pwdV.className = appstyle.cls;
            this.it.className = "";
            this.ib.className = appstyle.iB;
            this.em.className =appstyle.eye;
        };
        let para = {
            username: this.state.username||window.localStorage.getItem("user"),
            pwd: this.state. password||window.localStorage.getItem("pass"),
        };
        let pa = qs.stringify(para);
        store.dispatch(async (dispatch)=>{
            axios({
                method:"POST",
                headers:{'accept':' application/json'},
                url:'/User/Login',
                data:pa
            }).then((res) => {
                if(namValue == ''){
                    Toast.info(res.data.message, 2);
                    nocus();
                    return false;
                } 
                if(pewValue == ''){
                    Toast.info('请输入密码', 2);
                    pocus();
                    return false;
                }
                if(res.data.code == '500'){
                    // if(namValue == ths)
                    Toast.info(res.data.message, 2);
                    nocus();
                    if(res.data.message == "密码不正确"){
                        pocus();
                    }
                    return false;
                }
                if(res.data.code == '200'){
                    Toast.info('正在登录...', 2);
                    var token = res.data.token;
                    sessionStorage.setItem('access-user', token); 
                    setAuthToken(token)
                    dispatch(setCurrentUser(token));
                    if(this.nam.value !== '' && this.pwdV.value !== ''){
                        window.localStorage.setItem("user",this.nam.value);
                        window.localStorage.setItem("pass",this.pwdV.value);
                    }
                    setTimeout(function(){
                        history.push('/home');
                    },800)
                }
            }).catch(function(error){
                Toast.info('登录失败',2);
                console.log(error);
            });
            // history.push('/home');
        })
    };
}


export const setCurrentUser = (token) =>{
        return {
            type:'GETTOKEN',
            payload:token
        }
}
export default App;

