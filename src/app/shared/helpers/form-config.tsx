import { IFormElementsConfig, IFormElements } from '@/shared/components/formElements/FormElements.model';
import { InputType } from '@/shared/components/input/input.types';

export const createConfigForm = (formConfig: IFormElementsConfig, params: { prefix?: string } = {}): IFormElements[] => {
  return Object.entries(formConfig).map(([name, config]) => {
    const { prefix } = params;
    const { formCellType } = (config as IFormElements) || {};
    const mergedConfig = {
      ...config,
      formControlName: name,
      formCellType: formCellType ?? InputType.INPUT_TEXT,
      header: config.header ?? `${prefix}.${name}`,
      placeholder: config.placeholder ?? `${prefix}.${name}`,
    };
    return mergedConfig;
  });
};
