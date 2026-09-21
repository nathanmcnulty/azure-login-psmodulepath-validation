import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const prepend = process.env.PREPEND_USR_SHARE === "true";
const repetition = process.env.REPETITION ?? "unknown";
const originalModulePath = process.env.PSModulePath ?? "";
const childEnv = {
  ...process.env,
  PSModulePath: prepend
    ? ["/usr/share", originalModulePath].filter(Boolean).join(":")
    : originalModulePath,
};

const command = [
  "$result = [ordered]@{",
  "  Success = $true",
  "  PSVersion = $PSVersionTable.PSVersion.ToString()",
  "  PSModulePath = $env:PSModulePath",
  "}",
  "$result | ConvertTo-Json -Compress",
].join("\n");

const start = process.hrtime.bigint();
const child = spawnSync("pwsh", ["-Command", command], {
  encoding: "utf8",
  env: childEnv,
});
const elapsedSeconds = Number(process.hrtime.bigint() - start) / 1e9;

const sample = {
  arm: prepend ? "prepend" : "clean",
  repetition: Number(repetition),
  elapsedSeconds,
  exitCode: child.status,
  signal: child.signal,
  imageOS: process.env.ImageOS ?? null,
  imageVersion: process.env.ImageVersion ?? null,
  runnerArch: process.env.RUNNER_ARCH ?? null,
  runnerEnvironment: process.env.RUNNER_ENVIRONMENT ?? null,
  stdout: child.stdout.trim(),
  stderr: child.stderr.trim(),
};

mkdirSync("results", { recursive: true });
const outputPath = `results/${sample.arm}-${repetition}.json`;
writeFileSync(outputPath, `${JSON.stringify(sample, null, 2)}\n`, "utf8");
console.log(JSON.stringify(sample));

if (child.status !== 0) {
  process.exit(child.status ?? 1);
}
