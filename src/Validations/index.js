'use strict';

const Raw = require('../Raw');
const Modes = require('../Modes');
const _ = require('lodash');
const sharp = require('sharp');
const fs = require('fs');

/**
 * @module Validations
 * @description List of schema validations
 * @type {Object}
 */
let Validations = module.exports = {};

/**
 * @description figures out whether value can be skipped
 * or not from validation, as non-existing values
 * should be validated using required.
 * @method skippable
 * @param  {Mixed}  value
 * @param  {Boolean} nullable
 * @return {Boolean}
 * @private
 */
const skippable = function (value, nullable) {
  if (Modes.get() === 'strict') return typeof value === 'undefined';

  if (typeof value === 'string') {
    return value.length === 0;
  }
  return typeof value === 'undefined' || (value === null && nullable === true);
};

/**
 * @description Get the size of an attribute.
 * @method getSize
 * @param  {Mixed}  fieldValue
 * @param  {Boolean}  hasNumericRule
 * @param  {Boolean}  hasFileRule
 * @return {Boolean}
 * @private
 */
const getSize = function (fieldValue, hasNumericRule, hasFileRule) {
  hasNumericRule = _.isUndefined(hasNumericRule) ? false : hasNumericRule;
  hasFileRule = _.isUndefined(hasFileRule) ? false : hasFileRule;
  if (Raw.numeric(fieldValue) && hasNumericRule) {
    return fieldValue;
  } else if (fieldValue instanceof Array) {
    return fieldValue.length;
  } else if (hasFileRule) {
    const stat = fs.statSync(fieldValue.path);
    const size = _.get(stat, 'size');
    if (!_.isUndefined(size)) return (size / 1024).toFixed(2) * 1;
  }

  return String(fieldValue).length;
};

/**
 * Determine if the given attribute has a rule in the given set.
 *
 * @param  {Array}  validations
 * @param  {String|Array} rules
 * @return {Boolean}
 */
const hasRule = function (validations, rules) {
  if (!_.isArray(rules)) rules = [rules];

  const filterRules = _.filter(validations, (validation) => {
    return rules.indexOf(validation.name) !== -1;
  });

  return filterRules.length > 0;
};

/**
 * The numeric related validation rules.
 *
 * @return {Array}
 * @private
 */
const numericRules = ['numeric', 'integer'];

/**
 * The file related validation rules.
 *
 * @return {Array}
 * @private
 */
const fileRules = ['file', 'image'];

/**
 * @description enforces a field to be confirmed by another.
 * @method email
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.confirmed = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    const confirmedFieldValue = _.get(data, `${field}_confirmation`);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.same(fieldValue, confirmedFieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces a field to be an email if present
 * @method email
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.email = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.email(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces a field to be accepted
 * @method accepted
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.accepted = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.truthy(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces a field to be after a certain date
 * @method after
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.after = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.after(fieldValue, args[0])) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure the field under validation is a
 * valid alpha string
 * @method alpha
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.alpha = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.alpha(fieldValue) && fieldValue !== null) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure the field under validation is a
 * valid alphaNumeric string
 * @method alphaNumeric
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.alphaNumeric = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.alphaNumeric(fieldValue) && fieldValue !== null) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * is a valid array
 * @method array
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.array = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.array(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * is a valid url
 * @method url
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.url = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.url(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * is a valid uuid
 * @method uuid
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.uuid = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.uuid(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * is a valid numeric
 * @method object
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.numeric = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (Raw.numeric(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * is a valid object
 * @method object
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.object = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.object(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * is a valid json string
 * @method json
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.json = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.json(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation is a
 * valid ip address
 * @method ip
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.ip = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.ip(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation is a
 * valid ipv4 address
 * @method ipv4
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.ipv4 = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.ipv4(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation is a
 * valid ipv6 address
 * @method ipv6
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.ipv6 = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.ipv6(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation is a
 * valid integer
 * @method integer
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.integer = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Number.isInteger(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation is
 * a boolean
 * @method boolean
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @return {validations
 * @example
 *   accepts : true,false,0,1,"0","1"
 */
