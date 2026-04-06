/* global describe, it */

import assert from "assert";

import { GetObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import * as index from "../index.js";

describe('index.js', () => {
  describe('#fetchMessage()', () => {
    it('should invoke the AWS S3 SDK to fetch the message', async () => {
      const data = {
        config: {
          emailBucket: "bucket",
          emailKeyPrefix: "prefix/"
        },
        email: { messageId: "abc" },
        log: console.log,
        s3: {
          send: (options) => {
            if (options instanceof CopyObjectCommand)
              return Promise.resolve();
            else if (options instanceof GetObjectCommand)
              return Promise.resolve({
                Body: { transformToString: () => "email data" }
              });
          }
        }
      };
      const result = await index.fetchMessage(data);
      assert.equal(result.emailData, "email data", "fetchMessage returned email data");
    });

    it('should result in failure if the AWS S3 SDK cannot copy the message', async () => {
      const data = {
        config: {
          emailBucket: "bucket",
          emailKeyPrefix: "prefix/"
        },
        email: { messageId: "abc" },
        log: console.log,
        s3: {
          send: () => Promise.reject(new Error("copy failed"))
        }
      };
      await assert.rejects(index.fetchMessage(data), "fetchMessage aborted operation");
    });

    it('should result in failure if the AWS S3 SDK cannot get the message', async () => {
      const data = {
        config: {
          emailBucket: "bucket",
          emailKeyPrefix: "prefix/"
        },
        email: { messageId: "abc" },
        log: console.log,
        s3: {
          send: (options) => {
            if (options instanceof CopyObjectCommand)
              return Promise.resolve();
            else if (options instanceof GetObjectCommand)
              return Promise.reject(new Error("get failed"));
          }
        }
      };
      await assert.rejects(index.fetchMessage(data), "fetchMessage aborted operation");
    });
  });
});
