type valueType = File | string;

export const getExtension = (value: valueType) => {
  if (typeof value === 'string' && value.includes('.')) {
    const extension = value.split('.').pop();
    return extension !== value ? extension : '';
  }

  if (value instanceof File) {
    return value.name.split('.').pop();
  }

  return '';
};

export const getExtensionWithPeriod = (value: valueType) => {
  if (typeof value === 'string' && value.includes('.')) {
    const extension = value.slice(value.lastIndexOf('.'));
    return extension !== value ? extension : '';
  }

  if (value instanceof File) {
    const extensionIndex = value.name.lastIndexOf('.');
    return extensionIndex !== -1 ? value.name.slice(extensionIndex) : '';
  }

  return '';
};
