import firebase from 'firebase/app';
import { save, get } from 'src/services/firebaseDB';
import { parseErrorMessage } from 'src/validations/parseFirebaseLoginErrors';

async function createClient(user) {
    const existingClient = await get({collection: 'clients', docName: user.uid});
    if (!existingClient) {
        const params = {
            collection: 'clients',
            docName: user.uid,
            item: {
                email: user.email,
                registrationDate: new Date().getTime(),
                status: 'trial'
            }
        };
        save(params).then(() => {
        });
    }
};

export const getCurrentUser = (id) => {
    return get({collection: 'users', docName: id});
};

export const signInWithEmailAndPassword = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            if (result.user.emailVerified) {
                createClient(result.user);
                // createQR(result.user.uid);
            } else {
                firebase.auth().signOut();
                // TODO: ask to verify email
            }
        })
        .catch((error) => {
            alert(parseErrorMessage(error))
        })
};

export const createUserWithEmailAndPassword = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password);
};
    
export const resetPassword = (email) => {
    return firebase.auth().sendPasswordResetEmail(email);
};

// export const singInWithGoogle = () => {
//     var provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider)
//         .then((result) => {
//             updateRemoteUser(result.user)
//         })
// };

// export const singInWithFacebook = () => {
//     var provider = new firebase.auth.FacebookAuthProvider();
//     firebase.auth().signInWithPopup(provider)
// };

export const onAuthStateChanged = (callback) => {
    firebase.auth().onAuthStateChanged(callback);
};

export const signOut = () => {
  firebase.auth().signOut();
};

export const createUser = (data) => {
    const { firstName, lastName, email, password } = data;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((firebaseUser) => {
            firebase.auth().useDeviceLanguage();

            firebaseUser.user.updateProfile({
                displayName: firstName + ' ' + lastName
            });

            firebaseUser.user.sendEmailVerification().then(function() {
                // Email sent.
            }).catch(function(error) {
                // An error happened.
            });

            if (!firebaseUser.user.emailVerified) {
                firebase.auth().signOut();
            } else {
                // TODO: ask to verify email
            }
        })
        .catch((error) => {
            alert(parseErrorMessage(error))
        });
};