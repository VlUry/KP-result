import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
    getProfessionById,
    getProfessionsLoadingStatus
} from "../../store/professions";

const Profession = ({ id }) => {
    const profession = useSelector(getProfessionById(id));
    const professionsLoading = useSelector(getProfessionsLoadingStatus());

    if (professionsLoading) return "Loading...";

    return <p>{profession.name}</p>;
};

Profession.propTypes = {
    id: PropTypes.string
};

export default Profession;
