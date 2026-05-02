import '@abraham/reflection';

import { Flex } from './flex';
import { FlexAlign } from './flex-align';
import { FlexFill } from './flex-fill';
import { FlexOffset } from './flex-offset';
import { FlexOrder } from './flex-order';
import { LayoutAlign } from './layout-align';
import { LayoutGap } from './layout-gap';

function createMockElement() {
  return {
    style: {},
  } as HTMLElement;
}

describe('[Layout Modifiers]', () => {
  describe('fxFlex', () => {
    it('should set flex: 1 1 0.000000001px by default (empty value)', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 0.000000001px');
      expect(element.style.boxSizing).toBe('border-box');
      expect(element.style.minWidth).toBe('0');
    });

    it('should parse fxFlex="none" correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = 'none';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('none');
      expect(element.style.maxWidth).toBe('none');
    });

    it('should parse fxFlex="initial" correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = 'initial';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('initial');
      expect(element.style.maxWidth).toBeFalsy();
    });

    it('should parse fxFlex="auto" correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = 'auto';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 auto');
      expect(element.style.maxWidth).toBeFalsy();
    });

    it('should parse fxFlex="50%" correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '50%';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 50%');
      expect(element.style.maxWidth).toBe('100%');
    });

    it('should parse fxFlex="200px" correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '200px';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 200px');
      expect(element.style.maxWidth).toBe('100%');
    });

    it('should parse fxFlex="0" as percentage (0%)', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '0';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 0%');
      expect(element.style.maxWidth).toBe('100%');
    });

    it('should parse fxFlex="33" as percentage (33%)', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '33';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 33%');
      expect(element.style.maxWidth).toBe('100%');
    });

    it('should parse fxFlex="50" as percentage (50%)', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '50';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 50%');
      expect(element.style.maxWidth).toBe('100%');
    });

    it('should parse fxFlex="1 1 200px" (3-parts) correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '1 1 200px';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('1 1 200px');
      expect(element.style.maxWidth).toBeFalsy();
    });

    it('should parse fxFlex="0 0 50%" (no-grow) correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '0 0 50%';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('0 0 50%');
      expect(element.style.maxWidth).toBeFalsy();
    });

    it('should parse fxFlex="0 1 auto" correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '0 1 auto';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('0 1 auto');
      expect(element.style.maxWidth).toBeFalsy();
    });

    it('should parse fxFlex="2 0 0" (grow-only) correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '2 0 0';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('2 0 0');
      expect(element.style.maxWidth).toBeFalsy();
    });

    it('should parse fxFlex="0 0 300px" (fixed-width) correctly', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '0 0 300px';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.modify();

      expect(element.style.flex).toBe('0 0 300px');
      expect(element.style.maxWidth).toBeFalsy();
    });

    it('should clean up styles on destroy', () => {
      const element = createMockElement();
      const flex = new Flex();
      flex.element = element;
      flex.value = '50%';
      flex.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flex.clean();

      expect(element.style.boxSizing).toBeFalsy();
      expect(element.style.flex).toBeFalsy();
      expect(element.style.minWidth).toBeFalsy();
      expect(element.style.maxWidth).toBeFalsy();
    });
  });

  describe('fxFlexFill', () => {
    it('should set 100% width and height by default', () => {
      const element = createMockElement();
      const flexFill = new FlexFill();
      flexFill.element = element;
      flexFill.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexFill.OnInit();

      expect(element.style.width).toBe('100%');
      expect(element.style.height).toBe('100%');
      expect(element.style.minWidth).toBe('100%');
      expect(element.style.minHeight).toBe('100%');
      expect(element.style.margin).toBe('0');
    });

    it('should clean up styles on destroy', () => {
      const element = createMockElement();
      const flexFill = new FlexFill();
      flexFill.element = element;
      flexFill.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexFill.OnInit();
      flexFill.OnDestroy();

      expect(element.style.width).toBeFalsy();
      expect(element.style.height).toBeFalsy();
      expect(element.style.minWidth).toBeFalsy();
      expect(element.style.minHeight).toBeFalsy();
      expect(element.style.margin).toBeFalsy();
    });
  });

  describe('fxFlexOffset', () => {
    it('should set marginLeft correctly with "50px"', () => {
      const element = createMockElement();
      const flexOffset = new FlexOffset();
      flexOffset.element = element;
      flexOffset.value = '50px';
      flexOffset.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOffset.OnInit();

      expect(element.style.marginLeft).toBe('50px');
    });

    it('should set marginLeft correctly with "10%"', () => {
      const element = createMockElement();
      const flexOffset = new FlexOffset();
      flexOffset.element = element;
      flexOffset.value = '10%';
      flexOffset.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOffset.OnInit();

      expect(element.style.marginLeft).toBe('10%');
    });

    it('should set marginLeft to null when value is empty', () => {
      const element = createMockElement();
      const flexOffset = new FlexOffset();
      flexOffset.element = element;
      flexOffset.value = '';
      flexOffset.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOffset.OnInit();

      expect(element.style.marginLeft).toBeFalsy();
    });

    it('should clean up styles on destroy', () => {
      const element = createMockElement();
      const flexOffset = new FlexOffset();
      flexOffset.element = element;
      flexOffset.value = '50px';
      flexOffset.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOffset.OnInit();
      flexOffset.OnDestroy();

      expect(element.style.marginLeft).toBeFalsy();
    });
  });

  describe('fxFlexOrder', () => {
    it('should set order correctly with "2"', () => {
      const element = createMockElement();
      const flexOrder = new FlexOrder();
      flexOrder.element = element;
      flexOrder.value = '2';
      flexOrder.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOrder.OnInit();

      expect(element.style.order).toBe('2');
    });

    it('should set order correctly with "-1" for first item', () => {
      const element = createMockElement();
      const flexOrder = new FlexOrder();
      flexOrder.element = element;
      flexOrder.value = '-1';
      flexOrder.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOrder.OnInit();

      expect(element.style.order).toBe('-1');
    });

    it('should set order to null when value is empty', () => {
      const element = createMockElement();
      const flexOrder = new FlexOrder();
      flexOrder.element = element;
      flexOrder.value = '';
      flexOrder.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOrder.OnInit();

      expect(element.style.order).toBeFalsy();
    });

    it('should clean up styles on destroy', () => {
      const element = createMockElement();
      const flexOrder = new FlexOrder();
      flexOrder.element = element;
      flexOrder.value = '2';
      flexOrder.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexOrder.OnInit();
      flexOrder.OnDestroy();

      expect(element.style.order).toBeFalsy();
    });
  });

  describe('fxFlexAlign', () => {
    it('should set alignSelf correctly with "flex-end"', () => {
      const element = createMockElement();
      const flexAlign = new FlexAlign();
      flexAlign.element = element;
      flexAlign.value = 'flex-end';
      flexAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexAlign.modify();

      expect(element.style.alignSelf).toBe('flex-end');
    });

    it('should set alignSelf correctly with "center"', () => {
      const element = createMockElement();
      const flexAlign = new FlexAlign();
      flexAlign.element = element;
      flexAlign.value = 'center';
      flexAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexAlign.modify();

      expect(element.style.alignSelf).toBe('center');
    });

    it('should set alignSelf correctly with "flex-start"', () => {
      const element = createMockElement();
      const flexAlign = new FlexAlign();
      flexAlign.element = element;
      flexAlign.value = 'flex-start';
      flexAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexAlign.modify();

      expect(element.style.alignSelf).toBe('flex-start');
    });

    it('should set alignSelf to null when value is empty', () => {
      const element = createMockElement();
      const flexAlign = new FlexAlign();
      flexAlign.element = element;
      flexAlign.value = '';
      flexAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexAlign.modify();

      expect(element.style.alignSelf).toBeFalsy();
    });

    it('should clean up styles on destroy', () => {
      const element = createMockElement();
      const flexAlign = new FlexAlign();
      flexAlign.element = element;
      flexAlign.value = 'flex-end';
      flexAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      flexAlign.modify();
      flexAlign.clean();

      expect(element.style.alignSelf).toBeFalsy();
    });
  });

  describe('fxLayoutGap', () => {
    it('should set gap on the container element with "20px"', () => {
      const element = createMockElement();
      const layoutGap = new LayoutGap();
      layoutGap.element = element;
      layoutGap.value = '20px';
      layoutGap.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutGap.modify();

      expect(element.style.gap).toBe('20px');
    });

    it('should set gap on the container element with "15px"', () => {
      const element = createMockElement();
      const layoutGap = new LayoutGap();
      layoutGap.element = element;
      layoutGap.value = '15px';
      layoutGap.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutGap.modify();

      expect(element.style.gap).toBe('15px');
    });

    it('should set gap on the container element with "0px"', () => {
      const element = createMockElement();
      const layoutGap = new LayoutGap();
      layoutGap.element = element;
      layoutGap.value = '0px';
      layoutGap.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutGap.modify();

      expect(element.style.gap).toBe('0px');
    });

    it('should set gap on the container element with "1rem"', () => {
      const element = createMockElement();
      const layoutGap = new LayoutGap();
      layoutGap.element = element;
      layoutGap.value = '1rem';
      layoutGap.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutGap.modify();

      expect(element.style.gap).toBe('1rem');
    });

    it('should clean up gap on destroy by calling OnDestroy', () => {
      const element = createMockElement();
      const layoutGap = new LayoutGap();
      layoutGap.element = element;
      layoutGap.value = '20px';
      layoutGap.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutGap.modify();
      layoutGap.OnDestroy();

      expect(element.style.gap).toBeFalsy();
    });
  });

  describe('fxLayoutAlign', () => {
    it('should parse fxLayoutAlign="start start" correctly', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'start start';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.justifyContent).toBe('start');
      expect(element.style.alignItems).toBe('start');
    });

    it('should parse fxLayoutAlign="center center" correctly', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'center center';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.justifyContent).toBe('center');
      expect(element.style.alignItems).toBe('center');
    });

    it('should parse fxLayoutAlign="space-between center" correctly', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'space-between center';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.justifyContent).toBe('space-between');
      expect(element.style.alignItems).toBe('center');
    });

    it('should parse fxLayoutAlign="end center" correctly', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'end center';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.justifyContent).toBe('end');
      expect(element.style.alignItems).toBe('center');
    });

    it('should parse fxLayoutAlign="space-around start" correctly', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'space-around start';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.justifyContent).toBe('space-around');
      expect(element.style.alignItems).toBe('start');
    });

    it('should parse fxLayoutAlign="space-evenly end" correctly', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'space-evenly end';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.justifyContent).toBe('space-evenly');
      expect(element.style.alignItems).toBe('end');
    });

    it('should use mainAxis for crossAxis when only one value provided', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'center';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.justifyContent).toBe('center');
      expect(element.style.alignItems).toBe('center');
    });

    it('should set display: flex', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'start start';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.modify();

      expect(element.style.display).toBe('flex');
    });

    it('should clean up styles on destroy', () => {
      const element = createMockElement();
      const layoutAlign = new LayoutAlign();
      layoutAlign.element = element;
      layoutAlign.value = 'center';
      layoutAlign.setStyles = (styles) => (el) => {
        Object.assign(el['style'], styles);
      };
      layoutAlign.clean();

      expect(element.style.justifyContent).toBeFalsy();
      expect(element.style.alignItems).toBeFalsy();
      expect(element.style.display).toBeFalsy();
    });
  });
});
