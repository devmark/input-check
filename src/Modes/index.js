'use strict';

const availableModes = ['normal', 'strict'];
let currentMode = 'normal';

const Modes = module.exports = {};

Modes.set = function (mode) {
  if (availableModes.indexOf(mode) <= -1) {
    console.log(`indicative: ${mode} is not a valid mode, switching back to normal mode`);
    return;
  }
  currentMode = mode;
};

Modes.get = function () {
  return currentMode;
};
