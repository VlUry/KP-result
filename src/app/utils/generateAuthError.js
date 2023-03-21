export function generateAuthError(errorMessage) {
    switch (errorMessage) {
        case "INVALID_PASSWORD": {
            return "Email или пароль введен не верно";
        }
        case "EMAIL_EXISTS": {
            return "Пользователь с таким Email уже существует";
        }
        default: {
            return "Слишком много попыток входа, попробуйте позже";
        }
    }
}
