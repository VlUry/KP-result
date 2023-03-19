import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProfessionsList } from "../../../store/professions";
import { loadQualitiesList } from "../../../store/qualities";
import {
    getIsLoggedIn,
    getUsersLoadingStatus,
    loadUsersList
} from "../../../store/users";

const AppLoader = ({ children }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn());
    const usersLoadingStatus = useSelector(getUsersLoadingStatus());
    useEffect(() => {
        dispatch(loadQualitiesList());
        dispatch(loadProfessionsList());
        if (isLoggedIn) dispatch(loadUsersList());
    }, []);
    if (usersLoadingStatus) return "Loading...";
    return children;
};

AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
};

export default AppLoader;
