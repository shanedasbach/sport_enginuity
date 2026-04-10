import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import { resolve } from "path";

const CLI_PATH = resolve(__dirname, "index.ts");

function runCli(args: string[] = []): string {
  return execFileSync("npx", ["tsx", CLI_PATH, ...args], {
    encoding: "utf-8",
    timeout: 10000,
  }).trim();
}

describe("CLI entry point", () => {
  describe("version command", () => {
    it("should print the version", () => {
      const output = runCli(["version"]);
      expect(output).toBe("sport_enginuity v0.1.0");
    });
  });

  describe("help command", () => {
    it("should print usage information", () => {
      const output = runCli(["help"]);
      expect(output).toContain("sport_enginuity");
      expect(output).toContain("Usage: se <command>");
      expect(output).toContain("Commands:");
      expect(output).toContain("version");
      expect(output).toContain("help");
    });

    it("should list coming soon commands", () => {
      const output = runCli(["help"]);
      expect(output).toContain("Coming soon:");
      expect(output).toContain("query");
      expect(output).toContain("search");
      expect(output).toContain("serve");
    });
  });

  describe("default behavior", () => {
    it("should show help when no command is given", () => {
      const output = runCli([]);
      expect(output).toContain("Usage: se <command>");
    });

    it("should show help for unknown commands", () => {
      const output = runCli(["nonexistent"]);
      expect(output).toContain("Usage: se <command>");
    });
  });
});
