import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import history from "../utils/history";
import { createSlice, createAction } from "@reduxjs/toolkit";
import { generateAuthError } from "../utils/generateAuthError";

const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: true,
          error: null,
          auth: { userId: localStorageService.getUserId() },
          isLoggedIn: true,
          dataLoaded: false
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersReceived: (state, action) => {
            state.isLoading = false;
            state.entities = action.payload;
            state.dataLoaded = true;
        },
        authRequested: (state) => {
            state.error = null;
        },
        usersRequestFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        },
        userCreateSucces: (state, action) => {
            if (Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.isLoggedIn = false;
            state.auth = null;
            state.dataLoaded = false;
        },
        userEditSucces: (state, action) => {
            const userIdx = state.entities.findIndex(
                (u) => u._id === state.auth.userId
            );
            state.entities.splice(userIdx, 1, action.payload);
        }
    }
});

const { actions, reducer: usersReducer } = usersSlice;
const {
    usersRequested,
    usersReceived,
    usersRequestFailed,
    authRequested,
    authRequestSuccess,
    authRequestFailed,
    userCreateSucces,
    userLoggedOut,
    userEditSucces
} = actions;

const userCreateRequested = createAction("users/userCreateRequested");
const userCreateFailed = createAction("users/userCreateFailed");
const userEditRequested = createAction("users/userEditRequested");
const userEditFailed = createAction("users/userEditFailed");

const createUser = (payload) => async (dispatch) => {
    dispatch(userCreateRequested());
    try {
        const { content } = await userService.create(payload);
        dispatch(userCreateSucces(content));
        history.push("/users");
    } catch (err) {
        dispatch(userCreateFailed(err.message));
    }
};

export const signUp =
    ({ email, password, ...rest }) =>
    async (dispatch) => {
        dispatch(authRequested());
        try {
            const data = await authService.register({ email, password });
            localStorageService.setTokens(data);
            dispatch(authRequestSuccess({ userId: data.localId }));
            dispatch(
                createUser({
                    _id: data.localId,
                    email,
                    rate: 5,
                    completedMeetings: 0,
                    image: `https://avatars.dicebear.com/api/avataaars/${(
                        Math.random() + 1
                    )
                        .toString(36)
                        .substring(7)}.svg`,
                    ...rest
                })
            );
        } catch (err) {
            dispatch(authRequestFailed(err.message));
        }
    };

export const signIn =
    ({ payload, redirect }) =>
    async (dispatch) => {
        dispatch(authRequested());
        try {
            const data = await authService.login(payload);
            localStorageService.setTokens(data);
            dispatch(authRequestSuccess({ userId: data.localId }));
            history.push(redirect);
        } catch (err) {
            const { code, message } = err.response.data.error;
            if (code === 400) {
                const errorMessage = generateAuthError(message);
                dispatch(authRequestFailed(errorMessage));
            } else {
                dispatch(authRequestFailed(err.message));
            }
        }
    };

export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    history.push("/");
    dispatch(userLoggedOut());
};

export const loadUsersList = () => async (dispatch) => {
    dispatch(usersRequested());
    try {
        const { content } = await userService.fetchAll();
        dispatch(usersReceived(content));
    } catch (err) {
        dispatch(usersRequestFailed(err.message));
    }
};

export const editUser = (data) => async (dispatch) => {
    dispatch(userEditRequested());
    try {
        const { content } = await userService.editUser(data);
        dispatch(userEditSucces(content));
    } catch (err) {
        dispatch(userEditFailed(err.message));
    }
};

export const getUsers = () => (state) => state.users.entities;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getCurrentUserData = () => (state) => {
    return state.users.entities
        ? state.users.entities.find(
              (user) => user._id === state.users.auth.userId
          )
        : null;
};
export const getUserById = (userId) => (state) => {
    if (state.users.entities) {
        return state.users.entities.find((user) => user._id === userId);
    }
};
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getCurrentUserId = () => (state) => state.users.auth.userId;
export const getAuthError = () => (state) => state.users.error;

export default usersReducer;
