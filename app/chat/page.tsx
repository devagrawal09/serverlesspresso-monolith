import { data } from "@ampt/data";
import { Subscribe } from "../lib/subscribe/server";
import { emitTo } from "../lib/subscribe/socket";

type Message = { from: string; content: string; time: number };

export default async function ChatPage() {
  const messages = await data.get<Message>("messages:*");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Chat</h1>
      <Subscribe to="messages" />
      <ul>
        {messages.items.map(({ value: m }) => (
          <li
            className="flex gap-4 m-2 p-3 border justify-between"
            key={m.time}
          >
            <h2>
              <span className="text-amber-800 font-semibold">{m.from}</span>
            </h2>
            <p>
              <span className="font-semibold">{m.content}</span>
            </p>
          </li>
        ))}
      </ul>
      <form
        className="flex gap-4"
        action={async function sendMessage(formData: FormData) {
          "use server";
          console.log(`sendMessage`);
          const from = formData.get("name") as string;
          const content = formData.get("content") as string;
          const time = Date.now();

          const msg = await data.set<Message>(`messages:${time}`, {
            from,
            content,
            time,
          });
          console.log({ msg });
          emitTo("messages");
        }}
      >
        <input
          className="border p-2"
          type="text"
          placeholder="Name"
          name="name"
        />
        <input
          className="border p-2"
          type="text"
          placeholder="Message"
          name="content"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
