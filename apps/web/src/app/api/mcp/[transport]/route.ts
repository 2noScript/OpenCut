// app/api/[transport]/route.ts
// import { getActionKey, mcpEventEmitter } from "@/lib/mcp-events";
import { getActionKey, mcpEventEmitter } from "@/lib/mcp-events";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "roll_dice",
      {
        title: "Roll Dice",
        description: "Roll a dice with a specified number of sides.",
        inputSchema: {
          sides: z.number().int().min(2),
        },
      },
      async ({ sides }) => {
        const value = 1 + Math.floor(Math.random() * sides);
        return {
          content: [{ type: "text", text: `🎲 You rolled a ${value}!` }],
        };
      },
    );
    server.registerTool(
      "edit_canvas",
      {
        description: "Cập nhật element trên editor video",
        inputSchema: z.object({
          userId: z.string(),
          projectId: z.string(),
          type: z.enum(["text", "image", "sticker"]),
          content: z.string(),
        }),
      },
      async ({ userId, projectId, ...actionData }) => {
        // Logic phát sự kiện tới Browser
        mcpEventEmitter.emit(getActionKey(userId, projectId), actionData);

        return {
          content: [
            { type: "text", text: `Đã thực thi trên project ${projectId}` },
          ],
        };
      },
    );
  },
  {},
  {
    basePath: "/api/mcp", // must match where [transport] is located
    maxDuration: 60,
    verboseLogs: true,
  },
);

export { handler as GET, handler as POST };
