const e = require('@util/errors');

function isAdmin(req, res, next) {
    if (req.user.role === 1) {
        next();
    } else {
        const error = e.setError('Access denied.', 'Only Daddy can do this.')
        res.json(error);
    }
}

function isBaby(req, res, next) {
    if (req.user.role === 2) {
        next();
    } else {
        const error = e.setError('Access denied.', 'Only Babygirl can do this.')
        res.json(error);
    }
}

function isSelforAdmin(req, res, next) {  
    if ((req.user.id == req.body.id || req.user.id == req.params.id) || req.user.role === 1) {
        next();
    } else {
        const error = e.setError('Access denied.', 'Only Daddy can do this.')
        res.json(error);
    }
}

function isBabyorAdmin(req, res, next) {    
    
    if (req.user.role === 1 || req.user.role === 2) {
        next();
    } else {
        const error = e.setError('Access denied.', 'Only Daddy or Babygirl can do this.')
        res.json(error);
    }
}

module.exports = {
    isAdmin,
    isBaby,
    isSelforAdmin,
    isBabyorAdmin
};