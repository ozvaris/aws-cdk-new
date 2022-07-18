import { v4 } from "uuid";

async function handler(event: any, context: any) {
  console.log("Go to event")
  console.log(event)
  return {
    statusCode: 200,
    body: "Hollo from Lambda!" + v4(),
  };
}

export { handler };
