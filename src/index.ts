#!/usr/bin/env node

/**
 * sport_enginuity — Unified sports data platform
 *
 * Three interfaces:
 *   1. REST API  — Programmatic access for developers
 *   2. CLI       — Terminal queries for analysts and data engineers
 *   3. AI Chatbot — Natural language queries for content creators
 *
 * Core value: Ingest from multiple providers, normalize into universal
 * entity IDs, and correlate stats + fantasy + betting data per entity.
 */

const command = process.argv[2];

const commands: Record<string, () => void> = {
  version: () => {
    console.log("sport_enginuity v0.1.0");
  },
  help: () => {
    console.log(`
sport_enginuity — Unified sports data platform

Usage: se <command> [options]

Commands:
  version     Show version
  help        Show this help message

Coming soon:
  query       Query normalized sports data
  search      Search for players, teams, games
  compare     Compare entities side-by-side
  odds        Query betting odds
  fantasy     Query fantasy projections
  standings   Show league standings
  status      Show API key usage and quota
  login       Authenticate with API key
  serve       Start the API server

Learn more: https://github.com/shanedasbach/sport_enginuity
    `.trim());
  },
};

const handler = commands[command ?? "help"] ?? commands["help"];
handler();
