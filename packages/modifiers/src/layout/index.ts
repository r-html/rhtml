import { Flex } from './flex';
import { FlexAlign } from './flex-align';
import { FlexFill } from './flex-fill';
import { FlexOffset } from './flex-offset';
import { FlexOrder } from './flex-order';
import { Layout } from './layout';
import { LayoutAlign } from './layout-align';
import { LayoutGap } from './layout-gap';
import { Registry } from './registry';

export * from './layout';

export const FlexLayout = [
  Registry,
  Layout,
  LayoutAlign,
  LayoutGap,
  FlexFill,
  Flex,
  FlexAlign,
  FlexOffset,
  FlexOrder,
];
