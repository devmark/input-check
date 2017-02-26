# Input check
Project base on [indicative](https://github.com/poppinss/indicative) 

Validator for nodejs and web.

[![Build Status](https://travis-ci.org/devmark/input-check.svg?branch=master)](https://travis-ci.org/devmark/input-check)
[![NPM](https://nodei.co/npm/input-check.png?downloads=true)](https://nodei.co/npm/input-check/)


## Available Validation Rules
Below is a list of all available validation rules and their function:

~~accepted~~
----
The field under validation must be yes, on, 1, or true. This is useful for validating "Terms of Service" acceptance.


active_url
----
The field under validation must have a valid A or AAAA record according to the dns_get_record PHP function.


after:(date|time)
----
The field under validation must be a value after a given date or time. 
```
const rules = {
  'createdAt'  : 'date|after:2016-11-11',
  'time'  : 'time|after:14:00:00'
}
```

~~after_or_equal:date~~
----
The field under validation must be a value after or equal to the given date. For more information, see the after rule.


alpha
----
The field under validation must be entirely alphabetic characters.


alpha_dash
----
The field under validation may have alpha-numeric characters, as well as dashes and underscores.


alpha_num
----
The field under validation must be entirely alpha-numeric characters.


array
----
The field under validation must be a PHP array.


before:date
----
The field under validation must be a value preceding the given date or time.
```
const rules = {
  'createdAt'  : 'date|before:2016-11-11',
  'time'  : 'time|before:14:00:00'
}
```

~~before_or_equal:date~~
----
The field under validation must be a value preceding or equal to the given date. The dates will be passed into the PHP strtotime function.


between:min,max
----
The field under validation must have a size between the given min and max. 

`Strings`, `numerics`, and `array` size rule.

Warning: Not support File type.

boolean
----
The field under validation must be able to be cast as a boolean. Accepted input are true, false,  1, 0, "1", and "0".


confirmed
----
The field under validation must have a matching field of foo_confirmation. For example, if the field under validation is password, a matching password_confirmation field must be present in the input.


date
----
The field under validation must be a valid date according to the `momentjs` function.


date_format:format
----
The field under validation must match the given format. You should use either date or  date_format when validating a field, not both.


~~different:field~~
----
The field under validation must have a different value than field.


~~digits:value~~
----
The field under validation must be numeric and must have an exact length of value.


~~digits_between:min,max~~
----
The field under validation must have a length between the given min and max.


~~dimensions~~
----
The file under validation must be an image meeting the dimension constraints as specified by the rule's parameters:

~~distinct~~
----
When working with arrays, the field under validation must not have any duplicate values.


email
----
The field under validation must be formatted as an e-mail address.


~~exists:table,column~~
----
The field under validation must exist on a given database table.


~~file~~
----
The field under validation must be a successfully uploaded file.


~~filled~~
----
The field under validation must not be empty when it is present.


~~image~~
----
The file under validation must be an image (jpeg, png, bmp, gif, or svg)


in:foo,bar,...  (in_array)
----
The field under validation must be included in the given list of values. Since this rule often requires you to implode an array.

```
const rules = {
  'company'  : 'string|in:google,yahoo,facebook',
}
```

in array example:
```
const rules = {
  'company.*'  : 'in:google,yahoo,facebook',
}
```

not_in:foo,bar,...
----
The field under validation must not be included in the given list of values.


integer
----
The field under validation must be an integer.

ip
----
The field under validation must be an IP address.

ipv4
----
The field under validation must be an IPv4 address.

ipv6
----
The field under validation must be an IPv6 address.

json
----
The field under validation must be a valid JSON string.

min:value
----
The field under validation must have a minimum value. 

`Strings`, `numerics`, and `array` size rule.

Warning: Not support File type.

max:value
----
The field under validation must be less than or equal to a maximum value. 
`Strings`, `numerics`, and `array` size rule.

Warning: Not support File type.

~~mimetypes:text/plain,...~~
----
The file under validation must match one of the given MIME types:

~~mimes:foo,bar,...~~
----
The file under validation must have a MIME type corresponding to one of the listed extensions.


~~nullable~~
----
The field under validation may be null. This is particularly useful when validating primitive such as strings and integers that can contain null values.

numeric
----
The field under validation must be numeric.


~~present~~
----
The field under validation must be present in the input data but can be empty.


regex:pattern
----
The field under validation must match the given regular expression.

Note: When using the regex pattern, it may be necessary to specify rules in an array instead of using pipe delimiters, especially if the regular expression contains a pipe character.


required
----
The field under validation must be present in the input data and not empty. A field is considered "empty" if one of the following conditions are true:

The value is null.
The value is an empty string.
The value is an empty array or empty Countable object.
The value is an uploaded file with no path.

required_if:anotherfield,value,...
----
The field under validation must be present and not empty if the anotherfield field is equal to any value.


required_unless:anotherfield,value,...
----
The field under validation must be present and not empty unless the anotherfield field is equal to any value.


required_with:foo,bar,...
----
The field under validation must be present and not empty only if any of the other specified fields are present.


required_with_all:foo,bar,...
----
The field under validation must be present and not empty only if all of the other specified fields are present.


required_without:foo,bar,...
----
The field under validation must be present and not empty only when any of the other specified fields are not present.


required_without_all:foo,bar,...
----
The field under validation must be present and not empty only when all of the other specified fields are not present.


~~same:field~~
----
The given field must match the field under validation.


~~size:value~~
----
The field under validation must have a size matching the given value. For string data, value corresponds to the number of characters. For numeric data, value corresponds to a given integer value. For an array, size corresponds to the count of the array. For files, size corresponds to the file size in kilobytes.


string
----
The field under validation must be a string. If you would like to allow the field to also be null, you should assign the nullable rule to the field.


~~timezone~~
----
The field under validation must be a valid timezone identifier according to the  timezone_identifiers_list PHP function.


~~unique:table,column,except,idColumn~~
----
The field under validation must be unique in a given database table. If the column option is not specified, the field name will be used.

url
----
The field under validation must be a valid URL.


### Different With Laravel Validation

Time
----
The field under validation must be a valid Time .
Support format: `HH:mm:ss`, `HH:mm`, `HH:mm a`








## Custom messages

```
const messages = {
  required: 'This field is required to complete the registration process.'
}

inputCheck
.validate(data, rules, messages)
.then(function () {
  // validation passed
})
.catch(function (errors) {
  // validation failed
})
```



## Custom Validation
```
const _ = require('lodash');

const unique = function (data, field, message, args) {

  return new Promise(function (resolve, reject) {

    // get value of field under validation
    const fieldValue = _.get(data, field);

    // resolve if value does not exists, value existence
    // should be taken care by required rule.
    if(!fieldValue) {
      return resolve('validation skipped');
    }

    // checking for username inside database
    User
    .where('username', fieldValue)
    .then(function (result) {
      if(result){
        reject(message);
      }else{
        resolve('username does not exists');
      }
    });
    .catch(resolve);

  });

};
```

- data - It is the actual data object passed to validate method.
- field - Field is a string value of field under validation.
- message - Error message to return.
- args - An array of values your rule is expecting, it may be empty depending upon your rule expectations. For example min:4 will have args array as [4].

```
inputCheck.extend('unique', unique, 'Field should be unique')
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

 * Copyright (c) Harminder Virk <virk@adonisjs.com>
 * Copyright (c) Devmark <hc.devmark@gmail.com>