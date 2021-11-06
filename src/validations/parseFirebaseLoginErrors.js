import { LOGIN_ERROR_CONSTANTS } from 'src/constants/login';

export const parseErrorMessage = (error) => {
    switch (error.code) {
        case "auth/user-not-found":
            return LOGIN_ERROR_CONSTANTS.USER_NOT_FOUND;
        case "auth/wrong-password":
            return LOGIN_ERROR_CONSTANTS.INCORRECT_PASSWORD;
        case "auth/invalid-email":
            return LOGIN_ERROR_CONSTANTS.BAD_EMAIL;
        case "auth/email-already-in-use":
            return LOGIN_ERROR_CONSTANTS.EMAIL_ALREADY_IN_USE;
        default:
            return LOGIN_ERROR_CONSTANTS.UNSPECTED_ERROR;
    }

}