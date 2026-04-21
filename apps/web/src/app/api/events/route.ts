// app/api/events/route.ts
import { mcpEventEmitter, getActionKey } from "@/lib/mcp-events";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "default";
  const projectId = searchParams.get("projectId") || "default";
  const roomKey = getActionKey(userId, projectId);

  const stream = new ReadableStream({
    start(controller) {
      const handler = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      mcpEventEmitter.on(roomKey, handler);

      // Đóng kết nối khi tab bị tắt
      req.signal.addEventListener("abort", () => {
        mcpEventEmitter.off(roomKey, handler);
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}