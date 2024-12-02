import type { ActionFunctionArgs } from "@remix-run/node";
import { tasks } from "@trigger.dev/sdk/v3";
import { helloWorldTask } from "src/trigger/example";


export async function action({ request }: ActionFunctionArgs) {

  
  const payload = await request.json();

  
  // Trigger the helloWorldTask with the webhook data as the payload
  await tasks.trigger<typeof helloWorldTask>("hello-world", payload);

  return new Response("OK", { status: 200 });
}
