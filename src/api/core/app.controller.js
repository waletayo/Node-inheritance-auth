import AppError from './app.error';
import {BAD_REQUEST} from "../../utils/status-codes";

/**
 * The App controller class where other controller inherits or
 * overrides pre defined and existing properties
 */
class AppController {
    /**
     * @param {Model} model The default model object
     * for the controller. Will be required to create
     * an instance of the controller
     */

    constructor(model) {
        if (new .target === AppController) {
            throw new TypeError('cannot construct Abstract instance directly');
        }
        this._model = model;
        this.create = this.create.bind(this);
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {function} next The callback to the next program handler
     * @return {Object} res The response object
     */
    async create(req, res, next) {
        let obj = req.body;
        const validator = this._model.validateCreate(obj);
        if (validator.passes()) {
            let object = new this._model(obj);
            await object.save().then((savedObject) => {
                console.log('saved Object:', savedObject);
                return res.status(200).json({
                    status: true,
                    data: savedObject
                });
            }, (err) => {
                return next(err);
            });
        } else {
            return res.status(400).json({
                status:false,
                code:BAD_REQUEST,
                res: validator.errors.all()
            });
        }
    }


}

export default AppController;
