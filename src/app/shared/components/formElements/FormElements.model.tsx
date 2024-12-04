import { IFormElementsTypes } from './FormElements.type';
import { IInput } from '../input/input.model';

export interface IFormElementsConfig {
  [name: string]: IFormElements;
}

export type IFormElements = Omit<IInput, 'type'> & {
  formControlName?: string;
  config?: IFormElements;
  header?: string;
  isHeader?: boolean;
  iconComponent?: JSX.Element;
  disabled?: boolean;
  formCellType?: IFormElementsTypes;
  value?: string | number | string[] | number[] | null;
  type?: IFormElementsTypes;
  hidden?: boolean;
  styleClass?: string;
  prefix?: string;
  placeholder?: string;
  name?: string;
  max?: number;
  min?: number;
  step?: number;
};

export const FormCellConfigDefault = (): IFormElements => ({
  step: 1,
  type: 'text',
});
