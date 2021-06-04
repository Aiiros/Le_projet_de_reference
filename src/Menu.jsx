import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  TextInput,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import APIData from './api/dataAPI';
import DataActions from './logic/action/data_actions';

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: '#fff'
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  item: {
    backgroundColor: '#eeee',
    borderBottomWidth: 2,
    borderTopWidth: 1,
    borderColor: '#aaa',
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20
  },
  titleContainer: {
    // backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 10
  },
  title: {
    fontWeight: 'bold',
    marginTop: 10
  },
  author: {
    // fontFamily: ,
    marginTop: 5
  },
  divider: {
    // flex: 1
  },
  tagsContainer: {
    // backgroundColor: '#faf',
    minHeight: 20,
    minWidth: 20,
    margin: 5,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tagText: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    margin: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 15
  },
  imageContainer: {
    // flex: 1,
    // backgroundColor: '#ffa'
    // padding: 2,
    // minHeight: 60
    // Width: '100%'
  },
  add: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    height: 60,
    width: 60,
    // borderWidth: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  addText: {
    fontSize: 30
  },
  searchBar: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 10
    // position: 'absolute',
    // top: 0,
    // elevation: 15
  }
});

function capitalize(string) {
  if (string && typeof string === 'string')
    return string.replace(/^./, string[0].toUpperCase());
  if (string === undefined) return '?';
  return string;
}

function renderTags(tags) {
  return tags.map((element) => (
    <Text key={element} style={styles.tagText}>
      {capitalize(element)}
    </Text>
  ));
}

const renderItem = ({ item }, navigation, ratioTab, pageWidth) => {
  const ratio = ratioTab.find((elem) => elem.id === item.id)
    ? ratioTab.find((elem) => elem.id === item.id).ratio
    : 0;
  return (
    <Pressable
      style={styles.item}
      onPress={() => navigation.navigate('Details', item)}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            style={{
              height: Math.round(pageWidth * ratio),
              width: pageWidth,
              resizeMode: 'contain'
            }}
            source={{ uri: item.image }}
          />
        ) : null}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{capitalize(item.title)}</Text>
        <Text style={styles.author}>{capitalize(item.author)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.tagsContainer}>{renderTags(item.tags)}</View>
    </Pressable>
  );
};

const Menu = ({ navigation }) => {
  const dispatch = useDispatch();

  const artworks = useSelector((state) => state.Data.artworks);
  const user = useSelector((state) => state.Auth.user);

  const [ratioTab, setRatio] = useState([]);
  const [refreshing] = useState(false);
  const [query, setQuery] = useState('');

  const pageWidth = Dimensions.get('window').width;

  useEffect(() => {
    artworks.forEach((item) => {
      if (item.image)
        Image.getSize(item.image, (width, height) => {
          setRatio((oldRatioTab) => [
            ...oldRatioTab,
            { id: item.id, ratio: height / width }
          ]);
        });
      else
        setRatio((oldRatioTab) => [...oldRatioTab, { id: item.id, ratio: 1 }]);
      return null;
    });
    // setRatio(ratioTab);
  }, [artworks]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{}}>{user && user.fullName ? user.fullName : ''}</Text>
          <View
            style={{
              height: 40,
              width: 40,
              borderWidth: 1,
              borderRadius: 40,
              marginHorizontal: 5
            }}
          >
            <Image
              style={{
                resizeMode: 'cover',
                height: 40,
                width: 40,
                overflow: 'hidden',
                alignSelf: 'center'
              }}
              source={
                user && user.avatar
                  ? { uri: user.avatar }
                  : require('../assets/user.png')
              }
            />
          </View>
        </Pressable>
      )
    });
  });

  const refresh = () => {
    APIData.searchArtwork(
      (artworks) => {
        dispatch(DataActions.setArtworks(artworks));
      },
      (err) => {
        alert(err);
      }
    );
  };

  useEffect(() => {
    refresh();
  }, [dispatch]);

  let filteredArtworks = artworks;
  if (query !== '') {
    filteredArtworks = filteredArtworks.filter((elem) => {
      if (
        elem.tags.find((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
        return true;
      return false;
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder='Recherche'
          onChangeText={(a) => {
            setQuery(a);
          }}
          value={query}
        />
      </View>
      <FlatList
        data={filteredArtworks}
        extraData={refreshing}
        renderItem={(element) =>
          renderItem(element, navigation, ratioTab, pageWidth)
        }
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
        ListFooterComponent={
          <View
            style={{
              height: 70,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 10 }}>
              Le projet de reference par Romain Lavalle
            </Text>
          </View>
        }
      />
      <Pressable
        style={styles.add}
        onPress={() =>
          navigation.navigate('Edit', {
            id: null,
            title: null,
            author: null,
            created: null,
            mouvement: null,
            image: null,
            tags: []
          })
        } // ! ESLINT VS PRETTIER
      >
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

Menu.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func
  })
};

Menu.defaultProps = {
  navigation: {}
};

export default Menu;
