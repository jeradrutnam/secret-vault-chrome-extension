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

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Avatar, Header, Nav, Navbar } from "rsuite";
import Layout from './layouts/layout';
import { HomeContent } from './pages/home';
import { AboutContent } from './pages/about';
import './app.global.less';
import Logo from '../assets/images/logo.png';
import { ProtectedRoute } from "./auth/protected-route";
import { useAuthContext } from "./auth/auth-context";

export const App = ({...props}) => {

    const { state, signOut } = useAuthContext();

    return (
        <Router>
            <Header>
                <Navbar {...props}>
                    <Navbar.Brand><img src={ Logo } alt="Currency Converter Logo" /></Navbar.Brand>
                    <Nav>
                        <Nav.Item as={Link} to="/">Home</Nav.Item>
                        <Nav.Item as={Link} to="/about">About</Nav.Item>
                    </Nav>
                    { state?.username &&
                        <Nav pullRight>
                            <Nav.Menu title={
                                <>
                                    <span className="logged-in-user-name">{ state?.username }</span>
                                    <Avatar
                                        circle
                                        src="https://avatars.githubusercontent.com/u/7569427?v=4"
                                        alt="Logged in user image" />
                                </>
                            }>
                                <Nav.Item onClick={ signOut }>Logout</Nav.Item>
                            </Nav.Menu>
                        </Nav>
                    }
                </Navbar>
            </Header>
            <Layout>
                <Routes>
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="/" element={<HomeContent/>}/>
                    </Route>
                    <Route path="/about" element={<AboutContent />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
