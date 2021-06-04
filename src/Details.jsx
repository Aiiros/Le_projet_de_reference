import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 10
  },
  flex: {
    flex: 1
  },

  title: {
    fontWeight: 'bold',
    marginTop: 10
  },
  author: {
    // fontFamily: 'italic',
    marginTop: 5
  },
  divider: {
    backgroundColor: '#faf'
    // flex: 1
  },
  tagsContainer: {
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
    backgroundColor: '#aaa8',
    borderWidth: 1,
    borderRadius: 15
  },
  imageContainer: {
    // backgroundColor: '#cec'
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    resizeMode: 'contain'
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

function renderHistory(item) {
  return item
    .slice(0)
    .reverse()
    .map((element) => {
      var d = new Date(element.editAt);
      return (
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
          key={element.editAt}
        >
          <View
            style={{
              height: 40,
              width: 40,
              borderWidth: 1,
              borderRadius: 40,
              marginHorizontal: 10,
              marginVertical: 2
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
                element.user && element.user.avatar
                  ? { uri: element.user.avatar }
                  : require('../assets/user.png')
              }
            />
          </View>
          <Text style={{}}>
            {element.user && element.user.fullName ? element.user.fullName : ''}{' '}
            à modifé le:{' '}
            {[d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') +
              ' ' +
              [d.getHours(), d.getMinutes()].join(':')}
          </Text>
        </View>
      );
    });
}

const Details = ({ route }) => {
  const [ratio, setRatio] = useState(1);
  const pageWidth = Dimensions.get('window').width;

  if (route.params.image) {
    Image.getSize(
      route.params.image,
      (width, height) => {
        setRatio(height / width);
      },
      () => setRatio(0)
    );
  } else;

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={{
              height: pageWidth * ratio,
              width: pageWidth,
              resizeMode: 'contain'
            }}
            source={{ uri: route.params.image }}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{capitalize(route.params.title)}</Text>
          {route.params.author ? (
            <Text style={styles.author}>{capitalize(route.params.author)}</Text>
          ) : null}
          {route.params.created ? (
            <Text style={styles.created}>
              {capitalize(route.params.created)}
            </Text>
          ) : null}
          {route.params.mouvement ? (
            <Text style={styles.mouvement}>
              {`Mouvement: ${capitalize(route.params.mouvement)}`}
            </Text>
          ) : null}
          {route.params.description ? (
            <Text style={styles.description}>
              {capitalize(route.params.description)}
            </Text>
          ) : null}
        </View>
        <View style={styles.divider} />
        <View style={styles.tagsContainer}>
          {renderTags(route.params.tags)}
        </View>
        <View style={styles.historyContainer}>
          {renderHistory(route.params.history)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

Details.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string,
      author: PropTypes.string,
      created: PropTypes.string,
      mouvement: PropTypes.string,
      // lastEdit: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string)
    })
  })
};

Details.defaultProps = {
  route: {}
};

export default Details;
