'use strict';

const Raw = require('../Raw');
const Modes = require('../Modes');
const _ = require('lodash');
const gm = require('gm');

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
 * @return {Boolean}
 * @private
 */
const skippable = function (value) {
  return Modes.get() === 'strict' ? typeof (value) === undefined : !Raw.existy(value);
};

/**
 * @description Get the size of an attribute.
 * @method getSize
 * @param  {Mixed}  fieldValue
 * @param  {Boolean}  hasNumericRule
 * @return {Boolean}
 * @private
 */
const getSize = function (fieldValue, hasNumericRule) {
  hasNumericRule = _.isUndefined(hasNumericRule) ? false : hasNumericRule;

  if (Raw.numeric(fieldValue) && hasNumericRule) {
    return fieldValue;
  } else if (fieldValue instanceof Array) {
    return fieldValue.length;
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
 * @description enforces a field to be confirmed by another.
 * @method email
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.confirmed = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    const confirmedFieldValue = _.get(data, `${field}_confirmation`);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.email = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.accepted = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.after = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @description makes sure the value of field under validation is
 * after defined offset
 * @method afterOffsetOf
 * @param  {Object}      data
 * @param  {String}      field
 * @param  {String}      message
 * @param  {Array}      args
 * @param  {Function}      get
 * @return {Object}
 * @public
 */
Validations.afterOffsetOf = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    const offset = Number(args[0]);
    const key = args[1];
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }
    if (Raw.afterOffsetOf(fieldValue, offset, key)) {
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure the value of field under validation is
 * before defined offset
 * @method beforeOffsetOf
 * @param  {Object}      data
 * @param  {String}      field
 * @param  {String}      message
 * @param  {Array}      args
 * @param  {Function}      get
 * @return {Object}
 * @public
 */
Validations.beforeOffsetOf = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    const offset = Number(args[0]);
    const key = args[1];
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }
    if (Raw.beforeOffsetOf(fieldValue, offset, key)) {
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
 * @return {Object}
 * @public
 */
Validations.alpha = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.alphaNumeric = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.array = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.url = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.uuid = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.numeric = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.object = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.json = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.ip = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.ipv4 = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.ipv6 = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.integer = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @example
 *   accepts : true,false,0,1,"0","1"
 */
Validations.boolean = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    let fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.before = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.date = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.dateFormat = function (data, field, message, args) {
  const format = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.time = function (data, field, message, args) {
  const timeFormat = ['HH:mm:ss', 'HH:mm', 'HH:mm a'];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Boolean}
 * @public
 */
Validations.in = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.notIn = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @see  Raw.empty
 * @public
 */
Validations.required = function (data, field, message, args) {
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
 * @return {Object}
 * @public
 */
Validations.requiredIf = function (data, field, message, args) {
  const withField = args[0];
  return new Promise(function (resolve, reject) {
    const withFieldValue = _.get(data, withField);
    if (!withFieldValue) {
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
 * @return {Object}
 * @public
 */
Validations.requiredWhen = function (data, field, message, args) {
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
 * @return {Object}
 * @public
 */
Validations.requiredWithAny = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    let withFieldCount = 0;

    /**
     * looping through all items to make sure
     * one of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (itemValue) {
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
 * @return {Object}
 * @public
 */
Validations.requiredWithAll = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    let withFieldsCount = 0;

    /**
     * looping through all items to make sure
     * all of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (itemValue) {
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
 * @return {Object}
 * @public
 */
Validations.requiredWithoutAny = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    let withOutFieldCounts = 0;

    /**
     * looping through all items to make sure
     * one of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (!itemValue) {
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
 * @return {Object}
 * @public
 */
Validations.requiredWithoutAll = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    let withOutFieldCounts = 0;

    /**
     * looping through all items to make sure
     * one of them is present
     */
    args.forEach(function (item) {
      const itemValue = _.get(data, item);
      if (!itemValue) {
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
 * @return {Object}
 * @public
 */
Validations.same = function (data, field, message, args) {
  const targetedField = args[0];
  return new Promise(function (resolve, reject) {
    const targetedFieldValue = _.get(data, targetedField);
    if (!targetedFieldValue) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.different = function (data, field, message, args) {
  const targetedField = args[0];
  return new Promise(function (resolve, reject) {
    const targetedFieldValue = _.get(data, targetedField);
    if (!targetedFieldValue) {
      resolve('validation skipped');
      return;
    }

    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @description makes sure the value of field under
 * validation is equal to defined value
 * @method equals
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.equals = function (data, field, message, args) {
  const targetedValue = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }

    if (String(targetedValue) === String(fieldValue)) { // eslint-disable-line eqeqeq
      resolve('validation passed');
      return;
    }
    reject(message);
  });
};

/**
 * @description makes sure the value of field under
 * validation is not equal to the defined value
 * @method notEquals
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.notEquals = function (data, field, message, args) {
  const targetedValue = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }

    if (targetedValue !== fieldValue) {
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
Validations.range = function (data, field, message, args) {
  const min = args[0];
  const max = args[1];
  return new Promise(function (resolve, reject) {
    if (!min || !max) {
      return reject('min and max values are required for range validation');
    }

    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }

    if (Raw.between(fieldValue, min, max)) {
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
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }

    const isNumeric = hasRule(validations, numericRules);
    if (Number(getSize(fieldValue, isNumeric)) >= Number(args[0])) {
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
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }

    const isNumeric = hasRule(validations, numericRules);
    if (Number(getSize(fieldValue, isNumeric)) <= Number(args[0])) {
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
 * @return {Object}
 * @public
 */
Validations.includes = function (data, field, message, args) {
  const substring = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.startsWith = function (data, field, message, args) {
  const substring = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.endsWith = function (data, field, message, args) {
  const substring = args[0];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.regex = function (data, field, message, args) {
  const regexExp = args[0];
  const regexFlags = args[1];
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @return {Object}
 * @public
 */
Validations.string = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
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
 * @description Validate the dimensions of an image matches the given values
 * @method regex
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} args
 * @return {Object}
 * @public
 */
Validations.dimensions = function (data, field, message, args) {
  return new Promise(function (resolve, reject) {
    const fieldValue = _.get(data, field);
    if (skippable(fieldValue)) {
      resolve('validation skipped');
      return;
    }

    gm(fieldValue.path).identify(function (err, data) {
      if (err) return reject(message);

      let parameters = {};
      _.each(args, (arg) => {
        let argValue = arg.split('=');
        parameters[argValue[0]] = argValue[1];
      });

      if (
        !_.isUndefined(parameters.width) && parseInt(parameters.width) !== data.size.width ||
        !_.isUndefined(parameters.min_width) && parseInt(parameters.min_width) > data.size.width ||
        !_.isUndefined(parameters.max_width) && parseInt(parameters.max_width) < data.size.width ||
        !_.isUndefined(parameters.height) && parseInt(parameters.height) !== data.size.height ||
        !_.isUndefined(parameters.min_height) && parseInt(parameters.min_height) > data.size.height ||
        !_.isUndefined(parameters.max_height) && parseInt(parameters.max_height) < data.size.height
      ) {
        return reject(message);
      }

      if (!_.isUndefined(parameters.ratio)) {
        let ratio = parameters.ratio.split('/');

        let numerator = !_.isUndefined(ratio[0]) && ratio[0] !== '' ? parseInt(ratio[0]) : 1;
        let denominator = !_.isUndefined(ratio[0]) && ratio[1] !== '' ? parseInt(ratio[1]) : 1;
        if (numerator / denominator !== data.size.width / data.size.height) return reject(message);
      }

      resolve('validation passed');
      return;
    });
  });
};

/**
 * aliases
 */
Validations.between = Validations.range;
