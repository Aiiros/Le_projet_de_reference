import { firebase } from '../firebase/config'


const loginUser = async (data, success, error) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(data.email, data.password)
    .then((response) => {
      firebase.firestore().collection('users')
        .doc(data.email)
        .get()
        .then(firestoreDocument => {
          if (!firestoreDocument.exists) {
            alert("User does not exist anymore.")
            return;
          }
          console.log('logged in !');
          const user = firestoreDocument.data()
          success(user)
        })
        .catch((err) => {
          error(err)
        });
    })
    .catch((err) => {
      error(err)
    });
};

const createUser = async (data, success, error) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(data.email, data.password)
    .then((response) => {
      console.log('register OK');
      const user = {
        email: data.email,
        fullName: data.fullName,
      };
      firebase.firestore().collection('users')
        .doc(data.email)
        .set(user)
        .then(() => {
          success()
        })
        .catch((err) => {
          error(err)
        });

    })
    .catch((err) => {
      error(err)
    });
};

const editUser = async (data, newName, success, error) => {
  var tmp = { ...data, fullName: newName }
  firebase.firestore().collection('users')
    .doc(data.email)
    .set(tmp)
    .then(() => {
      console.log('name edited');
      success(tmp)
    })
    .catch((err) => {
      error(err)
    });

};

const autoLogin = async (success) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      firebase.firestore().collection('users')
        .doc(user.email)
        .get()
        .then((document) => {
          const userData = document.data()
          console.log('autologin with:', userData.email);
          success(userData)
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('User does not exist');
    }
  });
}

const logOut = async (success, error) => {
  firebase.auth().signOut().then(() => {
    console.log('logged out');
    success()
  })
    .catch((err) => {
      console.log(err);
      error(err);
    });
  ;
}


const APIUser = {
  loginUser,
  createUser,
  editUser,
  autoLogin,
  logOut
};

export default APIUser;
