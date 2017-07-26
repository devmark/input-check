'use strict';

const _ = require('lodash');

const Helper = {
  trim: function (input) {
    if (typeof input === 'string') {
      return input.trim();
    } else if (typeof input === 'object') {
      for (var key in input) {
        input[key] = Helper.trim(input[key]);
      }
    }

    return input;
  },
  emptyStringToNull: function (input) {
    if (typeof input === 'string') {
      return input === '' ? null : input;
    } else if (typeof input === 'object') {
      for (var key in input) {
        input[key] = Helper.emptyStringToNull(input[key]);
      }
    }

    return input;
  }
};

const Transformer = function (input, rules) {
  this.input = input || {};
  this.rules = rules || {};
  this.include = [];
};

Transformer.prototype.trim = function (input) {
  this.input = Helper.trim(this.input);
  return this;
};

Transformer.prototype.emptyStringToNull = function (input) {
  this.input = Helper.emptyStringToNull(this.input);
  return this;
};

Transformer.prototype.pick = function (include, exclude) {
  include = include || [];
  exclude = exclude || [];

  include = _.concat(include, this.include);

  let result = _.cloneDeep(this.input);

  result = _.pick(result, exclude.length > 0 ? Object.keys(_.omit(this.rules, exclude)) : Object.keys(this.rules));
  return _.pickBy(result, (val, key) => {
    return include.indexOf(key) !== -1;
  });
};

Transformer.prototype.pickAll = function () {
  return this.input;
};

module.exports = Transformer;
