export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export interface GetToolsResponse {
  tools: Tool[];
} 