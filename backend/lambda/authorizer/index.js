import jwt_decode from 'jwt-decode';

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, 2));
    const token = event.authorizationToken.replace('Bearer ', '');
    try {
        const decodedToken = jwt_decode(token);
        if ((decodedToken.exp * 1000) < new Date().getTime()) {
            throw new Error('Token expired!');
        }
        callback(null, generatePolicy(JSON.stringify(decodedToken), 'Allow', event.methodArn));
    } catch (error) {
        callback(`Error: ${error.message}`)
    }
}

function generatePolicy(principalId, effect, resource) {
    const authResponse = {principalId};
    if (effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        };
        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = {
        "stringKey": "stringVal",
        "numberKey": 123,
        "boleanKey": true
    }

    console.log(JSON.stringify(authResponse, null, 2));

    return authResponse;
}