import {
  Attribute,
  CustomAttributeRegistry,
  Modifier
} from '@rhtml/custom-attributes';

@Modifier({
  selector: 'registry',
  registry(this) {
    return new CustomAttributeRegistry(this);
  }
})
export class Registry extends Attribute {}
