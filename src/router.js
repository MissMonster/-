import React from 'react';
import {HashRouter as Router , Route , Switch} from 'react-router-dom';
import { createBrowserHistory } from "history";

import App from './App.jsx';
import Home from './components/Home.jsx';
import Add from './components/Add.jsx';
import Edit from './components/Edit.jsx';
import List from './components/List.jsx';
import Gckmap from './components/Gckmap.jsx';

export default class Routers extends React.Component{
    render(){
        return(
            <Router history={createBrowserHistory()}>
                <Switch>
                    <Route exact path="/" component={App}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/list" component={List}/>
                    <Route path="/edit/:id" component={Edit}/>
                    <Route path="/gckmap/:id" component={Gckmap} />
                    <Route path="/add" component={Add} /> 
                </Switch>
            </Router>
        )
    }  
}


