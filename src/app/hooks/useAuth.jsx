import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import userService from "../services/user.service";
import localStorageService from "../services/localStorage.service";
import { useHistory } from "react-router-dom";

export const httpAuth = axios.create({
    baseURL: "https://identitytoolkit.googleapis.com/v1/",
    params: {
        key: process.env.REACT_APP_FIREBASE_KEY
    }
});
const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const history = useHistory();

    const [currentUser, setUser] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);

    function getRandomNun(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function logOut() {
        localStorageService.removeAuthData();
        setUser(null);
        history.push("/");
    }

    async function signUp({ email, password, ...rest }) {
        const url = "accounts:signUp";

        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            });
            localStorageService.setTokens(data);
            await createUser({
                _id: data.localId,
                email,
                rate: getRandomNun(1, 5),
                completedMeetings: getRandomNun(0, 200),
                image: `https://avatars.dicebear.com/api/avataaars/${(
                    Math.random() + 1
                )
                    .toString(36)
                    .substring(7)}.svg`,
                ...rest
            });
        } catch (error) {
            errorCatcher(error);
            const { code, message } = error.response.data.error;
            console.log(code, message);
            if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const errorObject = {
                        email: "Пользователь с таким Email уже существует"
                    };
                    throw errorObject;
                }
            }
            // throw new Error
        }
    }

    async function signIn({ email, password, ...rest }) {
        const url = `accounts:signInWithPassword`;

        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            });
            localStorageService.setTokens(data);
            await getUser();
        } catch (error) {
            errorCatcher(error);
            const { code, message } = error.response.data.error;
            console.log(code, message);
            if (code === 400) {
                let errorObject = { email: message };
                if (message === "INVALID_PASSWORD") {
                    errorObject = {
                        password: message
                    };
                }
                throw errorObject;
            }
            // throw new Error
        }
    }

    async function getUser() {
        try {
            const { content } = await userService.getCurrentUser();
            setUser(content);
        } catch (error) {
            errorCatcher(error);
        } finally {
            setLoading(false);
        }
    }

    async function createUser(data) {
        try {
            const { content } = await userService.create(data);
            setUser(content);
        } catch (error) {
            errorCatcher(error);
        }
    }

    async function editUser(data) {
        try {
            const { content } = await userService.editUser(data);
            console.log(content);
            setUser(content);
        } catch (err) {
            errorCatcher(err);
        }
    }

    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }
    useEffect(() => {
        if (error !== null) {
            toast(error);
            setError(null);
        }
    }, [error]);

    useEffect(async () => {
        if (localStorageService.getAccessToken()) {
            await getUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ signIn, signUp, currentUser, logOut, editUser }}
        >
            {!isLoading ? children : "Loading..."}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default AuthProvider;
