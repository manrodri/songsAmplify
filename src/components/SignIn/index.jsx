import React, {useState} from 'react';
import Amplify, {Auth} from 'aws-amplify'
import awsmobile from "../../aws-exports";
import {withAuthenticator} from '@aws-amplify/ui-react';
import {TextField, Button} from "@material-ui/core";
import history from "../../history";

Amplify.configure(awsmobile)

const SignIn = ({onSignIn}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signIn = async () => {
        try{
            const user = await Auth.signIn(username, password)
            history.push('/')
            onSignIn()

        } catch (err){
            console.log('error signing in user: ', err)

        }
    }

    return(
        <div className={'signin'}>
            <TextField
                id={'username'}
                label={'Username'}
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <TextField
                type={'password'}
                id={'password'}
                label={'Password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button
                id={'signInButton'}
                component={'primary'}
                onClick={signIn}
            >
                Sign In
            </Button>


        </div>
    )
}

export default SignIn