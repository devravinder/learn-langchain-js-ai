import { Router } from "express";
import type { Request, Response } from "express";
import aiService from "../services/aiService.js";

const chat: Router = Router();

chat.get("/", async (req: Request, res: Response) => {
  // Validate prompt
  const { prompt, sessionId = `user-session-${Date.now()}` } = req.query;
  if (typeof prompt !== "string" || !prompt.trim()) {
    res.status(400).send("Prompt must be a non-empty string");
    return;
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Keep-alive heartbeat
  const keepAlive = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 15000);

  // Handle client disconnect
  req.on("close", () => {
    clearInterval(keepAlive);
    res.end();
  });

  try {
    // Stream AI responses
    const resIterable = await aiService.query(prompt, sessionId);
    for await (const chunk of resIterable) {
      if (res.writable) {
        res.write(`data: ${chunk.toString()}\n\n`);
      }
    }
    if (res.writable) {
      res.write(`data: [DONE]\n\n`);
    }
  } catch (error) {
    if (res.writable) {
      res.write(`data: [ERROR] ${(error as any)?.message}\n\n`);
    }
  } finally {
    if (res.writable) {
      clearInterval(keepAlive);
      res.end();
    }
  }
});

export default chat;
