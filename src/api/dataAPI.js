import { firebase } from '../firebase/config'


const addArtwork = async (obj, user, success, error) => {
  if (!obj || !obj.title || obj.title === "") {
    error("Il manque un titre !")
    return
  }

  let timestamp = firebase.firestore.FieldValue.serverTimestamp()
  // console.log(obj);

  var data = {}
  if (obj.id) {
    data = {
      ...obj,
      history: [...obj.history, { user, editAt: Date.now() }],
      lastEdit: firebase.firestore.FieldValue.serverTimestamp(),
    };
    console.log(data);
    firebase.firestore().collection('artWork')
      .doc(obj.id)
      .set(data)
      .then(() => {
        console.log('item edited');
        success()
      })
      .catch((err) => {
        error(err)
      });
    return
  }
  data = {
    ...obj,
    user: user.email,
    createdAt: timestamp,
    lastEdit: timestamp,
  };
  firebase.firestore().collection('artWork')
    .add(data)
    .then(() => {
      console.log('item added');
      success()
    })
    .catch((err) => {
      error(err)
    });

};

const searchArtwork = async (success, error) => {
  firebase.firestore().collection('artWork').orderBy('lastEdit', 'desc').onSnapshot(snap => {
    const newArtWork = []
    snap.forEach(item => {
      const newItem = item.data()
      newItem.id = item.id
      newArtWork.push(newItem)
    })
    console.log('refreshed');
    success(newArtWork)
  }, err => {
    console.log(err);
    error(err)
  })
}

const APIData = {
  addArtwork,
  searchArtwork
};
export default APIData;
