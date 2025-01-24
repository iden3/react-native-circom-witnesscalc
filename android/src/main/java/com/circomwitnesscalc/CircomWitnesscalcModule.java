package com.circomwitnesscalc;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;

import android.util.Base64;

import io.iden3.circomwitnesscalc.WitnesscalcError;
import io.iden3.circomwitnesscalc.CircomWitnesscalcKt;


@ReactModule(name = CircomWitnesscalcModule.NAME)
public class CircomWitnesscalcModule extends ReactContextBaseJavaModule {
  public static final String NAME = "CircomWitnesscalc";

  public CircomWitnesscalcModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void calculateWitness(String inputs, String graph, Promise promise) {
    try {
      // Decode base64
      byte[] graphBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

      byte[] witness = CircomWitnesscalcKt.calculateWitness(
        inputs,
        graphBytes,
      );

      // Encode base64
      String witnessBase64 = Base64.encodeToString(witness, Base64.DEFAULT);

      promise.resolve(witnessBase64);
    } catch (WitnesscalcError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }
  }
}
