import { S3 } from "aws-sdk";

const s3Client = new S3();

async function handler(event: any, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  console.log("here");
  return {
    statusCode: 200,
    body: "Here are your buckets:" + JSON.stringify(buckets.Buckets),
  };
}

export { handler };
