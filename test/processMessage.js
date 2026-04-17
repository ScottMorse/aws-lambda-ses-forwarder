/* global describe, it */

import assert from "assert";
import fs from "fs";

import * as index from "../index.mjs";

describe('index.mjs', () => {
  describe('#processMessage()', () => {
    it('should process email data and make updates', async () => {
      const data = {
        config: {},
        email: { source: "betsy@example.com" },
        emailData: fs.readFileSync("test/assets/message.txt").toString(),
        log: console.log,
        recipients: ["jim@example.com"],
        originalRecipient: "info@example.com"
      };
      const emailDataProcessed = fs.readFileSync("test/assets/message.processed.txt").toString();
      const result = await index.processMessage(data);
      assert.equal(result.emailData, emailDataProcessed, "processEmail updated email data");
    });

    it('should preserve an existing Reply-To header in emails', async () => {
      const data = {
        config: {},
        email: { source: "betsy@example.com" },
        emailData: fs.readFileSync("test/assets/message.replyto.txt").toString(),
        log: console.log,
        recipients: ["jim@example.com"],
        originalRecipient: "info@example.com"
      };
      const emailDataProcessed = fs.readFileSync("test/assets/message.processed.txt").toString();
      const result = await index.processMessage(data);
      assert.equal(result.emailData, emailDataProcessed, "processEmail updated email data");
    });

    it('should preserve an existing Reply-to header', async () => {
      const data = {
        config: {},
        email: { source: "betsy@example.com" },
        emailData: fs.readFileSync("test/assets/message.replyto_case.txt").toString(),
        log: console.log,
        recipients: ["jim@example.com"],
        originalRecipient: "info@example.com"
      };
      const emailDataProcessed = fs.readFileSync("test/assets/message.replyto_case.processed.txt").toString();
      const result = await index.processMessage(data);
      assert.equal(result.emailData, emailDataProcessed, "processEmail updated email data");
    });

    it('should allow overriding the From header in emails', async () => {
      const data = {
        config: { fromEmail: "noreply@example.com" },
        email: { source: "betsy@example.com" },
        emailData: fs.readFileSync("test/assets/message.txt").toString(),
        log: console.log,
        recipients: ["jim@example.com"],
        originalRecipient: "info@example.com"
      };
      const emailDataProcessed = fs.readFileSync("test/assets/message.fromemail.txt").toString();
      const result = await index.processMessage(data);
      assert.equal(result.emailData, emailDataProcessed, "processEmail updated email data");
    });

    it('should process multiline From header in emails', async () => {
      const data = {
        config: { fromEmail: "noreply@example.com" },
        email: { source: "betsy@example.com" },
        emailData: fs.readFileSync("test/assets/message.from_multiline.source.txt").toString(),
        log: console.log,
        recipients: ["jim@example.com"],
        originalRecipient: "info@example.com"
      };
      const emailDataProcessed = fs.readFileSync("test/assets/message.from_multiline.processed.txt").toString();
      const result = await index.processMessage(data);
      assert.equal(result.emailData, emailDataProcessed, "processEmail updated email data");
    });

    it('should allow adding a prefix to the Subject in emails', async () => {
      const data = {
        config: { subjectPrefix: "[PREFIX] " },
        email: { source: "betsy@example.com" },
        emailData: fs.readFileSync("test/assets/message.txt").toString(),
        log: console.log,
        recipients: ["jim@example.com"],
        originalRecipient: "info@example.com"
      };
      const emailDataProcessed = fs.readFileSync("test/assets/message.subjectprefix.txt").toString();
      const result = await index.processMessage(data);
      assert.equal(result.emailData, emailDataProcessed, "processEmail updated email data");
    });

    it('should allow overriding the To header in emails', async () => {
      const data = {
        config: { toEmail: "actualTarget@example.com" },
        email: { source: "betsy@example.com" },
        emailData: fs.readFileSync("test/assets/message.txt").toString(),
        log: console.log,
        recipients: ["jim@example.com"],
        originalRecipient: "info@example.com"
      };
      const emailDataProcessed = fs.readFileSync("test/assets/message.toemail.txt").toString();
      const result = await index.processMessage(data);
      assert.equal(result.emailData, emailDataProcessed, "processEmail updated email data");
    });
  });
});
