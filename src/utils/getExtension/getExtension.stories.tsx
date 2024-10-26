import { getExtension } from './getExtension';

export default {
  title: 'Utils/getExtension',
  component: getExtension,
};

export const Default = () => {
  const testCases = [
    { value:  'test.txt', expected: 'txt' },
  ];

  return (
    <div>
      {testCases.map((test, index) => (
        <div key={index}>
          getExtension( {JSON.stringify(test.value)} ) -
          {getExtension(test.value) ? 'True' : 'False'}
        </div>
      ))}
    </div>
  );
};
