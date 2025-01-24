"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateWitness = calculateWitness;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'react-native-circom-witnesscalc' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const CircomWitnesscalcModule = isTurboModuleEnabled ? require('./NativeCircomWitnesscalc').default : _reactNative.NativeModules.CircomWitnesscalc;
const CircomWitnesscalc = CircomWitnesscalcModule ? CircomWitnesscalcModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
async function calculateWitness(inputs, graph) {
  return CircomWitnesscalc.calculateWitness(inputs, graph);
}
//# sourceMappingURL=index.js.map