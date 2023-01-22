import { CfnOutput, StackProps } from "aws-cdk-lib";
import { Construct } from 'constructs';
import { AaaaRecord, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import {
	CloudFrontWebDistribution,
	HttpVersion,
	PriceClass,
	SecurityPolicyProtocol,
	SSLMethod,
	ViewerCertificate,
	ViewerProtocolPolicy,
	// Behavior,
	// SourceConfiguration,
	// CloudFrontAllowedMethods,
} from "aws-cdk-lib/aws-cloudfront";
import { FrontendStack } from "./frontend-stack";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import ApiStack from "./api-stack";
import TaggingStack from "./tagging-stack";

export class CloudfrontStack extends TaggingStack {
	private domain: string;

	// private static getBehaviors(paths: string[]): Behavior[] {
	// 	const behaviors: Behavior[] = []
	// 	for (let x = 0; x < paths.length; x++) {
	// 		behaviors.push({
	// 			pathPattern: paths[x],
	// 			allowedMethods: CloudFrontAllowedMethods.ALL,
	// 			forwardedValues: {
	// 				cookies: {
	// 					forward: "all"
	// 				},
	// 				queryString: true,
	// 				headers: [
	// 					'Authorization', 'authorization', 'AUTHORIZATION',
	// 					'Origin', 'origin', 'ORIGIN'
	// 				]
	// 			}
	// 		});
	// 	}
	// 	return behaviors;
	// }

	// private getCustomOriginForApi(api: ApiStack): SourceConfiguration[] {
	// 	return api.apis.map(a => {
	// 		return {
	// 			customOriginSource: {
	// 				domainName: `${a.restApiId}.execute-api.${this.region}.amazonaws.com`,
	// 				originPath: 'prod',
	// 			},
	// 			behaviors: CloudfrontStack.getBehaviors(ApiStack.paths[a.node.id])
	// 		}
	// 	})
	// }

	constructor(scope: Construct, id: string, frontend: FrontendStack, api?: ApiStack, props?: StackProps) {
		super(scope, id, props);
		this.domain = 'dicionariowapichana.org';

		const distribution = new CloudFrontWebDistribution(this, 'CloudFrontWebDistributionDicionarioWapichana', {
			defaultRootObject: '/index.html',
			comment: 'Front-end for Dicionário Wapichana',
			viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			priceClass: PriceClass.PRICE_CLASS_ALL,
			httpVersion: HttpVersion.HTTP2,
			viewerCertificate: ViewerCertificate.fromAcmCertificate(frontend.cert, {
				aliases: [this.domain],
				sslMethod: SSLMethod.SNI,
				securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021
			}),
			errorConfigurations: [
				{
					errorCode: 403,
					responseCode: 200,
					responsePagePath: '/index.html',
					errorCachingMinTtl: 300
				},
				{
					errorCode: 404,
					responseCode: 200,
					responsePagePath: '/index.html',
					errorCachingMinTtl: 300
				}
			],
			originConfigs: [
				{
					s3OriginSource: {
						s3BucketSource: frontend.bucket,
						originAccessIdentity: frontend.identityResource
					},
					behaviors: [
						{
							compress: true,
							isDefaultBehavior: true
						}
					]
				},
				// ...this.getCustomOriginForApi(api)
			],
		});

		new CfnOutput(this, 'distributionId', {
			exportName: 'WipichanaDictionaryDistributionID',
			value: distribution.distributionId
		});

		// IPv6
		new AaaaRecord(this, 'WDAliasIPv6', {
			zone: frontend.hostedZone,
			recordName: this.domain,
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution) as any)
		});

		// IPv4
		new ARecord(this, 'WDAliasIPv4', {
			zone: frontend.hostedZone,
			recordName: this.domain,
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution) as any)
		});
	}
}
