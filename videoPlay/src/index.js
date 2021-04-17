import React from 'react';
import ReactDOM from 'react-dom';
import Shoue from './componrnts/login';
import Shouye from './componrnts/shouye';
import {BrowserRouter , Router,Route,Switch, Redirect } from 'react-router-dom';
import Register from './componrnts/register';
import Admin from './componrnts/admin';
import './static/css/loginhead.css';
import Forget from './componrnts/forget';
import adminHome from './componrnts/adminHome';

ReactDOM.render( 

  <BrowserRouter> 
    <Switch>  
 <Route  path="/user" component={Shoue}></Route>
 <Route path="/admin" exact component={Admin}></Route>
 <Route path="/register" component={Register}></Route>
 <Route path="/forget" component={Forget}></Route>
 <Route path="/admin_home" component={adminHome}></Route>
 <Route path="/" component={Shouye}></Route>
  {/*路由的书写也有先后顺序，switch的意思是当遇到第一个匹配项时，后面的项就不去看了，适用于exact不能解决的情况*/}
 </Switch>
</BrowserRouter>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