Validations.boolean = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    let fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    /**
     * converting 0 and 1 strings to numbers
     */
    if (fieldValue === '0') {
      fieldValue = 0;
    } else if (fieldValue === '1') {
      fieldValue = 1;
    }

    if (Raw.boolean(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is before
 * defined date
 * @method before
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.before = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.before(fieldValue, args[0])) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is a valid
 * date
 * @method date
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.date = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.dateFormat(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is a valid
 * date according to given format
 * @method dateFormat
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.dateFormat = function (data, field, message, args, validations) {
  const format = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.dateFormat(fieldValue, format)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};


/**
 * @description makes sure field under validation is a valid time
 * @method time
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.time = function (data, field, message, args, validations) {
  const timeFormat = ['HH:mm:ss', 'HH:mm', 'HH:mm a'];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.dateFormat(fieldValue, timeFormat)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field value is under defined
 * values
 * @method in
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Boolean}
 * @public
 */
Validations.in = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (Raw.inArray(fieldValue, args)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field value is not in one
 * of the defined values
 * @method notIn
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.notIn = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    if (!Raw.inArray(fieldValue, args)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces a field to be present and should not be
 * null or undefined
 * @method required
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @return {validations
 * @see  Raw.empty
 * @public
 */
Validations.required = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (!Raw.empty(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is present when
 * conditional field value exists
 * @method requiredIf
 * @param  {Object}   data
 * @param  {String}   field
 * @param  {String}   message
 * @param  {Array}   args
 * @param  {Function}   get
 * @param  {Function}  validations
 * @return {Object}
 * @public
 */
Validations.requiredIf = function (data, field, message, args, validations) {
  const withField = args[0];
  return new Promise(function (resolve, reject) {
    const withFieldValue = _.get(data, withField);
    if (skippable(withFieldValue)) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (!Raw.empty(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is present and
 * value matches to the conditional field value
 * @method requiredWhen
 * @param  {Object}   data
 * @param  {String}   field
 * @param  {String}   message
 * @param  {Array}   args
 * @param  {Function}   get
 * @param  {Function}  validations
 * @return {Object}
 * @public
 */
Validations.requiredWhen = function (data, field, message, args, validations) {
  const withField = args[0];
  const withfieldExpectedValue = args[1];
  return new Promise(function (resolve, reject) {
    const withFieldValue = _.get(data, withField);
    if (String(withfieldExpectedValue) !== String(withFieldValue)) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (!Raw.empty(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces field under validation to have data
 * when any of the other expected fields are present
 * @method requiredWithAny
 * @param  {Object}        data
 * @param  {String}        field
 * @param  {String}        message
 * @param  {Array}        args
 * @param  {Function}        get
 * @param  {Function}       validations
 * @return {Object}
 * @public
 */
Validations.requiredWithAny = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    let withFieldCount = 0;

    /**
     * looping through all items to make sure
     * one of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (!skippable(itemValue)) {
        withFieldCount++;
        return;
      }
    });

    if (withFieldCount === 0) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (!Raw.empty(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces field under validation to have data
 * when any all of the other expected fields are present
 * @method requiredWithAll
 * @param  {Object}        data
 * @param  {String}        field
 * @param  {String}        message
 * @param  {Array}         args
 * @param  {Function}      get
 * @param  {Function}     validations
 * @return {Object}
 * @public
 */
Validations.requiredWithAll = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    let withFieldsCount = 0;

    /**
     * looping through all items to make sure
     * all of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (!skippable(itemValue)) {
        withFieldsCount++;
      }
    });

    if (withFieldsCount !== args.length) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (!Raw.empty(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces field under validation to have data
 * when any of the other expected fields are missing
 * @method requiredWithoutAny
 * @param  {Object}        data
 * @param  {String}        field
 * @param  {String}        message
 * @param  {Array}        args
 * @param  {Function}        get
 * @param  {Function}       validations
 * @return {Object}
 * @public
 */
Validations.requiredWithoutAny = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    let withOutFieldCounts = 0;

    /**
     * looping through all items to make sure
     * one of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (skippable(itemValue)) {
        withOutFieldCounts++;
        return;
      }
    });

    if (withOutFieldCounts === 0) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (!Raw.empty(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description enforces field under validation to have data
 * when all of the other expected fields are missing
 * @method requiredWithoutAll
 * @param  {Object}        data
 * @param  {String}        field
 * @param  {String}        message
 * @param  {Array}         args
 * @param  {Function}      get
 * @param  {Function}     validations
 * @return {Object}
 * @public
 */
Validations.requiredWithoutAll = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    let withOutFieldCounts = 0;

    /**
     * looping through all items to make sure
     * one of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (skippable(itemValue)) {
        withOutFieldCounts++;
        return;
      }
    });
    if (withOutFieldCounts !== args.length) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (!Raw.empty(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure the value of field under validation
 * matches to the value of targeted field
 * @method same
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.same = function (data, field, message, args, validations) {
  const targetedField = args[0];
  return new Promise(function (resolve, reject) {
    const targetedFieldValue = _.get(data, targetedField);
    if (!targetedFieldValue) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (targetedFieldValue === fieldValue) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure the value of field under validation
 * does not matches to the value of targeted field
 * @method different
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.different = function (data, field, message, args, validations) {
  const targetedField = args[0];
  return new Promise(function (resolve, reject) {
    const targetedFieldValue = _.get(data, targetedField);
    if (!targetedFieldValue) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (targetedFieldValue !== fieldValue) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * is between a given range
 * @method range
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.range = function (data, field, message, args, validations) {
  const min = args[0];
  const max = args[1];
  return new Promise(function (resolve, reject) {
    if (!min || !max) {
      return reject('min and max values are required for range validation');
    }

    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    const isNumeric = hasRule(validations, numericRules);
    if (Raw.between(getSize(fieldValue, isNumeric), min, max)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};


/**
 * @description makes sure the length of field under
 * validation is greater than defined length.
 * @method min
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.min = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    const isNumeric = hasRule(validations, numericRules);
    const isFile = hasRule(validations, fileRules);
    if (Number(getSize(fieldValue, isNumeric, isFile)) >= Number(args[0])) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure the length of field under
 * validation is less than defined length.
 * @method max
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.max = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    const isNumeric = hasRule(validations, numericRules);
    const isFile = hasRule(validations, fileRules);
    if (Number(getSize(fieldValue, isNumeric, isFile)) <= Number(args[0])) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation contains a
 * given substring
 * @method includes
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.includes = function (data, field, message, args, validations) {
  const substring = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (String(fieldValue).includes(substring)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * starts with given substring
 * @method startsWith
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.startsWith = function (data, field, message, args, validations) {
  const substring = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (String(fieldValue).startsWith(substring)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure value of field under validation
 * ends with given substring
 * @method endsWith
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.endsWith = function (data, field, message, args, validations) {
  const substring = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (String(fieldValue).endsWith(substring)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation satifies defined
 * regex
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.regex = function (data, field, message, args, validations) {
  const regexExp = args[0];
  const regexFlags = args[1];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    const expression = regexFlags ? new RegExp(regexExp, regexFlags) : new RegExp(regexExp);
    if (Raw.regex(fieldValue, expression)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is a string
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.string = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (Raw.string(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is lower case
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.lowercase = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (String(fieldValue).toLowerCase() === String(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure field under validation is upper case
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.uppercase = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (String(fieldValue).toUpperCase() === String(fieldValue)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description Validate the input has correct size
 * @method max
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.size = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }
    const isNumeric = hasRule(validations, numericRules);
    const isFile = hasRule(validations, fileRules);
    if (Number(getSize(fieldValue, isNumeric, isFile)) === Number(args[0])) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description Validate the input is a file
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.file = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (!_.isObject(fieldValue) && !_.has(fieldValue, 'mimetype') && !_.has(fieldValue, 'path')) {
      reject(message);
      return;
    }

    fs.exists(fieldValue.path, (exists) => {
      if (!exists) {
        reject(message);
        return;
      }

      resolve('validation passed');
      return;
    });
  });
};

/**
 * @description Validate the mime type of an file matches the given values
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.mimetypes = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    if (fieldValue.mimetype === args[0]) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description Validate the file is a image type
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.image = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    const image = sharp(fieldValue.path);
    image.metadata()
      .then(function () {
        resolve('validation passed');
        return;
      })
      .catch(function (err) {
        reject(message);
        return;
      });
  });
};

/**
 * @description Validate the dimensions of an image matches the given values
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Object}
 * @public
 */
Validations.dimensions = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue, hasRule(validations, 'nullable'))) {
      resolve('validation skipped');
      return;
    }

    const image = sharp(fieldValue.path);
    image.metadata()
      .then(function (metadata) {
        let parameters = {};
        _.each(args, (arg) => {
          const argValue = arg.split('=');
          parameters[argValue[0]] = argValue[1];
        });

        if (
          !_.isUndefined(parameters.width) && parseInt(parameters.width) !== metadata.width ||
          !_.isUndefined(parameters.min_width) && parseInt(parameters.min_width) > metadata.width ||
          !_.isUndefined(parameters.max_width) && parseInt(parameters.max_width) < metadata.width ||
          !_.isUndefined(parameters.height) && parseInt(parameters.height) !== metadata.height ||
          !_.isUndefined(parameters.min_height) && parseInt(parameters.min_height) > metadata.height ||
          !_.isUndefined(parameters.max_height) && parseInt(parameters.max_height) < metadata.height
        ) {
          reject(message);
          return;
        }

        if (!_.isUndefined(parameters.ratio)) {
          let ratio = parameters.ratio.split('/');

          let numerator = !_.isUndefined(ratio[0]) && ratio[0] !== '' ? parseInt(ratio[0]) : 1;
          let denominator = !_.isUndefined(ratio[0]) && ratio[1] !== '' ? parseInt(ratio[1]) : 1;
          if (numerator / denominator !== metadata.width / metadata.height) return reject(message);
        }

        resolve('validation passed');
        return;
      })
      .catch(function (err) {
        reject(message);
        return;
      });
  });
};


/**
 * @description field value is allow null type
 * values
 * @method nullable
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Boolean}
 * @public
 */
Validations.nullable = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    resolve('validation skipped');
    return;
  });
};

/**
 * @description Validate the value must exist
 * values
 * @method nullable
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @param  {Array} validations
 * @return {Boolean}
 * @public
 */
Validations.present = function (data, field, message, args, validations) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);

    if (typeof fieldValue !== 'undefined') {
      resolve('validation passed');
    }

    reject(message);
  });
};

/**
 * aliases
 */
Validations.between = Validations.range;
