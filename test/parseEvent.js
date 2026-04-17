/* global describe, it */

import assert from "assert";
import fs from "fs";

import * as index from "../index.mjs";

describe('index.mjs', () => {
  describe('#parseEvent()', () => {
    it('should parse email and recipients from an SES event', async () => {
      const data = {
        event: JSON.parse(fs.readFileSync("test/assets/event.json")),
        log: console.log,
        context: {}
      };
      const result = await index.parseEvent(data);
      assert.equal(result.email.messageId,
        "o3vrnil0e2ic28trm7dakrc2v0clambda4nbp0g1",
        "parseEvent found messageId");
      assert.equal(result.email.source,
        "janedoe@example.com",
        "parseEvent found message source");
      assert.equal(result.recipients[0],
        "info@example.com",
        "parseEvent found message recipients");
    });

    it('should reject an invalid SES event', async () => {
      const data = {
        event: {},
        log: console.log,
        context: {}
      };
      await assert.rejects(index.parseEvent(data), "parseEvent threw an error");
    });
  });
});
