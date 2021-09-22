import path = require('path');
import glob = require('glob');
import ajvValidate from 'ajv-cli/dist/commands/validate';
import { expect, jest, test } from '@jest/globals';

function validate(
  schema: string,
  otherSchemas: string,
  file: string,
  valid: boolean
) {
  return () => {
    let result = ajvValidate.execute({
      s: schema,
      r: otherSchemas,
      d: file,
      c: 'ajv-formats',
      _: [],
    });

    expect(result).toBe(valid);
  };
}

export default function tests(schema: string) {
  const schemaFile = path.resolve(
    path.dirname(__filename),
    `../dist/${schema}.json`
  );
  const otherSchemas = path.resolve(
    path.dirname(__filename),
    `../dist/!(${schema}).json`
  );
  const testResources = path.resolve(
    path.dirname(__filename),
    `./resources/${schema}`
  );

  glob
    .sync('valid/*.yml', {
      cwd: testResources,
    })
    .forEach((file) => {
      test(
        file,
        validate(
          schemaFile,
          otherSchemas,
          path.resolve(
            path.dirname(__filename),
            `./resources/${schema}/${file}`
          ),
          true
        )
      );
    });

  glob
    .sync('invalid/*.yml', {
      cwd: testResources,
    })
    .forEach((file) => {
      test(
        file,
        validate(
          schemaFile,
          otherSchemas,
          path.resolve(
            path.dirname(__filename),
            `./resources/${schema}/${file}`
          ),
          false
        )
      );
    });
}
