import {Function} from "@aws-cdk/aws-lambda";
import {Cors, IResource, LambdaRestApi, TokenAuthorizer} from "@aws-cdk/aws-apigateway";
import {Construct, Duration} from "@aws-cdk/core";
import ApiStack from "./api-stack";

export default class SecureApi {
   addMethod(path: string, methods: string[], onResource?: IResource): IResource {
      let resource = onResource || this.api.root;
     resource = ApiStack.addResource(resource, path);

     methods.forEach(m => {
        resource.addMethod(m, undefined,{
           authorizer: this.authorizer
        });
     })

     ApiStack.addPath(resource);
     return resource;
   }

  public readonly api: LambdaRestApi;
  public readonly authorizer: TokenAuthorizer;

  constructor(scope: Construct, apiName: string, lambda: Function, authorizer: Function) {
     this.authorizer = new TokenAuthorizer(scope, apiName+'-auth', {
        handler: authorizer,
        resultsCacheTtl: Duration.seconds(0),
        authorizerName: apiName+'-auth'
     });

     this.api = new LambdaRestApi(scope, apiName, {
        restApiName: apiName,
        handler: lambda,
        proxy: false,
        deploy: true,
        deployOptions: {
           stageName: ''
        },
        defaultCorsPreflightOptions: {
           allowOrigins: ['http://localhost:3000'],
           allowCredentials: true,
           allowMethods: Cors.ALL_METHODS
        },
        defaultMethodOptions: {

        }
     });
  }

}
