import React from 'react';
import qs from 'qs';
import axios from 'axios';
import Routers from '../router.js';
import $ from 'jquery';
import '../css/normalize.css';
import editSatyle from '../css/edit.css';
import {  Modal, WhiteSpace,Toast } from 'antd-mobile';
const prompt = Modal.prompt;
import { Link,withRouter } from 'react-router-dom';

class Edit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            id:this.props.match.params.id,//设施Id
            no:'',//设置编号
            installPosition:'',//安装位置
            lng:'',//经度(高德坐标GCJ02)
            lat:'',//纬度(高德坐标GCJ02)
            remark:'',//备注(设施其他相关信息)
            msg:'',
            fileName:'',
            cls:[editSatyle.inputbc,editSatyle.inputbcls],
            closePh:editSatyle.closePh,
            passWorld:'198715'
        }
    }
componentDidMount(){
    //双击退出应用
        //调用h5+
        // 监听“返回”按钮事件
    plus.key.addEventListener("backbutton", () => {
        this.props.history.go(-1)
    }); // 在这里调用plus api
    let para = {
        id:this.state.id
    };
    let pa = qs.stringify(para);
        axios({
            url:'/Falicity/QueryById',
            method:"POST",
            headers:{'accept':'application/json'},
            data:pa,
        }).then((res)=>{
           if(res.status == '200'){
            let data = res.data.data;
            this.setState({
                no:data.no,//设置编号
                installPosition:data.installPosition,//安装位置
                lng:data.lng,//经度(高德坐标GCJ02)
                lat:data.lat,//纬度(高德坐标GCJ02)
                remark:data.remark,//备注(设施其他相关信息)
                msg:data.lng+'-'+data.lat,
                fileName:data.fileName
            })
           }
        }).catch((error)=>{
            Toast.info(error, 2);
        });

        let that = this;
        $('#update').on("touchstart",function () {                
            $(this).attr("class",that.state.cls[1])            
        })            
        $('#update').on("touchend",function () {                
            $(this).attr("class",that.state.cls[0])            
        });
        $('#prompt').on("touchstart",function () {                
            $(this).attr("class",that.state.cls[1])            
        })            
        $('#prompt').on("touchend",function () {                
            $(this).attr("class",that.state.cls[0])            
        })
};
renderInfo=()=>{
            return <div className={editSatyle.sectionAdd}>
            <div className={editSatyle.inputBox}>
                <label className={editSatyle.labelAdd}>* 设施编号&nbsp;:</label>
                <input className={editSatyle.inputAdd} type="text" value={this.state.no} onChange={this.onChange} />
            </div>
            <div className={editSatyle.inputBox}>
                <label className={editSatyle.labelAdd}>* 安装位置&nbsp;:</label>
                <input className={editSatyle.inputAdd} type="text" value={this.state.installPosition} onChange={this.installChange}/>
            </div>
            <div className={editSatyle.inputBox}>
                <label className={editSatyle.labelAdd}>* 获取经纬度&nbsp;:</label>
                <input className={editSatyle.inputAdd} type="text" value={this.state.msg} readOnly />
                <span className={editSatyle.spanI} onClick={this.getlandL}></span>
            </div>
            <div className={editSatyle.inputBox}>
                <label className={editSatyle.labelAdd}>&nbsp;&nbsp;&nbsp;备注&nbsp;：</label>
                <input className={editSatyle.inputAdd} type="text" value={this.state.remark} onChange={this.remarkChange}/>
            </div>
            <div className={editSatyle.photoBoxBig}>
                <span className={this.state.closePh} onClick={this.delPic}></span> 
                <div className={editSatyle.photoBox} onClick={this.photo} id="image-list">
                    <img src={"http://115.29.230.26:8888/rsc/"+this.state.fileName} style={{height:"100%"}} alt=""/>
                </div>
            </div>
        </div>
}
 //删除照片
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
                     html += '<div><img src="'+picUrl+'" style="width:100%;height:100%;"/></div>'; 
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
delPic = () => {
    let parId = {
        id:this.state.id,
    };
    let paId = qs.stringify(parId);
    axios({
        method:"POST",
        headers:{'accept':' application/json'},
        url:'/Falicity/DeleteFile',
        data:paId
    }).then((res)=>{
        if(res.status == '200'){
            Toast.info("删除成功", 2);
            console.log(res)
        }
    }).catch((error)=>{
        Toast.info("删除失败", 2);
    });
 }

