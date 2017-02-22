'use strict'

const Validator = require('./src/Validator')
const Sanitization = require('./src/Sanitization')

module.exports = {
  validate: Validator.validate,
  validateAll: Validator.validateAll,
  extend: Validator.extend,
  is: Validator.is,
  'is.extend': Validator.is.extend,
  sanitize: Sanitization.sanitize,
  sanitizor: Sanitization.sanitizor,
  'sanitizor.extend': Sanitization.sanitizor.extend
}
