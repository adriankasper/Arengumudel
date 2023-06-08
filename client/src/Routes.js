
import React, {Fragment} from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Home from './Home.js';
import Login from './Login.js';
import About from './About';
import Register from './Register';
import Header from './Header';
import KysimustikuValik from "./KysimustikuValik.js";
import Profile from "./Profile.js";
import Contact from "./Contact.js";
import Oppematerjal from "./Oppematerjal.js";
import MuudaProfiili from "./MuudaProfiili.js";
import OppematerjalidKuvamine from "./OppematerjalidKuvamine.js";
import Teated from "./Teated.js";
import KysimustikudKuvamine from "./KysimustikudKuvamine.js";
import ProtectedRoute from "./ProtectedRoutes.js";

const Routes = () => {

    return (
        <BrowserRouter>
            <div>
                
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path='/register' component={Register} />
                    <Fragment>
                        <Header />
                        <ProtectedRoute exact path="/" component={Teated} />
                        <ProtectedRoute exact path="/about" component={About} />
                        <ProtectedRoute exact path="/profile"  component={Profile} />
                        <ProtectedRoute exact path="/kysimustikud" component={KysimustikuValik} />
                     
                        <ProtectedRoute exact path='/contact' component={Contact} />
                        <ProtectedRoute exact path='/lisa-oppematerjal' component={Oppematerjal} />
                        <ProtectedRoute exact path='/muudaprofiili' component={MuudaProfiili} />
                        <ProtectedRoute exact path='/oppematerjalid' component={OppematerjalidKuvamine} />
                        <ProtectedRoute exact path='/minu-kysimustikud' component={KysimustikudKuvamine} />
                    </Fragment>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default Routes;