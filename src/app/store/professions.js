import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsRequested: (state) => {
            state.isLoading = true;
        },
        professionsReceived: (state, action) => {
            state.isLoading = false;
            state.entities = action.payload;
            state.lastFetch = Date.now();
        },
        professionsRequestFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
});

const { actions, reducer: professionsReducer } = professionsSlice;
const { professionsRequested, professionsReceived, professionsRequestFailed } =
    actions;

function isOutDated(date) {
    return Date.now() - date > 10 * 60 * 1000;
}

export const loadProfessionsList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().professions;
    if (isOutDated(lastFetch)) {
        dispatch(professionsRequested());
        try {
            const { content } = await professionService.fetchAll();
            dispatch(professionsReceived(content));
        } catch (err) {
            dispatch(professionsRequestFailed(err.message));
        }
    }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) =>
    state.professions.isLoading;
export const getProfessionsError = () => (state) => state.professions.error;
export const getProfessionById = (profId) => (state) => {
    return state.professions.entities.find((prof) => prof._id === profId);
};

export default professionsReducer;
