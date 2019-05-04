import Validator from 'validatorjs';
import AppValidation from "../../core/app.validation";

/**
 * The App Validation class
 */
class RegValidation extends AppValidation {

    create(obj) {
        const rules = {
            name: 'required',
            username: 'required',
            phoneNumber: 'required',
            email: 'required',
            password: 'required'
        };
        const validator = new Validator(obj, rules);
        return {
            validator,
            validated: validator.passes()
        };
    }
}

export default RegValidation