import { Construct, Duration, Stack, StackProps } from "@aws-cdk/core";
import { IResource } from '@aws-cdk/aws-apigateway/lib/resource';
import { LambdaRestApi, TokenAuthorizer } from '@aws-cdk/aws-apigateway';
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import SecureApi from "./secure-api";
import DictionaryStack from "./dictionary-db-stack";
import OpenApi from "./open-api";

export default class ApiStack extends Stack {
    public static readonly paths: any = {};
    public readonly apis: LambdaRestApi[] = [];
    public readonly apiBase: string = 'api/v1';

    addApi(resource: IResource, path: string, method: string, authorizer?: TokenAuthorizer) {
        resource = ApiStack.addResource(resource, path);

        if (authorizer) {
            resource.addMethod(method, undefined, {authorizer});
        } else {
            resource.addMethod(method);
        }
        ApiStack.addPath(resource);
        return resource;
    }
    
    public static addResource(resource: IResource, path: string) {
        if (path && path.includes('/')) {
            const paths = path.split('/');
            for(let i = 0; i < paths.length; i++) {
                resource = resource.addResource(paths[i]);
            }
        } else if (path) {
            resource = resource.addResource(path);
        }
        return resource;
    }

    public static addPath(resource: IResource) {
        let name = '';
        let firstResource = resource.parentResource;
        while(firstResource?.parentResource) {
            firstResource = firstResource.parentResource;
        }
        if(firstResource && firstResource.node && firstResource.node.scope) {
            name = firstResource.node.id || '';
        }
        if (!this.paths[name]) {
            this.paths[name] = [];
        }
        if (this.paths[name].includes(resource.path)) {
            if (resource.path.includes('{')) {
                this.paths[name].push(resource.path.replace(/{.*\*}/g, '*'));
            } else {
                this.paths[name].push(resource.path);
            }
        }   
    }

    constructor(scope: Construct, id: string, blogStack: DictionaryStack, props?: StackProps) {
        super(scope, id, props);

        const authorizer = new Function(this, 'authorizer', {
            functionName: 'authorizer',
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: Code.fromAsset('lambda/authorizer/dist'),
            timeout: Duration.seconds(30),
            memorySize: 1024
        });

       const dictionaryApi = new SecureApi(this, 'WapichanaDictionaryApi', blogStack.blogFuction, authorizer);
       const dictionaryResource = dictionaryApi.addMethod(`${this.apiBase}/entries`, ['GET', 'POST']);
       dictionaryApi.addMethod('{uri+}', ['PUT', 'GET', 'DELETE'], dictionaryResource);
       this.apis.push(dictionaryApi.api);

       const dictionaryOpenApi = new OpenApi(this, 'WapichanaDictionaryOpenApi', blogStack.blogFuction);
       const dictionaryOpenResource = dictionaryOpenApi.addMethod(`${this.apiBase}/posts`, ['GET']);
       dictionaryOpenApi.addMethod('{uri+}', ['GET'], dictionaryOpenResource);
       this.apis.push(dictionaryOpenApi.api);
    }
}