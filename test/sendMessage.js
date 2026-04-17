/* global describe, it */

import assert from "assert";

import * as index from "../index.mjs";

describe('index.mjs', () => {
  describe('#sendMessage()', () => {
    it('should invoke the AWS SES SDK to send the message', async () => {
      const data = {
        recipients: ["jim@example.com"],
        originalRecipients: ["info@example.com"],
        emailData: "message data",
        context: {},
        log: console.log,
        ses: {
          send: () => Promise.resolve({status: "ok"})
        }
      };
      await index.sendMessage(data);
    });

    it('should result in failure if the AWS SES SDK cannot send the message', async () => {
      const data = {
        recipients: ["jim@example.com"],
        originalRecipients: ["info@example.com"],
        emailData: "message data",
        context: {},
        log: console.log,
        ses: {
          send: () => Promise.reject(new Error("send failed"))
        }
      };
      await assert.rejects(index.sendMessage(data), "sendMessage aborted operation");
    });
  });
});
