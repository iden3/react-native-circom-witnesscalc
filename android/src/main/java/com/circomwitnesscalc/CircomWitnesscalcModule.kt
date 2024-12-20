package com.circomwitnesscalc

import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import io.iden3.circomwitnesscalc.WitnesscalcError
import io.iden3.circomwitnesscalc.calculateWitness

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
      val graphBytes = Base64.decode(graph, Base64.DEFAULT);

      val witness = calculateWitness(
        inputs,
        graphBytes
      )

      // Encode base64
      val witnessBase64 = Base64.encodeToString(witness, Base64.DEFAULT);

      promise.resolve(witnessBase64);
    } catch (e: WitnesscalcError) {
      promise.reject(e.code.toString(), e.message);
    }
  }

  companion object {
    const val NAME = "CircomWitnesscalc"
  }
}
