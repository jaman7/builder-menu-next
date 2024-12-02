import { InputTypes } from './input.types';

export interface IInput {
  type?: InputTypes;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const inputConfigDefault = (): IInput => ({
  placeholder: '',
  step: 1,
  type: 'text',
});
