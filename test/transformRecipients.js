/* global describe, it */

import assert from "assert";

import * as index from "../index.mjs";

describe('index.mjs', () => {
  describe('#transformRecipients()', () => {
    it('should transform recipients according to the provided mapping', async () => {
      const data = {
        recipients: ["info@example.com"],
        config: {
          forwardMapping: {
            "info@example.com": [
              "jim@example.com",
              "jane@example.com"
            ]
          }
        },
        log: console.log
      };
      const result = await index.transformRecipients(data);
      assert.equal(result.recipients[0], "jim@example.com", "parseEvent made 1/2 substitutions");
      assert.equal(result.recipients[1], "jane@example.com", "parseEvent made 2/2 substitutions");
    });

    it('should transform recipients in a case insensitive way', async () => {
      const data = {
        recipients: ["INFO@EXAMPLE.COM"],
        config: {
          forwardMapping: {
            "info@example.com": [
              "jim@example.com",
              "jane@example.com"
            ]
          }
        },
        log: console.log
      };
      const result = await index.transformRecipients(data);
      assert.equal(result.recipients[0], "jim@example.com", "parseEvent made 1/2 substitutions");
      assert.equal(result.recipients[1], "jane@example.com", "parseEvent made 2/2 substitutions");
    });

    it('should transform recipients according to a domain wildcard mapping', async () => {
      const data = {
        recipients: ["info@EXAMPLE.com"],
        config: {
          forwardMapping: {
            "@example.com": [
              "jim@example.com",
              "jane@example.com"
            ]
          },
          log: console.log
        }
      };
      const result = await index.transformRecipients(data);
      assert.equal(result.recipients[0], "jim@example.com", "parseEvent made 1/2 substitutions");
      assert.equal(result.recipients[1], "jane@example.com", "parseEvent made 2/2 substitutions");
    });

    it('should transform recipients according to a user wildcard mapping', async () => {
      const data = {
        recipients: ["info@foo.com"],
        config: {
          forwardMapping: {
            info: [
              "jim@example.com",
              "jane@example.com"
            ]
          },
          log: console.log
        }
      };
      const result = await index.transformRecipients(data);
      assert.equal(result.recipients[0], "jim@example.com", "parseEvent made 1/2 substitutions");
      assert.equal(result.recipients[1], "jane@example.com", "parseEvent made 2/2 substitutions");
    });

    it('should exit if there are no new recipients', async () => {
      const data = {
        recipients: ["noreply@example.com"],
        config: {
          forwardMapping: {
            "info@example.com": [
              "jim@example.com"
            ]
          }
        },
        log: console.log
      };
      const result = await index.transformRecipients(data);
      assert.ok(result.done, "transformRecipients set done flag");
    });

    it('should support matching a name without domain', async () => {
      const data = {
        recipients: ["info"],
        config: {
          forwardMapping: {
            info: [
              "jim@example.com"
            ]
          }
        },
        log: console.log
      };
      const result = await index.transformRecipients(data);
      assert.equal(result.recipients[0], "jim@example.com", "parseEvent made substitution");
    });

    it('should exit if the recipient is malformed', async () => {
      const data = {
        recipients: ["example.com"],
        config: {
          forwardMapping: {
            "@example.com": [
              "jim@example.com"
            ]
          }
        },
        log: console.log
      };
      const result = await index.transformRecipients(data);
      assert.ok(result.done, "transformRecipients set done flag");
    });

    it('should match plus sign email', async () => {
      const data = {
        recipients: ["info+testing@foo.com"],
        config: {
          forwardMapping: {
            "info@foo.com": [
              "jim@example.com"
            ]
          },
          allowPlusSign: true
        },
        log: console.log
      };
      const result = await index.transformRecipients(data);
      assert.equal(result.recipients[0], "jim@example.com", "parseEvent made substitution");
    });

    it('should support matching with catch all', async () => {
      const data = {
        recipients: ["info@example.com"],
        config: {
          forwardMapping: {
            "no-match@example.com": [
              "jim@example.com"
            ],
            "@": [
              "catch-all@example.com"
            ]
          }
        },
        log: console.log
      };
      const result = await index.transformRecipients(data);
      assert.equal(result.recipients[0], "catch-all@example.com", "parseEvent made substitution");
    });
  });
});
