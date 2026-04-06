/* global describe, it */

import assert from "assert";
import fs from "fs";

import { GetObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";

import * as index from "../index.js";

describe('index.js', () => {
  describe('#createHandler()', () => {
    it('mock data should result in a success', async () => {
      const event = JSON.parse(fs.readFileSync("test/assets/event.json"));
      const context = {};
      const overrides = {
        s3: {
          send: (options) => {
            if (options instanceof CopyObjectCommand)
              return Promise.resolve();
            else if (options instanceof GetObjectCommand)
              return Promise.resolve({
                Body: { transformToString: () => "email data" }
              });
          }
        },
        ses: {
          send: () => Promise.resolve({status: "ok"})
        },
        config: {
          emailBucket: "bucket",
          emailKeyPrefix: "prefix/",
          forwardMapping: {
            "info@example.com": ["jim@example.com"]
          }
        }
      };
      await index.createHandler(overrides)(event, context);
    });

    it('should accept functions as steps', (done) => {
      const event = {};
      const context = {};
      const overrides = {
        steps: [
          (data) => {
            if (data && data.context) done();
          }
        ]
      };
      index.createHandler(overrides)(event, context);
    });

    it('should report failure for invalid steps', async () => {
      const event = {};
      const context = {};
      const overrides = {
        steps: [1, ['test']]
      };
      await assert.rejects(index.createHandler(overrides)(event, context));
    });

    it('should report failure for steps returning a rejection', async () => {
      const event = {};
      const context = {};
      let logCalled = false;
      const overrides = {
        steps: [
          () => Promise.reject(new Error("test error"))
        ],
        log: () => { logCalled = true; }
      };
      await assert.rejects(index.createHandler(overrides)(event, context));
      assert.ok(logCalled, "custom log function called successfully");
    });
  });
});
