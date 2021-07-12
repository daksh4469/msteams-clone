import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router'

import Home from './Home';
import Register from './Register';
import Login from './Login';

import { ContextProvider } from './Context';

const App = () => {
    return (
        <div style={{ backgroundColor: '#161d29', minHeight: '100vh' }}>
            <Switch>
                <Route exact path="/">
                <Redirect to="/login" />
                </Route>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <ContextProvider>
                <Route exact path="/home" component={Home} />
                </ContextProvider>
            </Switch>
        </div>
    );
};

export default App;
