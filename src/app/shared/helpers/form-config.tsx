import { IFormElementsConfig, IFormElements } from '@/shared/components/formElements/FormElements.model';

export const createConfigForm = (
  formConfig: IFormElementsConfig,
  params: {
    prefix?: string;
  } = {}
): IFormElements[] => {
  return (
    Object.keys(formConfig)?.map((key: string) => {
      const { prefix } = params || {};
      const { config } = (formConfig[key] as IFormElements) || {};
      const { type, header, placeholder, value, formCellType } = config || {};
      return {
        formControlName: key,
        type,
        config: {
          ...(config ?? {}),
          prefix,
          formCellType: formCellType ?? 'input-text',
          header: header ?? `${prefix}.${key}`,
          placeholder: placeholder ?? `${prefix}.${key}`,
          value: value ?? null,
        },
      } as IFormElements;
    }) ?? []
  );
};
