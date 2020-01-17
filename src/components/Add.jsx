import React from 'react';
import Routers from '../router.js';
import $ from 'jquery';
import ReactTypes from 'prop-types';
import '../css/normalize.css';
import axios from 'axios';
import addSatyle from '../css/add.css';
import { Link,withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile';

class Add extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            no:'',//设施编号
            installPosition:'',//安装位置
            lng:'',//经度
            lat:'',//纬度
            remark:'',//备注
            file:'',//文件
            msg:'',
            closePh:addSatyle.closePh,
            cls:[addSatyle.inputbc,addSatyle.inputbcls]
        };
    };
    facil = (e) => {
        this.setState({
            no:e.target.value,
        })
    };
    posi = (e) => {
        this.setState({
            installPosition:e.target.value,
        })
    };
    rem = (e) => {
        this.setState({
            remark:e.target.value,
        })
    };

    //获取经纬度
    getlandL = () => {
        navigator.geolocation.getCurrentPosition(this.showPosition);
    };
    showPosition = (position) =>{
        this.setState({
            lng:position.coords.longitude,
            lat:position.coords.latitude,
            msg:position.coords.longitude +'-'+ position.coords.latitude
        },function(){
            msg:this.state.msg
        })
    };
    componentDidMount(){
        //双击退出应用
        //调用h5+
        // 监听“返回”按钮事件
        plus.key.addEventListener("backbutton", () => {
            this.props.history.go(-1)
        }); // 在这里调用plus api

        let that = this;
        $('#button').on("touchstart",function () {                
            $(this).attr("class",that.state.cls[1])            
        })            
        $('#button').on("touchend",function () {                
            $(this).attr("class",that.state.cls[0])            
        })
    };
    render(){
        return <div className={addSatyle.bg}>
            <header className={addSatyle.headerAdd}>
                <div className={addSatyle.back}><span className={addSatyle.spanBack}></span><u onClick={this.back} className={addSatyle.aBack}>返回</u></div>
                <div className={addSatyle.title}>添加设施</div>
            </header>
            <div className={addSatyle.sectionAdd}>
                <div className={addSatyle.inputBox}>
                    <label className={addSatyle.labelAdd}>* 设施编号&nbsp;:</label>
                    <input className={addSatyle.inputAdd} onChange={this.facil} type="text"/>
                </div>
                <div className={addSatyle.inputBox}>
                    <label className={addSatyle.labelAdd}>* 安装位置&nbsp;:</label>
                    <input className={addSatyle.inputAdd} onChange={this.posi} type="text"/>
                </div>
                <div className={addSatyle.inputBox}>
                    <label className={addSatyle.labelAdd}>* 获取经纬度&nbsp;:</label>
                    <input className={addSatyle.inputAdd} value={this.state.msg} readOnly type="text"/>
                    <span className={addSatyle.spanI} onClick={this.getlandL}></span>
                </div>
                <div className={addSatyle.inputBox}>
                    <label className={addSatyle.labelAdd}>&nbsp;&nbsp;&nbsp;备注&nbsp;：</label>
                    <input className={addSatyle.inputAdd} onChange={this.rem} type="text"/>
                </div>
               <div className={addSatyle.photoBoxBig} onClick={this.delPic}>
                    <span className={this.state.closePh}></span> 
                    <div className={addSatyle.photoBox} id="image-list" onClick={this.photo}>
                    </div>
               </div>
        </div>
            <div className={addSatyle.footerAdd}>
                <div className={addSatyle.addBox}>
                    <input className={addSatyle.inputbc} id="button" onClick={this.addRTest} type="button" value="保存"/>
                </div>
            </div>
        </div>
    }
     //删除照片
    //拍照
    //点击事件，弹出选择摄像头和相册选项
    photo = (event) => {
        event.stopPropagation();
       var bts = [
           {title:"拍照"},
           {title:"从相册选择"}
        ];
        plus.nativeUI.actionSheet({
            cancel:"取消",
            buttons:bts
        },(e) => {
            if(e.index == 1){
                this.getImage();//调用摄像头
            }else if(e.index == 2){
                this.galleryImgs();//选择照片
            }
        })
    };
     //从相册选择照片  
     galleryImgs = () => {
         plus.gallery.pick((e) => {
             var name = e.substr(e.lastIndexOf('/') + 1);
             console.log(name);
             this.compressImage(e,name);//压缩图片
         },(e) => {  
         },{
            filter: "image"
         })
     };
     //调用手机摄像头并拍照
     getImage = () => {
         var cmr = plus.camera.getCamera();
         cmr.captureImage((p) => {
            plus.io.resolveLocalFileSystemURL(p,(entry) => {
                this.compressImage(entry.toLocalURL(),entry.name);
            },(e) => {
                plus.nativeUI.toast("读取拍照文件错误：" + e.message);
            });
         },(e) => {},{
            filter: 'image' 
         })
     };
     //压缩图片
     compressImage = (url,filename) => {
        var name = "_doc/upload/"+filename;
        plus.zip.compressImage({
            src:url,//src: (String 类型 )压缩转换原始图片的路径    
            dst:name,//压缩转换目标图片的路径    
            quality:50,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100    
            overwrite:true,//overwrite: (Boolean 类型 )覆盖生成新文件
            height:'50%',   
            width:'70%'
        },(zip)=>{
            this.showPics(zip.target,name);  //显示图片
        },(error)=>{
            plus.nativeUI.toast("压缩图片失败，请稍候再试");   
        })
     };
     //显示图片
     showPics = (url,name) => {//根据路径读取文件
        plus.io.resolveLocalFileSystemURL(url,(entry)=>{
            entry.file((file) => {
                var fileReader = new plus.io.FileReader(); 
                fileReader.readAsDataURL(file); 
                fileReader.onloadend = (e) => {  
                    var picUrl = e.target.result.toString();
                    var imgFile = this.dataURLtoFile(picUrl);
                    this.setState({
                        file:imgFile
                    });
                    console.log(imgFile.size)
                     var html = '';
                     html += '<div>';  
                     html += '<div><img src="'+picUrl+'"style="width:100%;height:100%;"/></div>'; 
                     html += '</div>';
                     html += $('#image-list').html(html); 
                     $('#image-list').html(html); 
                }
            })
        })
     };
     dataURLtoFile = (dataurl, filename = 'file') => {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {
            type: mime
        })
     };
    
    //  删除
    //  delPic = (id) => {
    //     var index = this.state.file.findIndex(item => {
    //         if(item.id == id){
    //             return true
    //         }
    //     })
    //     this.state.file.splice(index,1)
    //  }
    //后退
    back = () => {
        this.props.history.go(-1)
    };
    //保存
    addRTest = () => {
        let formData = new FormData();
        formData.append('file',this.state.file)
        let history = this.props.history;
        let url = "/Falicity/Add?no=" + this.state.no + 
            "&installPosition=" + this.state.installPosition +
            "&lng=" + (Number(this.state.lng)).toFixed(6) +
            "&lat=" + (Number(this.state.lat)).toFixed(6) +
            "&remark=" + this.state.remark;
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        axios.post(url,formData,config).then(
            res=>{
                if(res.status == '200'){
                    Toast.info("数据添加成功", 2);
                    if(res.data.code == '500'){
                        Toast.info(res.data.message, 1);
                    }
                    history.push('/home');
                }
            },
            err=>{
                Toast.info(err, 2);
            }
        ).catch((error)=>{
            Toast.info("数据保存失败", 2);
        });         
    };
    componentWillUnmount(){
        plus.key.removeEventListener("backbutton", () => {
            this.props.history.go(-1)
        }); // 在这里调用plus api
    }
}
export default withRouter(Add)