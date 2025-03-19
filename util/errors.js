exports.setValidationError = function(error, msg) {
    let errors = {}
    
    error.details.map(x => {
        errors[x.path] = x.message
    });

    return {
        success: false,
        title: Object.keys(errors).length > 1 ? 'Validation errors' : 'Validation error',
        message: 'There were errors in your submission. See below for specific details.',
        errors: errors
    }
}

exports.setError = function(title, msg) {
    return {
        success: false,
        title: title,
        message: msg
    }
}