const e = require('@util/errors');

exports.validateSchema = function(schema, options, req, res, next){
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        const errors = e.setValidationError(error)
        res.json(errors);
    } else {
        req.body = value;
        next();
    }
}