import React from 'react';

export const Button = ({ children, ...props }: any) => <button {...props}>{children}</button>;
export const Input = (props: any) => <input {...props} />;
export const Label = ({ children, ...props }: any) => <label {...props}>{children}</label>;
export const Textarea = (props: any) => <textarea {...props} />;
export const Checkbox = (props: any) => <input type="checkbox" {...props} />;
export const Card = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const CardContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const CardFooter = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const CardHeader = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const CardTitle = ({ children, ...props }: any) => <h3 {...props}>{children}</h3>;

