/**
 * MIT License
 *
 * Copyright (c) 2022 Jerad Rutnam (www.jeradrutnam.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
**/

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Avatar, Container, Header, Nav, Navbar } from "rsuite";
import { HomeContent } from './pages/home';
import { AboutContent } from './pages/about';
import { ProtectedRoute } from "./auth/protected-route";
import { useAuthContext } from "./auth/auth-context";
import Logo from '../assets/images/logo.png';
import './app.global.less';

export const App = ({...props}) => {

    const { state, signOut, secureFetch } = useAuthContext();
    const [ userDetails, setUserDetails ] = useState<any | null>(null);

    useEffect(() => {
        if (state?.username) {
            secureFetch("https://api.asgardeo.io/t/jerad/oauth2/userinfo?schema=openid")
                .then((response: object) => {
                    setUserDetails(response);
                })
                .catch((error: object) => {
                    console.error(error);
                });
        }
    }, [state]);

    return (
        <Router>
            <Header>
                <Navbar {...props}>
                    <Navbar.Brand><img src={ Logo } alt="Currency Converter Logo" /></Navbar.Brand>
                    <Nav>
                        <Nav.Item as={ Link } to="/">Home</Nav.Item>
                        <Nav.Item as={ Link } to="/about">About</Nav.Item>
                    </Nav>
                    <Nav pullRight>
                        { state?.username &&
                            <Nav.Menu title={
                                <>
                                    <span className="logged-in-user-name">{ state?.username }</span>
                                    { userDetails?.picture &&
                                        <Avatar
                                            circle
                                            src={ userDetails?.picture }
                                            alt="Logged in user image" />
                                    }
                                </>
                            }>
                                <Nav.Item onClick={ signOut }>Logout</Nav.Item>
                            </Nav.Menu>
                        }
                    </Nav>
                </Navbar>
            </Header>
            <div className="layout">
                <Container className="app-content">
                    <Routes>
                        <Route path="/" element={ <ProtectedRoute /> }>
                            <Route path="/" element={ <HomeContent /> }/>
                        </Route>
                        <Route path="/about" element={ <AboutContent /> } />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
