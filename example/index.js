import { createHandler } from "aws-lambda-ses-forwarder";

// See aws-lambda-ses-forwarder/index.mjs for all options.
export const handler = createHandler({
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
});
