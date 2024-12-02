import React, { useMemo } from 'react';
import { IFormElements } from './FormElements.model';
import { Controller, useFormContext } from 'react-hook-form';
import Input from '@/shared/components/input/Input';
import { InputType, InputTypes } from '../input/input.types';
import { IFormElementsTypes } from './FormElements.type';

interface IProps {
  formControlName: string;
  config: IFormElements;
}

const { INPUT_TEXT, INPUT_NUMBER, INPUT_SEARCH } = InputType;

const FormElements = ({ formControlName, config }: IProps) => {
  const { control, formState } = useFormContext();
  const { errors } = formState || {};
  const { formCellType } = config || {};

  const inputType = useMemo(() => {
    switch (config.formCellType) {
      case INPUT_NUMBER:
        return 'number';
      case INPUT_SEARCH:
        return 'search';
      default:
        return 'text';
    }
  }, [config.formCellType]);

  const renderFormElement = useMemo(() => {
    const inputType = (cellType: IFormElementsTypes): InputTypes => {
      if (cellType === INPUT_NUMBER) {
        return 'input-number';
      } else if (cellType === INPUT_SEARCH) {
        return 'search';
      }
      return 'text';
    };

    switch (formCellType) {
      case INPUT_TEXT:
      case INPUT_NUMBER:
      case INPUT_SEARCH:
        return (
          <Controller
            name={formControlName}
            control={control}
            render={({ field }) => (
              <Input {...field} config={{ ...config, type: inputType(formCellType) }} error={errors[formControlName]?.message} />
            )}
          />
        );
      default:
        return null;
    }
  }, [formControlName, control, config]);

  return (
    <div className={`form-element ${config.styleClass || ''}`}>
      {config.header && (
        <label className="text-secondary text-sm" htmlFor={formControlName}>
          {config.header}
        </label>
      )}
      {renderFormElement}
    </div>
  );
};

export default FormElements;
