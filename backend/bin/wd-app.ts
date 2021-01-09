#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import ThroughLettersAndCodeStack from '../lib/wd-stack';

const app = new cdk.App();
new ThroughLettersAndCodeStack(app, 'tlc-app');
