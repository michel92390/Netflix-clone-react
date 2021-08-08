//jshint esversion:6
import React, { useState, useEffect } from 'react';
import db from '../firebase';
import './PlanScreen.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';
import { loadStripe } from '@stripe/stripe-js';

function PlanScreen() {

    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        db.collection('customers')
        .doc(user.uid)
        .collection('subscriptions')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(async subscription => {
                setSubscription({
                    role: subscription.data().role,
                    current_period_end: subscription.data().current_period_end.seconds,
                    current_period_start: subscription.data().current_period_start.seconds,
                });
            });
        });
    }, [user.uid]);

    useEffect(() => {
        db.collection('products')
        .where('active', '==', true)
        .get()
        .then(querySnapshot => {
            const products = {};
            querySnapshot.forEach(async productDoc => {
                products[productDoc.id] = productDoc.data();
                const priceSnap = await productDoc.ref.collection('prices').get();
                priceSnap.docs.forEach(price => {
                    products[productDoc.id].prices = {
                        priceId: price.id,
                        priceData: price.data()
                    };
                });
            });
            setProducts(products);
        });
    }, []);
    console.log(subscription);

        const loadCheckout = async (priceId) => {
            const docRef = await db.collection('customers')
            .doc(user.uid)
            .collection("checkout_sessions")
            .add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin
            });
            docRef.onSnapshot(async(snap) => {
                const { error, sessionId } = snap.data();
                if (error) {
                    alert(`An error occured: ${error.message}`);
                }
                if (sessionId) {
                    //init stripe
                    const  stripe = await loadStripe("pk_test_51JLlk8DD8tlAtLvwdzHK4R8Cyn68CIYU4OxsZW6oAte2oorEpyT5PV0GV6oEve1RJlyf0ZXYalQfsOqAwmU0RvtJ00yGksfAof");
                    stripe.redirectToCheckout({ sessionId });
                }
            });
        };

    return (
        <div className="planScreen">
            {subscription && <h3>Plans (Current Plan: {subscription?.role})</h3>}
            <hr />
            {subscription && <p>Renewal Date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
            {Object.entries(products).map(([productId, productData]) => {
                //add some logic to check if the user subscription is active
                const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);

                return (
                    <div 
                        key={productId} 
                        className={`${isCurrentPackage && "planScreen__plan--disabled"} planScreen__plan`}
                    >
                        <div className="planScreen__info">
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>
                        <button onClick = {() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>{isCurrentPackage ? 'Current Package' : 'Subscribe'}</button>
                    </div>
                );
            })}
        </div>
    )
}

export default PlanScreen;
