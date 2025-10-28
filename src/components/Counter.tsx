import { useState } from "react";

interface CounterProps {
  initialValue?: number;
}

const Counter = ({ initialValue = 0 }: CounterProps) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <div className="flex items-center gap-4 p-4">
      <button
        data-testid="decrement-button"
        onClick={decrement}
        aria-label="Decrease count"
        className="px-4 py-2 text-xl text-white font-medium rounded-lg border border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-colors"
      >
        -
      </button>
      <span
        data-testid="count-value"
        className="text-2xl font-semibold min-w-8 text-center"
      >
        {count}
      </span>
      <button
        data-testid="increment-button"
        onClick={increment}
        aria-label="Increase count"
        className="px-4 py-2 text-xl text-white font-medium rounded-lg border border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default Counter;
