import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Home from 'src/views/Home';

export default {
  title: 'Views/Home',
  component: Home,
} as ComponentMeta<typeof Home>;

const Template: ComponentStory<typeof Home> = () => <Home />;

export const Primary = Template.bind({});
