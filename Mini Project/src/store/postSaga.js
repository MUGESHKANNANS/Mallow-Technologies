import { takeLatest, call, put } from "redux-saga/effects";
import axiosInstance from "../utils/axiosInstance";
import {
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
    createPostRequest,
    createPostSuccess,
    createPostFailure,
} from "./postSlice";
import { message } from "antd";

function* fetchPostSaga(action) {
    try {
        const res = yield call(axiosInstance.get, `/posts/${action.payload}`);
        const data = res?.data?.data ?? res?.data;
        yield put(fetchPostSuccess(data));
    } catch (error) {
        yield put(fetchPostFailure(error?.response?.data?.message || "Failed to fetch post"));
    }
}

function* updatePostSaga(action) {
    try {
        const { id, formData, onSuccess } = action.payload;
        const res = yield call(axiosInstance.put, `/posts/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        const data = res?.data?.data ?? res?.data;

        yield put(updatePostSuccess(data));
        message.success("Post updated successfully");
        if (onSuccess) onSuccess();

    } catch (error) {
        yield put(updatePostFailure(error?.response?.data?.message || "Failed to update post"));
        message.error(error?.response?.data?.message || "Failed to update post");
        if (action.payload.onFailure) action.payload.onFailure();
    }
}

function* togglePublishSaga(action) {
    try {
        const { id, is_published } = action.payload;
        const endpoint = is_published ? "unpublish" : "publish";
        const res = yield call(axiosInstance.patch, `/posts/${id}/${endpoint}`);

        yield put(togglePublishSuccess({ id, is_published: !is_published }));
        message.success(`Post ${is_published ? "unpublished" : "published"} successfully`);
    } catch (error) {
        yield put(togglePublishFailure(error?.response?.data?.message || "Action failed"));
        message.error(error?.response?.data?.message || "Action failed");
    }
}

function* deletePostSaga(action) {
    try {
        const { id, onSuccess } = action.payload;
        yield call(axiosInstance.delete, `/posts/${id}`);
        yield put(deletePostSuccess(id));
        message.success("Post deleted successfully");
        if (onSuccess) onSuccess();
    } catch (error) {
        yield put(deletePostFailure(error?.response?.data?.message || "Failed to delete post"));
        message.error(error?.response?.data?.message || "Failed to delete post");
    }
}

function* createPostSaga(action) {
    try {
        const { formData, onSuccess } = action.payload;
        yield call(axiosInstance.post, "/posts/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        yield put(createPostSuccess());
        message.success("Post created successfully");
        if (onSuccess) onSuccess();

    } catch (error) {
        yield put(createPostFailure(error?.response?.data?.message || "Failed to create post"));
        message.error(error?.response?.data?.message || "Failed to create post");
        if (action.payload.onFailure) action.payload.onFailure();
    }
}

export default function* postSaga() {
    yield takeLatest(fetchPostRequest.type, fetchPostSaga);
    yield takeLatest(updatePostRequest.type, updatePostSaga);
    yield takeLatest(togglePublishRequest.type, togglePublishSaga);
    yield takeLatest(deletePostRequest.type, deletePostSaga);
    yield takeLatest(createPostRequest.type, createPostSaga);
}
