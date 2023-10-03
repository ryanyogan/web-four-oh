import { html as htmlMiddleware } from "@elysiajs/html";
import Elysia, { t } from "elysia";
import * as elements from "typed-html";

const app = new Elysia()
  .use(htmlMiddleware())
  .get("/", () => (
    <BaseHtml>
      <body
        class="flex w-full h-screen justify-center items-center"
        hx-get="/todos"
        hx-trigger="load"
        hx-swap="innerHTML"
      ></body>
    </BaseHtml>
  ))
  .post("/clicked", () => (
    <div class="text-blue-600">
      I come in peace, I am from the server, like 1999
    </div>
  ))
  .get("/todos", () => <TodoList todos={db} />)
  .post(
    "/todos/toggle/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id);
      if (todo) {
        todo.completed = !todo.completed;
        return <TodoItem {...todo} />;
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  )
  .listen(3000);

console.log(
  `🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);

const BaseHtml = ({ children }: elements.Children) => `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web 4.0</title>
    <script src="https://unpkg.com/htmx.org@1.9.3"></script>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>

  ${children}
</html>
`;

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

const db: Todo[] = [
  { id: 1, content: "learn the old new way", completed: true },
  { id: 2, content: "learn vim?", completed: false },
];

function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input type="checkbox" checked={completed} />
      <button class="text-red-500">X</button>
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
    </div>
  );
}
