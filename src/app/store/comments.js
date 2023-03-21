
import { createAction, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.isLoading = false;
            state.entities = action.payload;
        },
        commentsRequestFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        commentCreateSucces: (state, action) => {
            state.entities.push(action.payload);
        },
        commentRemoveSucces: (state, action) => {
            state.entities = state.entities.filter(
                (c) => c._id !== action.payload
            );
        }
    }
});

const { actions, reducer: commentsReducer } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    commentCreateSucces,
    commentRemoveSucces
} = actions;

const commentCreateFailed = createAction("comments/commentCreateFailed");
const commentRemoveFailed = createAction("comments/commentRemoveFailed");


export const loadCommentsList = (id) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(id);
        dispatch(commentsReceived(content));
    } catch (err) {
        dispatch(commentsRequestFailed(err.message));
    }
};

export const createComment =
    ({ data, pageId }) =>
    async (dispatch, getState) => {
        const comment = {
            ...data,
            _id: nanoid(),
            pageId: pageId,
            createdAt: Date.now(),
            userId: getState().users.auth.userId
        };
        try {
            const { content } = await commentService.createComment(comment);
            dispatch(commentCreateSucces(content));
        } catch (err) {
            commentCreateFailed(err.message);
        }
    };

export const removeComment = (commentId) => async (dispatch) => {
    try {
        const { content } = await commentService.removeComment(commentId);
        if (content === null) {
            dispatch(commentRemoveSucces(commentId));
        }
    } catch (err) {
        dispatch(commentRemoveFailed(err.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
