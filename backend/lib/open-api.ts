import { Function } from "aws-cdk-lib/aws-lambda";
import { Cors, IResource, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import ApiStack from "./api-stack";

export default class OpenApi {
   addMethod(path: string, methods: string[], onResource?: IResource): IResource {
      let resource = onResource || this.api.root;
      resource = ApiStack.addResource(resource, path);

      methods.forEach(m => {
         resource.addMethod(m);
      })

      ApiStack.addPath(resource);
      return resource;
   }

   public readonly api: LambdaRestApi;

   constructor(scope: Construct, apiName: string, lambda: Function) {
      this.api = new LambdaRestApi(scope, apiName, {
         restApiName: apiName,
         handler: lambda,
         proxy: false,
         deploy: true,
         deployOptions: {
            stageName: ''
         },
         defaultCorsPreflightOptions: {
            allowOrigins: ['http://localhost:3000', 'https://dicionariowapichana.org'],
            allowCredentials: true,
            allowMethods: Cors.ALL_METHODS
         },
         defaultMethodOptions: {
         }
      });
   }

}
