import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { act } from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

it(`renders correctly`, async () => {
  let testRenderer: renderer.ReactTestRenderer;
  await act(async () => {
    testRenderer = renderer.create(<ThemedText>Snapshot test!</ThemedText>);
  });
  const tree = testRenderer!.toJSON();
  expect(tree).toMatchSnapshot();
});
