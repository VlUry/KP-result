import { orderBy } from "lodash";
import React, { useEffect } from "react";
import CommentsList, { AddCommentForm } from "../common/comments";
import { useComments } from "../../hooks/useComments";
import {
    getComments,
    getCommentsLoadingStatus,
    loadCommentsList
} from "../../store/comments";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

const Comments = () => {
    const { createComment, removeComment } = useComments();
    const { userId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadCommentsList(userId));
    }, [userId]);

    const isLoading = useSelector(getCommentsLoadingStatus());
    const comments = useSelector(getComments());
    const handleSubmit = (data) => {
        createComment(data);
    };

    const handleRemoveComment = (id) => {
        removeComment(id);
    };

    const sortedComments = orderBy(comments, ["createdAt"], ["desc"]);

    return (
        <>
            <div className="card mb-2">
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body ">
                    <h2>Comments</h2>
                    <hr />
                    {!isLoading ? (
                        <CommentsList
                            comments={sortedComments}
                            onRemove={handleRemoveComment}
                        />
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </>
    );
};

export default Comments;
