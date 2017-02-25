# Input check
Project base on [indicative](https://github.com/poppinss/indicative) 

Laravel inspired validator for nodejs and web.

[![Build Status](https://travis-ci.org/devmark/input-check.svg?branch=master)](https://travis-ci.org/devmark/input-check)
[![Coverage Status](https://coveralls.io/repos/github/devmark/input-check/badge.svg?branch=master)](https://coveralls.io/github/devmark/input-check?branch=master)

[![NPM](https://nodei.co/npm/input-check.png?downloads=true)](https://nodei.co/npm/input-check/)

## Usage
```javascript
const rules = {
  username  : 'required|alpha_numeric',
  email     : 'required|email',
  password  : 'required|min:6|max:30',
  'profile.username'  : 'required',
  'profile.password'  : 'required|min:6|max:30'
}

const data = {
  username  : 'doe22',
  email     : 'doe@example.org',
  password  : 'doe123456'
}

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


## License
[The MIT License](http://opensource.org/licenses/MIT)

 * Copyright (c) Harminder Virk <virk@adonisjs.com>
 * Copyright (c) Devmark <hc.devmark@gmail.com>
