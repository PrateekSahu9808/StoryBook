import { checkEmpty } from './checkEmpty';

export default {
  title: 'Utils/isEmptyValue',
  component: checkEmpty,
};

export const Default = () => {
  const testCases = [
    { value: null, expected: true },
    { value: undefined, expected: true },
    { value: '', expected: true },
    { value: [], expected: true },
    { value: {}, expected: true },
    { value: 0, expected: true },
    { value: 'Hello', expected: false },
    { value: [1, 2, 3], expected: false },
    { value: { key: 'value' }, expected: false },
  ];

  return (
    <div>
      <h1>
        <u>checkEmpty(value)</u> - true / false
      </h1>
      {testCases.map((test, index) => (
        <div key={index}>
          checkEmpty( {JSON.stringify(test.value)} ) -
          {checkEmpty(test.value) ? 'True' : 'False'}
        </div>
      ))}
    </div>
  );
};
