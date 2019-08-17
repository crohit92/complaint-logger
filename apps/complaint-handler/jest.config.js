module.exports = {
  name: 'complaint-handler',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/complaint-handler',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
