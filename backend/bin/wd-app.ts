#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import WapichanaDictionaryAppStack from '../lib/wd-stack';

const app = new cdk.App();
new WapichanaDictionaryAppStack(app, 'wapichana-dictionary-app', {env: {region: 'us-east-2', account: '546135990880'}});
