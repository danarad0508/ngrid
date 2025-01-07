/* eslint-disable */
export default {
  preset: './jest.preset.js',
  coverageDirectory: '../../coverage/libs/ngrid',

  setupFilesAfterEnv: ['<rootDir>/src/__test-runners/jest-test-setup.ts'],
  globals: {},
  displayName: 'ngrid',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        stringifyContentPathRegex: '\\.(html|svg)$',

        tsconfig: '<rootDir>/tsconfig.spec.jest.json',
      },
    ],
  },
};
