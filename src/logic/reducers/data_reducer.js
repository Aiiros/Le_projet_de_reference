import produce from 'immer';
import ACTION_TYPES from '../action/action_types';

const INITIAL_STATE = {
  artworks: []
};

const DataReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.Data.setArtworks:
      return produce(state, (draft) => {
        if (action.payload) {
          const tempDraft = draft;
          tempDraft.artworks = action.payload.artworks;
        }
      });
    default:
      return state;
  }
};

export default DataReducer;
