import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import { createConfigForm } from '@/shared/helpers/form-config';
import FormElements from '@/shared/components/formElements/FormElements';
import { IFormElementsConfig } from '@/shared/components/formElements/FormElements.model';
import useNavigationStore, { INavItem } from '@/store/navigationStore';
import TrashIcon from '@/shared/components/icons/TrashIcon';

export const formConfig: IFormElementsConfig = {
  label: {
    placeholder: 'np. Promocje',
    header: 'Nazwa',
  },
  url: {
    formCellType: 'input-search',
    placeholder: 'Wklej lub wyszukaj',
    header: 'Link',
  },
};

export interface IFormData {
  url?: string | undefined;
  label: string;
}

interface IProps {
  data?: INavItem | null;
  parentId?: string | number | null;
  onSubmit: (data: INavItem | null) => void;
  onCancel: () => void;
}

const schema = yup.object({
  label: yup.string().required('Nazwa jest wymagana').max(50, 'Nazwa nie może przekraczać 50 znaków'),
  url: yup.string().test('conditional-url', 'Podaj poprawny URL lub odnośnik zaczynający się od #', (value) => {
    if (!value) return false;
    return /^#/.test(value) || yup.string().url().isValidSync(value);
  }),
});

const MenuForm: React.FC<IProps> = ({ data, parentId, onSubmit, onCancel }) => {
  const { addNavItem, updateNavItem, deleteNavItem } = useNavigationStore();

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { label: '', url: '' },
  });

  const { setValue, formState } = methods;
  const { isValid } = formState;

  useEffect(() => {
    const { label, url } = data || {};
    setValue('label', !parentId ? label || '' : '');
    setValue('url', !parentId ? url || '' : '');
  }, [data, parentId, setValue]);

  const handleSubmit = (formData: IFormData) => {
    const dataForm = { ...formData };
    const { id } = data || {};
    if (!id) addNavItem(dataForm, parentId ?? null);
    if (id) updateNavItem(id, dataForm);
    onSubmit(data as INavItem);
  };

  const handleDelete = () => {
    const { id } = data || {};
    if (id) {
      onSubmit(null);
      deleteNavItem(id);
    }
  };

  const formElements = createConfigForm(formConfig, { prefix: 'menu' });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="border-primary rounded-lg border border-solid bg-white p-6">
        <div className="grid grid-cols-[1fr,auto] gap-x-3">
          <div className="block w-full">
            {formElements?.map((config) => (
              <FormElements key={config.formControlName} formControlName={config.formControlName} config={config} />
            ))}
          </div>

          <div className="block">
            <Button round={true} handleClick={handleDelete} disabled={!data?.id}>
              <TrashIcon />
            </Button>
          </div>
        </div>

        <div className="flex gap-x-2 pt-5">
          <Button handleClick={onCancel} variant={ButtonVariant.SECONDARY}>
            Anuluj
          </Button>
          <Button type="submit" variant={ButtonVariant.TERTIARY} disabled={!isValid}>
            Zapisz
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MenuForm;
