'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/lib/store';
import { increment, decrement, incrementByAmount } from '@/app/lib/features/counterSlice';

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
    </div>
  );
}

