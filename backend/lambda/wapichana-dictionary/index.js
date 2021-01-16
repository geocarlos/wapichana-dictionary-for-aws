const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();
const BASE_URL = '/api/v1/entries';
const TableName = 'wapichana-dictionary';

function getHeaders() {
    return {
        'Access-Control-Allow-Origin': '*'
    };
}

function fetchAllEntries() {
    const params = {
        TableName
    }

    return db.scan(params).promise()
        .then(data => {
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(data.Items)
            }
        })
        .catch(error => {
            return JSON.stringify(error);
        })
}

function fetchEntriesByFirstLetter(firstLetter) {
    const params = {
        TableName,
        IndexName: 'initialLetter',
        KeyConditionExpression: '#initialLetter = :firstLetter',
        ExpressionAttributeNames: {
            '#initialLetter': 'initialLetter'
        },
        ExpressionAttributeValues: {
            ':firstLetter': firstLetter
        }
    }

    return db.query(params).promise()
        .then(data => {
            console.log('Filtered by letter:', data);
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(data.Items)
            }
        })
        .catch(error => {
            console.log('Error:', error);
            return JSON.stringify(error);
        })
}

function createEntry(entry) {
    const params = {
        TableName,
        Item: entry
    }
    return db.put(params).promise()
        .then(data => {
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(data.Item)
            }
        })
        .catch(error => {
            return JSON.stringify(error);
        })
}

function updateEntry(entry) {
    const params = {
        TableName,
        Key: { entry_id: entry.entry_id },
        UpdateExpression: "set entry = :entry, definition = :definition",
        ExpressionAttributeValues: {
            ":entry": entry.entry,
            ":definition": entry.definition
        },
        ReturnValues: "UPDATED_NEW"

    }
    return db.update(params).promise()
        .then(data => {
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(data.Item)
            }
        })
        .catch(error => {
            return JSON.stringify(error);
        })
}

function getEntry(entry_id) {
    const params = {
        TableName,
        Key: { entry_id }
    }
    return db.get(params).promise()
        .then(data => {
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(data.Item)
            }
        })
        .catch(error => {
            return JSON.stringify(error);
        })
}

function deleteEntry(entry_id) {
    const params = {
        TableName,
        Key: { entry_id }
    }
    return db.delete(params).promise()
        .then(data => {
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        })
        .catch(error => {
            return JSON.stringify(error);
        })
}

exports.handler = (event) => {
    const path = event.resource.replace(BASE_URL, '');
    const method = event.httpMethod.toUpperCase();

    if (method === 'GET' && path === '' || path === '/') {
        const initialLetter = event.queryStringParameters ? event.queryStringParameters.initialLetter : null;
        if (initialLetter) {
            return fetchEntriesByFirstLetter(initialLetter);
        }
        return fetchAllEntries();
    } else if (method === 'GET' && path === '/{entry_id+}') {
        return getEntry(event.pathParameters.entry_id);
    } else if (method === 'PUT' && path === '/{entry_id+}') {
        return updateEntry(event.pathParameters.entry_id);
    } else if (method === 'POST' && path === '' || path === '/') {
        return createEntry(JSON.parse(event.body));
    } else if (method === 'DELETE' && path === '/{entry_id+}') {
        return deleteEntry(event.pathParameters.entry_id)
    } else {
        return {
            statusCode: 400,
            headers: getHeaders(),
            body: 'Method not supported'
        }
    }
}