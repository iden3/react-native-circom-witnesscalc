package com.circomwitnesscalc

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import io.iden3.circomwitnesscalc.CircomWitnesscalc

class CircomWitnesscalcModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun calculateWitness(inputs: String, graph: String, promise: Promise) {
    try {
      // Decode base64
      byte[] zkeyBytes = Base64.decode(graph, Base64.DEFAULT);

      ByteArray witness = CircomWitnesscalc.calculateWitness(
        inputs,
        graph
      );

      // Encode base64
      String witnessBase64 = Base64.encodeToString(witness, Base64.DEFAULT);

      promise.resolve(witnessBase64);
    } catch (RapidsnarkError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }

    promise.resolve(a * b)
  }

  companion object {
    const val NAME = "CircomWitnesscalc"
  }
}
