import { useState } from "react";
import { trpc } from "./lib/trpc";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const helloQuery = trpc.sayHello.useQuery({ name: name || undefined });
  const messagesQuery = trpc.getMessages.useQuery();
  const createMessageMutation = trpc.createMessage.useMutation({
    onSuccess: () => {
      messagesQuery.refetch();
      setMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    createMessageMutation.mutate({ content: message.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          tRPC + React + Fastify
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Hello World Example</CardTitle>
            <CardDescription>
              Enter your name to get a personalized greeting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {helloQuery.data && (
              <p className="text-lg font-semibold text-green-600">
                {helloQuery.data.greeting}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              Create and view messages stored in the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" disabled={createMessageMutation.isPending}>
                {createMessageMutation.isPending ? "Sending..." : "Send"}
              </Button>
            </form>

            <div className="space-y-2">
              {messagesQuery.isLoading && <p>Loading messages...</p>}
              {messagesQuery.data?.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 bg-white rounded-lg shadow-sm border"
                >
                  <p className="text-gray-800">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {messagesQuery.data?.length === 0 && (
                <p className="text-gray-500 text-center">
                  No messages yet. Create one!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
