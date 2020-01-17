import React from "react";
import indexStyle from '../css/index.css';
import Routers from '../router.js';
import { Link,withRouter } from 'react-router-dom';




class List extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }
    render(){
            return <div className={indexStyle.boxItem}>
            <div className={indexStyle.boxLeft}>
                <table className={indexStyle.tableBox}>
                <tbody>
                    <tr>
                        <td className={indexStyle.firdtTd}></td>
                        <td className={indexStyle.tdCom}>设施编号&nbsp;:&nbsp;&nbsp;{this.props.no}；</td>
                    </tr>
                    <tr>
                        <td className={indexStyle.twoTd}></td>
                        <td className={indexStyle.tdCom}>安装位置&nbsp;:&nbsp;&nbsp;{this.props.installPosition}；</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className={indexStyle.tdCom}>定位&nbsp;:&nbsp;&nbsp;{this.props.lng}-{this.props.lat}；</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className={indexStyle.treeTd}>备注&nbsp;:&nbsp;&nbsp;{this.props.remark}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div className={indexStyle.boxRight}>
                <span className={indexStyle.editbox} onClick={this.goEdit}></span>
                <span className={indexStyle.navBox} onClick={this.goMap}></span>
            </div>
        </div>
    }
    // //编辑
    goEdit = () => {
        this.props.history.push('/edit/' + this.props.id);
    };
    goMap = () => {
        this.props.history.push('/gckmap/' + this.props.id);
    }
}

export default withRouter(List)
