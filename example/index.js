import { handler as forwarderHandler } from "aws-lambda-ses-forwarder";

export const handler = async (event, context) => {
  // See aws-lambda-ses-forwarder/index.js for all options.
  const overrides = {
    config: {
      fromEmail: "noreply@example.com",
      emailBucket: "s3-bucket-name",
      emailKeyPrefix: "emailsPrefix/",
      forwardMapping: {
        "info@example.com": [
          "example.john@example.com",
          "example.jen@example.com"
        ],
        "abuse@example.com": [
          "example.jim@example.com"
        ]
      }
    }
  };
  return forwarderHandler(event, context, overrides);
};
