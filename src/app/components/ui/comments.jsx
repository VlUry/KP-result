import { orderBy } from "lodash";
import React, { useEffect } from "react";
import CommentsList, { AddCommentForm } from "../common/comments";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    createComment,
    getComments,
    getCommentsLoadingStatus,
    loadCommentsList,
    removeComment
} from "../../store/comments";

const Comments = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const commentsLoadingStatus = useSelector(getCommentsLoadingStatus());

    useEffect(() => {
        dispatch(loadCommentsList(userId));
    }, [userId]);

    const comments = useSelector(getComments());

    const handleSubmit = (data) => {
        dispatch(createComment({ data, pageId: userId }));
    };

    const handleRemoveComment = (id) => {
        dispatch(removeComment(id));
    };

    const sortedComments = orderBy(comments, ["createdAt"], ["desc"]);

    return (
        <>
            <div className="card mb-2">
                {" "}
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body ">
                    <h2>Comments</h2>
                    <hr />
                    {!commentsLoadingStatus ? (
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
