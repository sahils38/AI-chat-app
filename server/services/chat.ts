import pool from "../db/index.js";
import { Message } from "./llm.js";

export interface Conversation {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface DBMessage {
  id: string;
  conversation_id: string;
  sender: "user" | "ai";
  content: string;
  created_at: Date;
}

export async function createConversation(): Promise<string> {
  const result = await pool.query<{ id: string }>(
    "INSERT INTO conversations DEFAULT VALUES RETURNING id"
  );
  return result.rows[0].id;
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const result = await pool.query<Conversation>(
    "SELECT * FROM conversations WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  content: string
): Promise<DBMessage> {
  const result = await pool.query<DBMessage>(
    `INSERT INTO messages (conversation_id, sender, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [conversationId, sender, content]
  );

  await pool.query(
    "UPDATE conversations SET updated_at = NOW() WHERE id = $1",
    [conversationId]
  );

  return result.rows[0];
}

export async function getConversationHistory(
  conversationId: string
): Promise<Message[]> {
  const result = await pool.query<DBMessage>(
    `SELECT sender, content FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  );

  return result.rows.map((row) => ({
    sender: row.sender,
    content: row.content,
  }));
}

export async function getMessages(conversationId: string): Promise<DBMessage[]> {
  const result = await pool.query<DBMessage>(
    `SELECT * FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  );
  return result.rows;
}
