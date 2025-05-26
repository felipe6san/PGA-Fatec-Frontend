import { useState, useCallback, ChangeEvent } from 'react';

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  resetForm: (newValues?: Partial<T>) => void;
  setValues: (values: Partial<T>) => void;
}

type ValidationFunction<T> = (values: T) => Partial<Record<keyof T, string>>;

/**
 * Hook para manipular valores de formulário
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: ValidationFunction<T>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateForm = useCallback(() => {
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  }, [values, validate]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      
      let parsedValue: any = value;
      
      if (type === 'number') {
        parsedValue = value === '' ? '' : Number(value);
      } else if (type === 'checkbox') {
        parsedValue = (e.target as HTMLInputElement).checked;
      }
      
      setValues(prev => ({
        ...prev,
        [name]: parsedValue,
      }));
      
      if (validate) {
        const validationErrors = validate({
          ...values,
          [name]: parsedValue,
        });
        
        setErrors(prev => ({
          ...prev,
          [name]: validationErrors[name as keyof T],
        }));
      }
    },
    [values, validate]
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }));
      
      if (validate) {
        const validationErrors = validate(values);
        setErrors(prev => ({
          ...prev,
          [name]: validationErrors[name as keyof T],
        }));
      }
    },
    [values, validate]
  );

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (validate) {
      const validationErrors = validate({
        ...values,
        [field]: value,
      });
      
      setErrors(prev => ({
        ...prev,
        [field]: validationErrors[field],
      }));
    }
  }, [values, validate]);

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, []);

  const resetForm = useCallback((newValues?: Partial<T>) => {
    setValues(prev => ({ ...initialValues, ...newValues }));
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    setValues: (newValues: Partial<T>) => setValues(prev => ({ ...prev, ...newValues })),
  };
} 