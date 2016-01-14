import { bold } from 'chalk';

export const newLine = () => console.log(' ');

export const header = title => {
  console.log(bold.underline(title));
  newLine();
};

export const subheader = title => console.log(title);

export const footer = () => {
  newLine();
};
