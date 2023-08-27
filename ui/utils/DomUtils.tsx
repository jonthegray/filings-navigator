import * as React from "react";

const getNewInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = Number(event.target.value);
  return Number.isNaN(value) || value === 0 ? null : value;
};

export {
  getNewInputValue
};
