module.exports = {
  name: 'complaint-logger',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/complaint-logger',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
