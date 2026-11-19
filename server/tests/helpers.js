'use strict';

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

const OPENAPI_PATH = path.join(__dirname, '..', 'openapi.yaml');
const spec = yaml.load(fs.readFileSync(OPENAPI_PATH, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
// Explicit formats so results do not depend on the Ajv major version.
ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/);
ajv.addFormat('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
ajv.addFormat('uri-reference', /^\S+$/);
ajv.addSchema({ components: spec.components }, 'spec');

/** Returns a validator for `#/components/schemas/<name>`: (value) => { valid, errors }. */
function schemaValidator(name) {
  const validate = ajv.compile({ $ref: `spec#/components/schemas/${name}` });
  return (value) => ({
    valid: validate(value),
    errors: (validate.errors || []).map((e) => `${e.dataPath || e.instancePath || '(root)'} ${e.message}`),
  });
}

/** The documented success response of an operation: 200 for reads, 201 for POST /visits. */
function successResponse(operation) {
  return operation.responses['200'] ?? operation.responses['201'];
}

/** Schema name referenced by an operation's success JSON response. */
function responseSchemaName(operation) {
  const ref = successResponse(operation).content['application/json'].schema.$ref;
  return ref.split('/').pop();
}

/** All documented operations as [openapiPath, method, operation]. */
function operations() {
  return Object.entries(spec.paths).flatMap(([p, item]) =>
    Object.entries(item).map(([method, operation]) => [p, method, operation]),
  );
}

module.exports = { spec, schemaValidator, responseSchemaName, successResponse, operations };
