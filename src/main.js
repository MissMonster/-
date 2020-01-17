import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { createBrowserHistory } from "history";
import Routers from './router.js';
import {Provider} from 'react-redux';
import {store} from './store';





// axios.defaults.baseURL= 'http://115.29.230.26:8888';






ReactDOM.render(<div>
    <Provider store={store}>
        <Routers></Routers>
    </Provider>
</div>,document.getElementById("app"));