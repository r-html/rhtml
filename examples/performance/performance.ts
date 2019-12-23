import { html } from '@rxdi/lit-html';
import { Hydrate } from '@rhtml/experiments';
let startTime: number;
let lastMeasure: string;
const startMeasure = function(name: string) {
  startTime = performance.now();
  lastMeasure = name;
};
const stopMeasure = function() {
  const last = lastMeasure;
  if (lastMeasure) {
    setTimeout(function() {
      lastMeasure = null;
      const stop = performance.now();
      const duration = 0;
      console.log(last + ' took ' + (stop - startTime));
    }, 0);
  }
};

const Performance = html`
  <r-component>
    <r-selector>performance-test</r-selector>
    <r-props>
      <r-prop key="userId" type="String"></r-prop>
      <r-prop key="rows" type="Array"></r-prop>
    </r-props>
    <r-render .state=${({ rows }, setState) => html`
      <button
        @click=${() => {
          setState({
            rows: Array.from(Array(1), (v, i) => i).length
          });
          startMeasure('test');
        }}
      >
        Create 1 rows
      </button>
      <button
        @click=${() => {
          setState({
            rows: 0
          });
          setState({
            rows: Array.from(Array(100), (v, i) => i).length
          });
          startMeasure('test');
        }}
      >
        Create 100 rows
      </button>
      <button
        @click=${() => {
          setState({
            rows: 0
          });
          setState({
            rows: Array.from(Array(1000), (v, i) => i).length
          });
          startMeasure('test');
        }}
      >
        Create 1000 rows
      </button>

      <button
        @click=${() => {
          setState({
            rows: 0
          });
          setState({
            rows: Array.from(Array(10000), (v, i) => i).length
          });
          startMeasure('test');
        }}
      >
        Create 10000 rows
      </button>

      <button
        @click=${() => {
          setState({
            rows: 0
          });
          setState({
            rows: Array.from(Array(100000), (v, i) => i).length
          });
          startMeasure('test');
        }}
      >
        Create 100000 rows
      </button>

      <r-for .of=${rows}>
        <r-let
          .item=${(item, index) =>
            html`
                <p>${index}</p>
              ${index === rows - 1 ? stopMeasure() : ''}
            `}
        ></r-let>
      </r-for>
    `}>
    </r-render>
  </r-component>
`;

Hydrate(Performance);
