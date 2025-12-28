import InputPriceField from '@/components/InputPriceField';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema: integer max 18 digits, decimal max 5 digits, optional leading '-'
const PriceSchema = z.object({
  price: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof PriceSchema>;

const Page2 = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(PriceSchema), defaultValues: { price: '' } });

  const onSubmit = (data: FormValues) => {
    // For demonstration, just log and alert
    console.log('Submitted:', data);
    alert('Submitted price: ' + data.price);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="price">Price</label>
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <InputPriceField
              {...field}
              // ensure the value is string
              value={field.value as string}
              onChange={field.onChange}
              name={field.name}
              decimalScale={3}
            />
          )}
        />
        {errors.price && <div style={{ color: 'red' }}>{String(errors.price.message)}</div>}

        <button type="submit" style={{ marginTop: 8 }}>
          Submit
        </button>
      </form>
    </>
  );
};

export default Page2;
