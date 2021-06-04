import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Button,
  Pressable,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import APIData from './api/dataAPI';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  item: {
    backgroundColor: '#eee2',
    borderBottomWidth: 1,
    borderColor: '#aaa',
    flex: 1,
    flexDirection: 'row'
  },
  titleContainer: {
    // backgroundColor: '#ffa',
    flex: 1,
    paddingHorizontal: 10
  },
  title: {
    marginBottom: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,

    fontWeight: 'bold'
  },
  author: {
    marginBottom: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1

    // fontFamily: 'italic'
  },
  simpleText: {
    marginBottom: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1
  },
  description: {
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingBottom: 8,
    borderBottomWidth: 1,

    flex: 1
  },
  flex: {
    flex: 1
  },
  divider: {
    backgroundColor: '#faf'
    // flex: 1
  },
  tagsContainer: {
    minHeight: 20,
    minWidth: 20,
    margin: 5,
    // flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tagText: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    margin: 2,
    backgroundColor: '#aaa8',
    // backgroundColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center'
  },
  tagMinus: {
    // padding: 1,
    // margin: 2,
    backgroundColor: '#f008',
    // backgroundColor: '#ccc',
    borderWidth: 1,

    borderRadius: 15,
    height: 15,
    width: 15,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    padding: 2,
    minHeight: 60,
    minWidth: 80
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    resizeMode: 'contain'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
});

const Edit = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.Auth.user);

  const capitalize = (string) => {
    if (string && typeof string === 'string')
      return string.replace(/^./, string[0].toUpperCase());
    return string;
  };

  const listTags = (tags, setFieldValue = () => null) => {
    let i = 0;
    return tags.map((element) => {
      i += 1;
      return (
        <View key={i} style={styles.tagText}>
          <Pressable
            style={styles.tagMinus}
            onPress={() => {
              const tmpTags = tags;
              let index = -1;
              tmpTags.map((item, id) => {
                if (item === element) index = id;
                return null;
              });
              if (index > -1) tmpTags.splice(index, 1);
              setFieldValue('tags', tmpTags);
            }}
          >
            <Text style={styles.center}>-</Text>
          </Pressable>
          <Text>{capitalize(element)}</Text>
        </View>
      );
    });
  };

  const renderTags = (tags, newtag, isEdittingTag, setFieldValue) => {
    if (isEdittingTag)
      return (
        <View style={styles.tagsContainer}>
          {listTags(tags, setFieldValue)}
          <TextInput
            style={{ ...styles.tagText, minWidth: 100 }}
            onChangeText={(txt) => setFieldValue('newtag', txt)}
          />
          <Pressable
            onPress={() => {
              if (newtag !== '') {
                setFieldValue('newtag', '');
                setFieldValue('isEdittingTag', false);
                setFieldValue('tags', [...tags, newtag]);
              } else setFieldValue('isEdittingTag', false);
            }}
          >
            <Text selectable={false} style={styles.tagText}>
              {newtag !== '' ? '+' : '-'}
            </Text>
          </Pressable>
        </View>
      );
    return (
      <View style={styles.tagsContainer}>
        {listTags(tags, setFieldValue)}
        <Pressable onPress={() => setFieldValue('isEdittingTag', true)}>
          <Text selectable={false} style={styles.tagText}>
            +
          </Text>
        </Pressable>
      </View>
    );
  };

  const addEditArtwork = (values) => {
    var artwork = {};
    if (route.params.id !== null) {
      artwork = {
        ...route.params,
        ...values
      };
    } else {
      artwork = {
        mouvement: values.mouvement ? values.mouvement : '',
        title: values.title ? values.title : '',
        author: values.author ? values.author : '',
        created: values.created ? values.created : '',
        tags: values.tags ? values.tags : [],
        description: values.description ? values.description : '',
        image: values.image ? values.image : '',
        history: []
      };
    }
    APIData.addArtwork(
      artwork,
      user,
      () => {
        navigation.popToTop();
      },
      (err) => {
        alert(err);
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ ...styles.flex }}>
        <Formik
          initialValues={{
            id: route.params.id,
            title: route.params.title,
            author: route.params.author,
            created: route.params.created,
            mouvement: route.params.mouvement,
            description: route.params.description,
            tags: route.params.tags,
            image: route.params.image,
            isEdittingTag: false,
            newtag: ''
          }}
          onSubmit={(values) => addEditArtwork(values)}
          style={styles.flex}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue
          }) => (
            <View style={styles.flex}>
              <Pressable
                onPress={() => navigation.navigate('Photo')}
                style={styles.imageContainer}
              >
                <Image style={styles.image} source={{ uri: values.image }} />
              </Pressable>
              <View style={styles.titleContainer}>
                <TextInput
                  value={values.title}
                  placeholder='Titre'
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  style={styles.title}
                />
                <TextInput
                  value={values.author}
                  placeholder='Auteur'
                  onChangeText={handleChange('author')}
                  onBlur={handleBlur('author')}
                  style={styles.author}
                />
                <TextInput
                  value={values.created}
                  placeholder='Date de parution'
                  onChangeText={handleChange('created')}
                  onBlur={handleBlur('created')}
                  style={styles.simpleText}
                />
                <TextInput
                  value={values.mouvement}
                  placeholder='Mouvement'
                  onChangeText={handleChange('mouvement')}
                  onBlur={handleBlur('mouvement')}
                  style={styles.simpleText}
                />
                <TextInput
                  value={values.image}
                  placeholder="Lien de l'image"
                  onChangeText={handleChange('image')}
                  onBlur={handleBlur('image')}
                  style={styles.simpleText}
                />
                <TextInput
                  multiline
                  // numberOfLines={3}
                  value={values.description}
                  placeholder='Description'
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  style={styles.description}
                />
              </View>
              <View style={styles.divider} />
              {renderTags(
                values.tags,
                values.newtag,
                values.isEdittingTag,
                setFieldValue
              )}
              <Button
                disabled={false}
                onPress={handleSubmit}
                title='Sauvegarder'
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

Edit.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      created: PropTypes.string,
      mouvement: PropTypes.string,
      lastEdit: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string)
    })
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    popToTop: PropTypes.func
  })
};

Edit.defaultProps = {
  route: {},
  navigation: {}
};

export default Edit;
