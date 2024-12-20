import Foundation

import CircomWitnesscalc


@objc(CircomWitnesscalcProxy)
public class CircomWitnesscalcProxy : NSObject {
    @objc
    public static func calculateWitness(
        inputs: NSData,
        graph: NSData
    ) throws -> NSString {
        do {
            let witness = try calculateWitness(
                inputs: inputs as! Data,
                graph: graph as! Data
            )

            return witness.base64EncodedString as NSString
        } catch let error {
            throw error
        }
    }
}
