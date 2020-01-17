//redux公共管理
import {createStore,compose,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {tokenReducer} from './tokenReducer';

export const store = createStore(
    tokenReducer,
    compose(
        applyMiddleware(...[thunk]),//网络请求需要使用的中间件数组
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //配置dev redux-devtools
    )
);