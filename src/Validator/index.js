'use strict';

const _ = require('lodash');
const Parser = require('../Parser');
const Validations = require('../Validations');
const Messages = require('../Messages');
const Modes = require('../Modes');
const Q = require('q');

/**
 * map all parsedRules into a validation messages to be executed
 * using Q.
 *
 * @param   {Object} data
 * @param   {Object} rules
 * @param   {Object} messages
 *
 * @return  {Array}
 *
 * @private
 */
function _mapValidations(data, rules, messages, runAll) {
  return _.map(rules, (validations, field) => {
    return Validator.validateField(data, field, validations, messages, runAll);
  });
}

/**
 * it manually maps all the errors returned by Q.allSettled
 * and throws them as an array only if there are errors.
 *
 * @param  {Array} results
 *
 * @return {void}
 * @throws {Error} If promise resolves to errors or a single error
 *
 * @private
 */
function _settleAllPromises(results) {
  const errors = _(results)
    .flatten()
    .map((result) => {
      return result.state === 'rejected' ? result.reason : null;
    })
    .compact()
    .value();
  if (_.size(errors)) {
    throw errors;
  }
}

const Validator = module.exports = {};

/**
 * The validation rules that imply the field is required.
 *
 * @var array
 */
Validator.implicitRules = ['required', 'required_if', 'required_when', 'required_with_any', 'required_with_all', 'required_without_any', 'required_without_all'];

/**
 * Determine if a given rule implies the attribute is required.
 *
 * @param  {Array}  validations
 * @return {boolean}
 */
Validator.isImplicit = function (validations) {
  return this.hasRule(validations, this.implicitRules);
};

/**
 * Determine if the attribute is validatable.
 *
 * @param  {Object}  data
 * @param  {String} field
 * @param  {Array} validations
 * @return {boolean}
 */
Validator.isValidatable = function (data, field, validations) {
  return this.isImplicit(validations) ||
    !this.skippable(data, field, validations);
};

/**
 * @description figures out whether value can be skipped
 * or not from validation, as non-existing values
 * should be validated using required.
 * @method skippable
 * @param  {Object}  data
 * @param  {String} field
 * @param  {Array} validations
 * @return {Boolean}
 * @private
 */
Validator.skippable = function (data, field, validations) {
  if (Modes.get() === 'strict') return typeof value === 'undefined';

  const fieldValue = _.get(data, field);
  const nullable = this.hasRule(validations, 'nullable');

  if (typeof fieldValue === 'string') {
    return fieldValue.length === 0;
  }
  return typeof fieldValue === 'undefined' || (fieldValue === null && nullable === true);
};

/**
 * Determine if the given attribute has a rule in the given set.
 *
 * @param  {Array}  validations
 * @param  {String|Array} rules
 * @return {Boolean}
 */
Validator.hasRule = function (validations, rules) {
  const rule = this.getRule(validations, rules);
  return rule.length > 0;
};

/**
 * Get a rule and its parameters for a given attribute.
 *
 * @param  {Array}  validations
 * @param  {String|Array} rules
 * @return {Array}
 */
Validator.getRule = function (validations, rules) {
  if (!_.isArray(rules)) rules = [rules];

  return _.filter(validations, (validation) => {
    return rules.indexOf(validation.name) !== -1;
  });
};

/**
 * validate a set of async validations mapped as field and rule
 * called rules.
 *
 * @param  {Object} data
 * @param  {Object} rules
 * @param  {Object} messages
 *
 * @return {Object|Array}
 */

Validator.validate = function (data, rules, messages) {
  messages = messages || {};
  const transformedRules = Parser.transformRules(data, rules);
  const validations = _mapValidations(data, transformedRules, messages);

  return Q.Promise((resolve, reject) => {
    Q.all(validations)
      .then(() => resolve(data))
      .catch((error) => reject([error]));
  });
};

/**
 * Just like validate but waits for all the validations to occur
 * and returns an array of errors.
 *
 * @param  {Object} data
 * @param  {Object} rules
 * @param  {Object} messages
 *
 * @return {Object|Array}
 */
Validator.validateAll = function (data, rules, messages) {
  messages = messages || {};
  const transformedRules = Parser.transformRules(data, rules);
  const validations = _mapValidations(data, transformedRules, messages, true);

  return Q.Promise((resolve, reject) => {
    Q.all(validations)
      .then(_settleAllPromises)
      .then(() => resolve(data))
      .catch(reject);
  });
};

/**
 * exposes an interface to extend the validator and add
 * new methods to it.
 *
 * @param  {String} name
 * @param  {Function} method
 * @param  {String} message
 *
 * @return {void}
 *
 * @throws {Error} If method is not a function
 */
Validator.extend = function (name, method, message) {
  if (typeof (method) !== 'function') {
    throw new Error('Invalid arguments, extend expects a method to execute');
  }
  Validations[name] = method;
  Messages.set(_.snakeCase(name), message);
};

Validator.is = require('../Raw');

/**
 * exposes an interface to extend the raw validator and add
 * own methods to it.
 *
 * @param  {String} name
 * @param  {Function} method
 *
 * @return {void}
 *
 * @throws {Error} If method is not a function
 */
Validator.is.extend = function (name, method) {
  if (typeof (method) !== 'function') {
    throw new Error('Invalid arguments, is.extends expects 2nd parameter as a function');
  }
  Validator.is[name] = method;
};

/**
 * @see Modes.set
 */
Validator.setMode = Modes.set;

/**
 * exposes an interface to extend the raw validator and add
 * own methods to it.
 *
 * @param  {String} name
 * @param  {Function} method
 *
 * @return {void}
 *
 * @throws {Error} If method is not a function
 */
Validator.extendImplicit = function (name) {
  this.implicitRules.push(_.snakeCase(name));
};

/**
 * validates a field with all assigned validations for that
 * field.
 *
 * @param  {Object}  data
 * @param  {String}  field
 * @param  {Object}  validations
 * @param  {Object}  messages
 * @param  {Boolean} [runAll]
 *
 * @return {Promise<Array>}
 */
Validator.validateField = function (data, field, validations, messages, runAll) {
  const method = runAll ? 'allSettled' : 'all';

  return Q[method](
    _.map(validations, (validation) => {
      return Validator.runValidationOnField(data, field, validation.name, messages, validation.args, validations);
    })
  );
};

/**
 * runs a single validation on a given field.
 *
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} validation
 * @param  {Object} messages
 * @param  {Array}  [args]
 * @param  {Array}  validations
 *
 * @return {Promise}
 */
Validator.runValidationOnField = function (data, field, validation, messages, args, validations) {
  const message = Messages.make(messages, field, validation, args);
  const validationMethod = Validator.getValidationMethod(validation);

  return Q.Promise((resolve, reject) => {
    if (!Validator.isValidatable(data, field, validations)) {
      return resolve('validation skipped');
    }

    validationMethod(data, field, message, args, validations)
      .then(resolve)
      .catch((error) => {
        reject({ field, validation, message: error });
      });
  });
};

/**
 * returns the validation method from the Validations
 * store or throws an error saying validation not
 * found.
 *
 * @param  {String} validation
 *
 * @return {Function}
 *
 * @throws {Error} If validation is not found
 */
Validator.getValidationMethod = function (validation) {
  return _.get(Validations, _.camelCase(validation), function () {
    throw new Error(`${validation} is not defined as a validation`);
  });
};
