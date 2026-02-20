import { faker } from '@faker-js/faker';

type Status = 'relationship' | 'complicated' | 'single';

export interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: Status;
}

const range = (len: number): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  age: faker.number.int({ min: 0, max: 30 }),
  visits: faker.number.int({ min: 0, max: 100 }),
  progress: faker.number.int({ min: 0, max: 100 }),
  status: faker.helpers.arrayElement(['relationship', 'complicated', 'single']),
});

export default function makeData(...lens: number[]): Person[] {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth];

    return range(len).map((): Person => {
      return {
        ...newPerson(),
      };
    });
  };

  return makeDataLevel();
}
