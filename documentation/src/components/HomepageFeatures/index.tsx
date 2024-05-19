import mountain from '@site/static/img/undraw_docusaurus_mountain.svg';
import undraw from '@site/static/img/undraw_docusaurus_react.svg';
import tree from '@site/static/img/undraw_docusaurus_tree.svg';
import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './styles.module.css';
type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: mountain,
    description: <>Generate scalable applications with ease</>,
  },
  {
    title: 'Reusable and maintainable',
    Svg: tree,
    description: (
      <>
        Write logic which can be reused and maintained for the future
        generations
      </>
    ),
  },
  {
    title: 'Inspired by @Angular',
    Svg: undraw,
    description: <>Use a dependency injection which you already know!</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
