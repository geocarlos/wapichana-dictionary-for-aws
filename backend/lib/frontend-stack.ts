import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { Construct } from 'constructs';
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { DnsValidatedCertificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { Bucket, HttpMethods, RedirectProtocol } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

import fs = require('fs');
import TaggingStack from "./tagging-stack";

export class FrontendStack extends TaggingStack {
	public readonly hostedZone: IHostedZone;
	public readonly hostedZoneAuth: IHostedZone;
	public readonly cert: ICertificate;
	public readonly bucket: Bucket;
	public readonly identityResource: OriginAccessIdentity;
	private domain: string;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		this.domain = 'dicionariowapichana.org';

		const identityName = 'accessIdentityWapichanaDictionary';
		this.identityResource = new OriginAccessIdentity(this, identityName, {
			comment: identityName
		});

		const bucketName = 'wapichana-s3-bucket-frontend-app';
		this.bucket = new Bucket(this, bucketName, {
			bucketName: bucketName,
			removalPolicy: RemovalPolicy.DESTROY,
			websiteIndexDocument: 'index.html',
			websiteErrorDocument: 'index.html',
			websiteRoutingRules: [
				{
					hostName: this.domain,
					httpRedirectCode: '302',
					protocol: RedirectProtocol.HTTPS
				},
				{
					hostName: `${this.domain}`,
					httpRedirectCode: '302',
					protocol: RedirectProtocol.HTTPS
				}
			],
			cors: [
				{
					allowedOrigins: ['http://localhost:3000', 'https://dicionariowapichana.org'],
					allowedMethods: [HttpMethods.GET],
					allowedHeaders: ['*']
				}
			]
		});

		this.bucket.grantRead(this.identityResource.grantPrincipal);

		this.hostedZone = HostedZone.fromLookup(this, 'HostedZoneWipichanaDictionary', {
			domainName: this.domain
		});

		this.cert = new DnsValidatedCertificate(this, 'wapichana-dictionary-validation-certificate', {
			domainName: this.domain,
			hostedZone: this.hostedZone,
			region: 'us-east-1',
			subjectAlternativeNames: [],
			
		});

		const frontendPath = '../build'
		if (fs.existsSync(frontendPath)) {
			new BucketDeployment(this, 'DeployWithoutInvalidationWD', {
				sources: [Source.asset(frontendPath)],
				destinationBucket: this.bucket,
				retainOnDelete: false,
				memoryLimit: 1024
			});
		}
	}
}