#import "CircomWitnesscalc.h"
#import <React/RCTLog.h>

#if __has_include(<react_native_circom_witnesscalc/react_native_circom_witnesscalc-Swift.h>)
#import <react_native_circom_witnesscalc/react_native_circom_witnesscalc-Swift.h>
#else
#import "react_native_circom_witnesscalc-Swift.h"
#endif

@implementation CircomWitnesscalc
RCT_EXPORT_MODULE(CircomWitnesscalc)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(calculateWitness:(nonnull NSString *)inputs
                  graph:(nonnull NSString *)graph
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // NSData decode base64
    NSData* inputsData = [[NSData alloc]initWithBase64EncodedString:inputs options:0];
    NSData* graphData = [[NSData alloc]initWithBase64EncodedString:graph options:0];

    NSError* error;
    NSString *result = [
        CircomWitnesscalcProxy
        calculateWitnessProxyWithInputs: inputsData
        graph: graphData
        error: &error
    ];

    if (!error) {
        resolve(result);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeCircomWitnesscalcSpecJSI>(params);
}
#endif

@end
