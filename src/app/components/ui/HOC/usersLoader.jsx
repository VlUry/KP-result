import { useDispatch, useSelector } from "react-redux";
import { getDataStatus, loadUsersList } from "../../../store/users";
import PropTypes from "prop-types";
import { useEffect } from "react";

const UsersLoader = ({ children }) => {
    const dataStatus = useSelector(getDataStatus());
    const dispatch = useDispatch();

    useEffect(() => {
        if (!dataStatus) {
            dispatch(loadUsersList());
        }
    }, []);

    if (!dataStatus) return "Loading...";

    return children;
};

UsersLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
};

export default UsersLoader;
