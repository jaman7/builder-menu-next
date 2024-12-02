import { IFormElementsTypes } from './FormElements.type';
import { IInput } from '../input/input.model';

export interface IFormElementsConfig {
  [name: string]: IFormElements;
}

export type IFormElements = Omit<IInput, 'type'> & {
  config?: IFormElements;
  header?: string;
  isHeader?: boolean;
  iconComponent?: JSX.Element;
  disabled?: boolean;
  formCellType?: IFormElementsTypes;
  value?: string | number | any | any[];
  type?: IFormElementsTypes;
  hidden?: boolean;
  styleClass?: string;
  prefix?: string;
  placeholder?: string;
  dictName?: string;
  name?: string;
  max?: number;
  min?: number;
  step?: number;
  [name: string]: any;
};

export const FormCellConfigDefault = (): IFormElements => ({
  step: 1,
  type: 'text',
});
