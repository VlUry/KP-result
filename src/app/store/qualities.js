import { createSlice } from "@reduxjs/toolkit";
import qualityService from "../services/quality.service";

const qualitiesSlice = createSlice({
    name: "qualities",
    initialState: { entities: null, isLoading: true, error: null },
    reducers: {
        qualitiesRequested: (state) => {
            state.isLoading = true;
        },
        qualitiesRecived: (state, action) => {
            state.isLoading = false;
            state.entities = action.payload;
        },
        qualitiesRequestFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
});

const { actions, reducer: qualitiesReducer } = qualitiesSlice;
const { qualitiesRequested, qualitiesRecived, qualitiesRequestFailed } =
    actions;

export const loadQualitiesList = () => async (dispatch) => {
    dispatch(qualitiesRequested());
    try {
        const { content } = await qualityService.fetchAll();
        dispatch(qualitiesRecived(content));
    } catch (err) {
        dispatch(qualitiesRequestFailed(err.message));
    }
};

export const getQualities = () => (state) => state.qualities.entities;
export const getQualitiesLoadingStatus = () => (state) =>
    state.qualities.isLoading;
export const getQualitiesError = () => (state) => state.qualities.error;
export const getQualitiesByIds = (qualitiesIds) => (state) => {
    if (!state.qualities.entities) return [];
    const qualitiesArray = [];
    for (const qualId of qualitiesIds) {
        for (const quality of state.qualities.entities) {
            if (quality._id === qualId) {
                qualitiesArray.push(quality);
                break;
            }
        }
    }
    return qualitiesArray;
};

export default qualitiesReducer;
