import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/components',
        'getting-started/state-management',
        'getting-started/controllers',
        'getting-started/modules',
        'getting-started/providers',
        'getting-started/testing',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/reactive-operators',
        'core-concepts/monadic-components',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'advanced/graphql',
        'advanced/decorators',
        'advanced/host-bindings-listeners',
        'advanced/mongoose',
        'advanced/amqp',
        'advanced/performance',
      ],
    },
  ],
};

export default sidebars;
