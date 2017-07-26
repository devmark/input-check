'use strict';

const Validator = require('./src/Validator');
const Sanitization = require('./src/Sanitization');
const Transform = require('./src/Transforms');

module.exports = {
  validate: Validator.validate,
  validateAll: Validator.validateAll,
  extend: Validator.extend,
  extendImplicit: Validator.extendImplicit,

  is: Validator.is,
  'is.extend': Validator.is.extend,
  sanitize: Sanitization.sanitize,
  sanitizor: Sanitization.sanitizor,
  sanitizeAll: Sanitization.sanitizeAll,
  'sanitizor.extend': Sanitization.sanitizor.extend,

  transform: Validator.Transform,
};
