import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPost: null,
    loading: false,
    error: null,
    actionLoading: false, 
    actionType: null, 
    actionError: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        // Fetch Single Post
        fetchPostRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPostSuccess: (state, action) => {
            state.loading = false;
            state.currentPost = action.payload;
        },
        fetchPostFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update Post
        updatePostRequest: (state) => {
            state.actionLoading = true;
            state.actionType = "update";
            state.actionError = null;
        },
        updatePostSuccess: (state, action) => {
            state.actionLoading = false;
            state.actionType = null;
            state.currentPost = action.payload;
        },
        updatePostFailure: (state, action) => {
            state.actionLoading = false;
            state.actionType = null;
            state.actionError = action.payload;
        },

        // Publish/Unpublish Toggle
        togglePublishRequest: (state) => {
            state.actionLoading = true;
            state.actionType = "publish";
            state.actionError = null;
        },
        togglePublishSuccess: (state, action) => {
            state.actionLoading = false;
            state.actionType = null;

            if (state.currentPost && state.currentPost.id === action.payload.id) {
                state.currentPost.is_published = action.payload.is_published;
            }
        },
        togglePublishFailure: (state, action) => {
            state.actionLoading = false;
            state.actionType = null;
            state.actionError = action.payload;
        },

        // Delete Post
        deletePostRequest: (state) => {
            state.actionLoading = true;
            state.actionType = "delete";
            state.actionError = null;
        },
        deletePostSuccess: (state) => {
            state.actionLoading = false;
            state.actionType = null;
            state.currentPost = null;
        },
        deletePostFailure: (state, action) => {
            state.actionLoading = false;
            state.actionType = null;
            state.actionError = action.payload;
        },

        clearPostState: (state) => {
            state.currentPost = null;
            state.error = null;
            state.actionError = null;
        },

        // Create Post
        createPostRequest: (state) => {
            state.actionLoading = true;
            state.actionType = "create";
            state.actionError = null;
        },
        createPostSuccess: (state) => {
            state.actionLoading = false;
            state.actionType = null;
        },
        createPostFailure: (state, action) => {
            state.actionLoading = false;
            state.actionType = null;
            state.actionError = action.payload;
        }
    },
});

export const {
    fetchPostRequest,
    fetchPostSuccess,
    fetchPostFailure,
    updatePostRequest,
    updatePostSuccess,
    updatePostFailure,
    togglePublishRequest,
    togglePublishSuccess,
    togglePublishFailure,
    deletePostRequest,
    deletePostSuccess,
    deletePostFailure,
    clearPostState,
    createPostRequest,
    createPostSuccess,
    createPostFailure
} = postSlice.actions;

export default postSlice.reducer;
