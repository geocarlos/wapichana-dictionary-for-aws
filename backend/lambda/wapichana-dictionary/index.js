const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const BASE_URL = '/api/v1/entries';
const TableName = 'wapichana-dictionary';

function getHeaders() {
    return {
        'Access-Control-Allow-Origin': '*'
    };
}

function fetchAllEntries() {
    return db.send(new ScanCommand({ TableName }))
        .then(data => {
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(data.Items)
            };
        })
        .catch(error => ({
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: error.message })
        }));
}

function searchEntries(search, searchLang) {
    const FilterExpression = searchLang === 'wp' ? 'contains (#entry, :search)' : 'contains (#definition, :search)';
    const ExpressionAttributeNames = searchLang === 'wp' ? { '#entry': 'entry' } : { '#definition': 'definition' };

    const params = {
        TableName,
        FilterExpression,
        ExpressionAttributeValues: {
            ':search': search
        },
        ExpressionAttributeNames
    };

    return db.send(new ScanCommand(params))
        .then(data => {
            const response = data.Items.reduce((ac, cv) => {
                if (!ac[cv.entry]) {
                    ac[cv.entry] = [cv];
                } else {
                    ac[cv.entry].push(cv);
                }
                return ac;
            }, {});
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(Object.values(response))
            };
        })
        .catch(error => ({
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: error.message })
        }));
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
    };

    return db.send(new QueryCommand(params))
        .then(data => {
            const response = data.Items.reduce((ac, cv) => {
                if (!ac[cv.entry]) {
                    ac[cv.entry] = [cv];
                } else {
                    ac[cv.entry].push(cv);
                }
                return ac;
            }, {});
            return {
                statusCode: 200,
                headers: getHeaders(),
                body: JSON.stringify(Object.values(response))
            };
        })
        .catch(error => {
            console.log('Error:', error);
            return {
                statusCode: 500,
                headers: getHeaders(),
                body: JSON.stringify({ error: error.message })
            };
        });
}

function createEntry(entry) {
    const params = {
        TableName,
        Item: entry
    };
    return db.send(new PutCommand(params))
        .then(() => ({
            statusCode: 200,
            headers: getHeaders(),
            body: JSON.stringify(params.Item)
        }))
        .catch(error => ({
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: error.message })
        }));
}

function updateEntry(entry) {
    const params = {
        TableName,
        Key: { entry_id: entry.entry_id },
        UpdateExpression: 'set #entry = :entry, definition = :definition',
        ExpressionAttributeNames: {
            '#entry': 'entry'
        },
        ExpressionAttributeValues: {
            ':entry': entry.entry,
            ':definition': entry.definition
        },
        ReturnValues: 'ALL_NEW'
    };
    return db.send(new UpdateCommand(params))
        .then(data => ({
            statusCode: 200,
            headers: getHeaders(),
            body: JSON.stringify(data.Attributes)
        }))
        .catch(error => ({
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: error.message })
        }));
}

function getEntry(entry) {
    const params = {
        TableName,
        IndexName: 'entry',
        KeyConditionExpression: '#entry = :entry',
        ExpressionAttributeNames: {
            '#entry': 'entry'
        },
        ExpressionAttributeValues: {
            ':entry': entry
        }
    };
    return db.send(new QueryCommand(params))
        .then(data => ({
            statusCode: 200,
            headers: getHeaders(),
            body: JSON.stringify(data.Items)
        }))
        .catch(error => ({
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: error.message })
        }));
}

function getEntryById(entry_id) {
    const params = {
        TableName,
        Key: { entry_id }
    };
    return db.send(new GetCommand(params))
        .then(data => ({
            statusCode: 200,
            headers: getHeaders(),
            body: JSON.stringify(data.Item)
        }))
        .catch(error => ({
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: error.message })
        }));
}

function deleteEntry(entry_id) {
    const params = {
        TableName,
        Key: { entry_id }
    };
    return db.send(new DeleteCommand(params))
        .then(data => ({
            statusCode: 200,
            headers: getHeaders(),
            body: JSON.stringify(data)
        }))
        .catch(error => ({
            statusCode: 500,
            headers: getHeaders(),
            body: JSON.stringify({ error: error.message })
        }));
}

exports.handler = (event) => {
    const path = event.resource.replace(BASE_URL, '');
    const method = event.httpMethod.toUpperCase();

    if (method === 'GET' && (path === '' || path === '/')) {
        const initialLetter = event.queryStringParameters ? event.queryStringParameters.initialLetter : null;
        const entry = event.queryStringParameters ? event.queryStringParameters.entry : null;
        const search = event.queryStringParameters ? event.queryStringParameters.search : null;
        const searchLang = event.queryStringParameters ? event.queryStringParameters.searchLang : 'wp';
        if (initialLetter) {
            return fetchEntriesByFirstLetter(initialLetter);
        } else if (entry) {
            return getEntry(entry);
        } else if (search) {
            return searchEntries(search, searchLang);
        }
        return fetchAllEntries();
    } else if (method === 'GET' && path === '/{entry_id+}') {
        return getEntryById(event.pathParameters.entry_id);
    } else if (method === 'PUT' && path === '/{entry_id+}') {
        return updateEntry(JSON.parse(event.body));
    } else if (method === 'POST' && (path === '' || path === '/')) {
        return createEntry(JSON.parse(event.body));
    } else if (method === 'DELETE' && path === '/{entry_id+}') {
        return deleteEntry(event.pathParameters.entry_id);
    } else {
        return {
            statusCode: 400,
            headers: getHeaders(),
            body: 'Method not supported'
        };
    }
};
