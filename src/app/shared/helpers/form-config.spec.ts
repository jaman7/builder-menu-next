import { IFormElementsConfig } from '../components/formElements/FormElements.model';
import { createConfigForm } from './form-config';

describe('createConfigForm', () => {
  it('should return an empty array when formConfig is empty', () => {
    const result = createConfigForm({});
    expect(result).toEqual([]);
  });

  it('should create a single form element with default config', () => {
    const formConfig = {
      name: { config: { placeholder: 'Enter your name', header: 'Name' } },
    };
    const result = createConfigForm(formConfig);
    expect(result).toEqual([
      {
        formControlName: 'name',
        type: undefined,
        config: {
          placeholder: 'Enter your name',
          header: 'Name',
          formCellType: 'input-text',
          value: null,
        },
      },
    ]);
  });

  it('should apply prefix correctly', () => {
    const formConfig: IFormElementsConfig = {
      email: { config: { placeholder: 'Enter email', header: 'Email' } },
    };
    const result = createConfigForm(formConfig, { prefix: 'user' });
    expect(result[0].config?.header).toBe('Email');
    expect(result[0].config?.placeholder).toBe('Enter email');
  });

  it('should support multiple form elements', () => {
    const formConfig: IFormElementsConfig = {
      name: { config: { placeholder: 'Enter name', header: 'Name' } },
      age: { config: { placeholder: 'Enter age', header: 'Age', formCellType: 'input-number' } },
    };
    const result = createConfigForm(formConfig);
    expect(result).toHaveLength(2);
    expect(result[1].config?.formCellType).toBe('input-number');
  });
});
