import ACTION_TYPES from './action_types';

const setArtworks = (artworks) => ({
  payload: { artworks },
  type: ACTION_TYPES.Data.setArtworks
});

const DataActions = {
  setArtworks
};

export default DataActions;
