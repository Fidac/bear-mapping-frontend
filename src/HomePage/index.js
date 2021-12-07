// export * from './HomePage';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';
import LayoutWrapper from "../LayoutWrapper";
// import '../App/App.css';
// import '../static/css/main.css';
import logo from './bearmapping-logo.png'

function HomePage() {
    const users = useSelector(state => state.users);
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getAll());
    }, []);

    function handleDeleteUser(id) {
        dispatch(userActions.delete(id));
    }

    return (
        <div className="col-lg-8 offset-lg-2" align={"center"}>
            {/*<h1>Hi {user.fullname}!</h1>*/}
            {/*<link rel="logo" href="./bearmapping-logo.png" />*/}
            <img src={logo} className="bearmapping-logo" alt="logo" />
            {/*<p>You're logged in with React Hooks!!</p>*/}
            {/*<h3>All registered users:</h3>*/}
            {/*{users.loading && <em>Loading users...</em>}*/}
            {/*{users.error && <span className="text-danger">ERROR: {users.error}</span>}*/}
            {/*{users.items &&*/}
            {/*    <ul>*/}
            {/*        {users.items.map((user, index) =>*/}
            {/*            <li key={user.id}>*/}
            {/*                {user.firstName + ' ' + user.lastName}*/}
            {/*                {*/}
            {/*                    user.deleting ? <em> - Deleting...</em>*/}
            {/*                    : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>*/}
            {/*                    : <span> - <a onClick={() => handleDeleteUser(user.id)} className="text-primary">Delete</a></span>*/}
            {/*                }*/}
            {/*            </li>*/}
            {/*        )}*/}
            {/*    </ul>*/}
            {/*}*/}
            {/*<p>*/}
            {/*    <Link to="/login">Logout</Link>*/}
            {/*</p>*/}
        </div>
    );
}

// export { HomePage };

const WrappedGamePage = LayoutWrapper(HomePage);
export default WrappedGamePage;