onChange = (e) => {
   this.setState({
       no:e.target.value
   })
}
installChange = (e) => {
    this.setState({
        installPosition:e.target.value
    })
}
getlandL = () => {
    navigator.geolocation.getCurrentPosition(this.showPosition);
}
showPosition = (position) => {
    this.setState({
        lng:position.coords.longitude,
        lat:position.coords.latitude,
        msg:position.coords.longitude +'-'+ position.coords.latitude
    },()=>{
        msg:this.state.msg
    })
}
remarkChange = (e) => {
    this.setState({
        remark:e.target.value
    })
}

    render(){
        return <div className={editSatyle.bg}>
            <header className={editSatyle.headerAdd}>
                <div className={editSatyle.back}><span className={editSatyle.spanBack}></span><tt onClick={this.Back} className={editSatyle.aBack} href="#">返回</tt></div>
                <div className={editSatyle.title}>编辑设施</div>
            </header>
            {this.renderInfo()}

            <div className={editSatyle.footerAdd}>
                <div className={editSatyle.addBox}>
                    <input className={editSatyle.inputbc} type="button" id="update" onClick={(event) =>{ this.update();this.upPic()}} value="保存"/>
                </div>
            </div>
             <div className={editSatyle.addBox}>
                <WhiteSpace/><input className={editSatyle.inputbc} id="prompt" style={{color:"#fff", border:'0'}} onClick={() => prompt('确定删除吗?',
                '如果确定请在下方输入密码：',
                password =>this.dell(password),
                '删除',
                )}
                type="button" value="删除"/>
            </div>
        </div>
    };
    //删除
    dell = (password) => {
       if(password == this.state.passWorld){
            let parId = {
                id:this.state.id
            };
            let paId = qs.stringify(parId);
            axios({
                url:'/Falicity/Delete',
                method:"POST",
                headers:{'accept':'application/json'},
                data:paId
            }).then((res)=>{
                if(res.status == '200'){
                    Toast.info("删除成功", 2);
                    this.props.history.push('/home');
                }
            }).catch((error)=>{
                Toast.info("删除失败", 2);
            });
       }else{
            Toast.info("密码错误", 2);
       }
    }
    // //更新保存
    update = () => {
        var history = this.props.history;
        if(this.state.no !== ''){
            let parId = {
                id:this.state.id,
                no:this.state.no,
                installPosition:this.state.installPosition,
                lng:this.state.lng,
                lat:this.state.lat,
                remark:this.state.remark,
            };
            let paId = qs.stringify(parId);
            axios({
                method:"POST",
                headers:{'accept':' application/json'},
                url:'/Falicity/Update',
                data:paId
            }).then(function(res){
                if(res.status == '200'){
                    Toast.info("更新成功", 2);
                    history.push('/home');
                }
            }).catch(function(error){
                Toast.info("更新失败", 2);
            });
        }else{
            Toast.info("不能为空", 2);
        }
    };
    upPic = () => {
        var history = this.props.history;
        let formData = new FormData();
        formData.append('file',this.state.file)
        let url = "/Falicity/SaveFile?id=" + this.state.id
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        axios.post(url,formData,config).then(
            res=>{
                if(res.status == '200'){
                    Toast.info("数据添加成功", 2);
                   console.log(res);
                    history.push('/home');
                }
            },
            err=>{
                Toast.info(err, 2);
            }
        ).catch((error)=>{
            Toast.info("数据保存失败", 2);
        });            
    }
    //返回
    Back = () => {
        this.props.history.go(-1);
    };
    componentWillUnmount(){
        plus.key.removeEventListener("backbutton", () => {
            this.props.history.go(-1)
        }); // 在这里调用plus api
    }
}
export default withRouter(Edit)