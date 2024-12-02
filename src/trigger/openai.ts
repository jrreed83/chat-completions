import { task } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openaiTask = task({
  id: "openai-task",
  //specifying retry options overrides the defaults defined in your trigger.config file
  retry: {
    maxAttempts: 10,
    factor: 1.8,
    minTimeoutInMs: 500,
    maxTimeoutInMs: 30_000,
    randomize: false,
  },
  run: async (payload: { prompt: string }) => {
    //if this fails, it will throw an error and retry
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: payload.prompt }],
      model: "gpt-3.5-turbo",
    });

    if (chatCompletion.choices[0]?.message.content === undefined) {
      //sometimes OpenAI returns an empty response, let's retry by throwing an error
      throw new Error("OpenAI call failed");
    }

    return chatCompletion.choices[0].message.content;
  },
});

