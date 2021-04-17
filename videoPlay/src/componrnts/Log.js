import React from 'react';

import {BrowserRouter as Link,NavLink,Redirect } from 'react-router-dom';
const Log=()=>{
    return (
    <div className="loginhead">
    <NavLink to='/user' activeClassName="selected">用户登陆</NavLink>
    <NavLink to='/admin' activeClassName="selected">权限登陆</NavLink>
    </div>
    )
    }
    export default Log;