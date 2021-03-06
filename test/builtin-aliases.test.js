import assert from "assert";
// eslint-disable-next-line import/no-unresolved
import async_hooks from "async_hooks";
import buffer from "buffer";
import child_process from "child_process";
import cluster from "cluster";
import crypto from "crypto";
import dgram from "dgram";
import dns from "dns";
// import domain from "domain";
import events from "events";
import fs from "fs";
import http from "http";
// import http2 from "http2";
import https from "https";
import net from "net";
import os from "os";
import path from "path";
// import perf_hooks from "perf_hooks";
import punycode from "punycode";
import querystring from "querystring";
import readline from "readline";
// import repl from "repl";
import stream from "stream";
import string_decoder from "string_decoder";
import tls from "tls";
import tty from "tty";
import url from "url";
import util from "util";
import v8 from "v8";
import vm from "vm";
import zlib from "zlib";

describe("builtin-aliases", () => {
  it("should use electron.require to import builtins instead of webpack require", () => {
    expect(assert).toBe(electron.require("assert"));
    expect(async_hooks).toBe(electron.require("async_hooks"));
    expect(buffer).toBe(electron.require("buffer"));
    expect(child_process).toBe(electron.require("child_process"));
    expect(cluster).toBe(electron.require("cluster"));
    expect(crypto).toBe(electron.require("crypto"));
    expect(dgram).toBe(electron.require("dgram"));
    expect(dns).toBe(electron.require("dns"));
    // expect(domain).toBe(electron.require("domain"));
    expect(events).toBe(electron.require("events"));
    expect(fs).toBe(electron.require("fs"));
    expect(http).toBe(electron.require("http"));
    // expect(http2).toBe(electron.require("http2"));
    expect(https).toBe(electron.require("https"));
    expect(net).toBe(electron.require("net"));
    expect(os).toBe(electron.require("os"));
    expect(path).toBe(electron.require("path"));
    // expect(perf_hooks).toBe(electron.require("perf_hooks"));
    expect(punycode).toBe(electron.require("punycode"));
    expect(querystring).toBe(electron.require("querystring"));
    expect(readline).toBe(electron.require("readline"));
    // expect(repl).toBe(electron.require("repl"));
    expect(stream).toBe(electron.require("stream"));
    expect(string_decoder).toBe(electron.require("string_decoder"));
    expect(tls).toBe(electron.require("tls"));
    expect(tty).toBe(electron.require("tty"));
    expect(url).toBe(electron.require("url"));
    expect(util).toBe(electron.require("util"));
    expect(v8).toBe(electron.require("v8"));
    expect(vm).toBe(electron.require("vm"));
    expect(zlib).toBe(electron.require("zlib"));
  });
});
