#ifdef RCT_NEW_ARCH_ENABLED
#import "CircomWitnesscalcSpec.h"

@interface CircomWitnesscalc : NSObject <NativeCircomWitnesscalcSpec>
#else
#import <React/RCTBridgeModule.h>

@interface CircomWitnesscalc : NSObject <RCTBridgeModule>
#endif

@end
