//jshint esversion:6
import React from 'react';
import './ProfileScreen.css';
import { useSelector } from 'react-redux';
import Nav from '../Nav';
import { selectUser } from '../features/counter/userSlice';
import { auth } from '../firebase';
import PlanScreen from './PlanScreen';

function ProfileScreen() {

    const user = useSelector(selectUser);

    return (
        <div className="profileScreen">
            <Nav />
            <div className="profileScreen__body">
                <h1>Edit Profile</h1>
                <div className="profileScreen__info">
                    <img src="data:image/webp;base64,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" alt="" />
                    <div className="profileScreen__details">
                        <h2>{user.email}</h2>
                        <div className="profileScreen__plans">
                        <PlanScreen />
                            <button onClick={() => auth.signOut()} className="profileScreen__signout">Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileScreen;
