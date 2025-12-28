import InputPriceField from '@/components/InputPriceField';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { decimal, decimalRequired } from '@/utils/decimalSchema';

/**
 * Schema với tất cả các validation methods
 *
 * Lưu ý: Tất cả các field đều là string (không transform).
 * Chỉ khi validate mới parse string -> decimal để so sánh.
 */
const DecimalValidationSchema = z.object({
  // greaterThanOrEqual: giá trị >= 100
  greaterThanOrEqual: decimalRequired('Trường này là bắt buộc').greaterThanOrEqual(
    100,
    'Giá trị phải >= 100',
  ),

  // greaterThan: giá trị > 0
  greaterThan: decimalRequired('Trường này là bắt buộc').greaterThan(0, 'Giá trị phải > 0'),

  // lessThanOrEqual: giá trị <= 1000
  lessThanOrEqual: decimalRequired('Trường này là bắt buộc').lessThanOrEqual(
    1000,
    'Giá trị phải <= 1000',
  ),

  // lessThan: giá trị < 500
  lessThan: decimalRequired('Trường này là bắt buộc').lessThan(500, 'Giá trị phải < 500'),

  // equals: giá trị = 50
  equals: decimalRequired('Trường này là bắt buộc').equals(50, 'Giá trị phải = 50'),

  // isPositive: giá trị > 0
  isPositive: decimalRequired('Trường này là bắt buộc').isPositive('Giá trị phải là số dương'),

  // isNegative: giá trị < 0
  isNegative: decimalRequired('Trường này là bắt buộc').isNegative('Giá trị phải là số âm'),

  // isZero: giá trị = 0
  isZero: decimalRequired('Trường này là bắt buộc').isZero('Giá trị phải = 0'),

  // maxDecimalPlaces: tối đa 2 chữ số thập phân
  maxDecimalPlaces: decimalRequired('Trường này là bắt buộc').maxDecimalPlaces(
    2,
    'Tối đa 2 chữ số thập phân',
  ),

  // min: giá trị >= 10 (alias của greaterThanOrEqual)
  min: decimalRequired('Trường này là bắt buộc').min(10, 'Giá trị phải >= 10'),

  // max: giá trị <= 100 (alias của lessThanOrEqual)
  max: decimalRequired('Trường này là bắt buộc').max(100, 'Giá trị phải <= 100'),

  // range: giá trị trong khoảng 1-100
  range: decimalRequired('Trường này là bắt buộc').range(1, 100, 'Giá trị phải trong khoảng 1-100'),

  // Kết hợp nhiều validations
  combined: decimalRequired('Trường này là bắt buộc')
    .greaterThanOrEqual(10, 'Giá trị phải >= 10')
    .lessThanOrEqual(1000, 'Giá trị phải <= 1000')
    .maxDecimalPlaces(3, 'Tối đa 3 chữ số thập phân'),

  // Optional field (cho phép empty)
  optional: decimal('Giá trị phải là số hợp lệ')
    .greaterThanOrEqual(0, 'Nếu nhập thì phải >= 0')
    .maxDecimalPlaces(2, 'Tối đa 2 chữ số thập phân'),
});

type FormValues = z.infer<typeof DecimalValidationSchema>;

const Page3 = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(DecimalValidationSchema),
    mode: 'onChange', // Validate khi người dùng nhập
    reValidateMode: 'onChange', // Re-validate khi giá trị thay đổi
    defaultValues: {
      greaterThanOrEqual: '',
      greaterThan: '',
      lessThanOrEqual: '',
      lessThan: '',
      equals: '',
      isPositive: '',
      isNegative: '',
      isZero: '',
      maxDecimalPlaces: '',
      min: '',
      max: '',
      range: '',
      combined: '',
      optional: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
    alert('Form submitted successfully! Check console for data.');
  };

  const renderField = (
    name: keyof FormValues,
    label: string,
    description: string = '',
    decimalScale?: number,
  ) => (
    <div key={name} style={{ marginBottom: '20px' }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        {label}
      </label>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{description}</p>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputPriceField
            {...field}
            value={field.value as string}
            onChange={(val) => {
              console.log(`[Page3] Field ${name} changed to:`, val);
              field.onChange(val);
            }}
            name={field.name}
            decimalScale={decimalScale}
          />
        )}
      />
      {errors[name] && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {String(errors[name]?.message)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>Decimal Validation Methods Demo</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Thử nghiệm tất cả các custom validation methods cho decimal. Nhập các giá trị khác nhau để
        xem validation hoạt động.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {renderField('greaterThanOrEqual', 'Greater Than Or Equal (>= 100)')}

          {renderField('greaterThan', 'Greater Than (> 0)')}

          {renderField('lessThanOrEqual', 'Less Than Or Equal (<= 1000)')}

          {renderField('lessThan', 'Less Than (< 500)')}

          {renderField('equals', 'Equals (= 50)')}

          {renderField('isPositive', 'Is Positive (> 0)')}

          {renderField('isNegative', 'Is Negative (< 0)')}

          {renderField('isZero', 'Is Zero (= 0)')}

          {renderField('maxDecimalPlaces', 'Max Decimal Places (<= 2)', '', 3)}

          {renderField('min', 'Min (>= 10)')}

          {renderField('max', 'Max (<= 100)')}

          {renderField('range', 'Range (1-100)')}

          {renderField('combined', 'Combined Validations', '', 3)}

          {renderField('optional', 'Optional Field', '', 2)}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ marginBottom: '12px' }}>Hướng dẫn test:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>
            <strong>greaterThanOrEqual:</strong> Thử nhập 99 (sẽ lỗi), 100 (OK), 101 (OK)
          </li>
          <li>
            <strong>greaterThan:</strong> Thử nhập 0 (sẽ lỗi), -1 (sẽ lỗi), 1 (OK)
          </li>
          <li>
            <strong>lessThanOrEqual:</strong> Thử nhập 1001 (sẽ lỗi), 1000 (OK), 999 (OK)
          </li>
          <li>
            <strong>lessThan:</strong> Thử nhập 500 (sẽ lỗi), 499 (OK), 501 (sẽ lỗi)
          </li>
          <li>
            <strong>equals:</strong> Thử nhập 50 (OK), 49 (sẽ lỗi), 51 (sẽ lỗi)
          </li>
          <li>
            <strong>isPositive:</strong> Thử nhập -1 (sẽ lỗi), 0 (sẽ lỗi), 1 (OK)
          </li>
          <li>
            <strong>isNegative:</strong> Thử nhập 1 (sẽ lỗi), 0 (sẽ lỗi), -1 (OK)
          </li>
          <li>
            <strong>isZero:</strong> Thử nhập 0 (OK), 1 (sẽ lỗi), -1 (sẽ lỗi)
          </li>
          <li>
            <strong>maxDecimalPlaces:</strong> Thử nhập 1,23 (OK), 1,234 (sẽ lỗi)
          </li>
          <li>
            <strong>range:</strong> Thử nhập 0 (sẽ lỗi), 1 (OK), 100 (OK), 101 (sẽ lỗi)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Page3;
