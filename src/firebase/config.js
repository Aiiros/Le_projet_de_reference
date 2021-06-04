import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';


const firebaseConfig = {
    apiKey: 'AIzaSyAGRc3z97ywpmcr8CYiokqm-2imtigrgdU',
    authDomain: 'le-projet-de-reference-4fa20.firebaseapp.com',
    databaseURL: 'https://le-projet-de-reference-4fa20.firebaseio.com',
    projectId: 'le-projet-de-reference-4fa20',
    storageBucket: 'le-projet-de-reference-4fa20.appspot.com',
    messagingSenderId: '385349697539',
    appId: '1:385349697539:android:641c8415f021b5e0888e36',
};

if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
if (firebase)
    firebase.firestore()



export { firebase };

