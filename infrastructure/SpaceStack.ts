import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private spacesTable = new GenericTable("SpacesTable", "spaceId", this);

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.main",
    });

    const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');

    const helloLambdaSdk = new NodejsFunction(this, "helloLambdaSdk", {
      entry: join(__dirname, "..", "services", "sdk-lambda", "hello.ts"),
      handler: "handler",
    });

    helloLambdaSdk.addToRolePolicy(s3ListPolicy);

    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLamdaResource = this.api.root.addResource("helloLambda");
    helloLamdaResource.addMethod("GET", helloLambdaIntegration);

    const helloLambdaNodeIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLamdaNodeResource = this.api.root.addResource("helloLambdaNodeJs");
    helloLamdaNodeResource.addMethod("GET", helloLambdaNodeIntegration);

    const helloLambdaSdkIntegration = new LambdaIntegration(helloLambdaSdk);
    const helloLamdaSdkResource = this.api.root.addResource("helloLambdaSdk");
    helloLamdaSdkResource.addMethod("GET", helloLambdaSdkIntegration);


    
  }
}
