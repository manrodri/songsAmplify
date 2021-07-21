import React, {useEffect, useState} from 'react';
import './App.css';
import Amplify, {Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import {Button} from "@material-ui/core";
import {Router, Switch, Route, BrowserRouter, Link} from 'react-router-dom'
import history from "./history";

import SongList from "./components/SongList";
import SignIn from "./components/SignIn";

Amplify.configure(awsconfig);

function App() {
    const [loggedIn, setLoggedIn] = useState(false)

    const assessLoggedInState = () => {
        Auth.currentAuthenticatedUser()
            .then(() => {
                setLoggedIn(true)
            })
            .catch(() => setLoggedIn(false))
    }

    useEffect(() => assessLoggedInState(), [])


    const signOut = async () => {
        try {
            await Auth.signOut();
            setLoggedIn(false)

        } catch (err) {
            console.error('error signing out: ', err)
        }
    }

    const onSignIn = () => setLoggedIn(true)

    return (
        <Router history={history}>
            <div className="App">
                <header className="App-header">
                    {loggedIn ? <Button variant={`contained`} color={'primary'} onClick={signOut}>
                        Sign Out
                    </Button> : (<Link to={'/login'}>
                        <Button variant={`contained`} color={'primary'}>
                            Sign In
                        </Button>}
                    </Link>)
                    }
                    <h2>My App content</h2>
                </header>
                <Switch>
                    <Route exact path={'/'}>
                        <SongList/>
                    </Route>
                    <Route exact path={'/login'}>
                        <SignIn onSignIn={onSignIn}/>
                    </Route>
                </Switch>

            </div>
        </Router>

    );
}

export default App;
