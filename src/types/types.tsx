export type InvoiceItem = {
  id: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: string;
  issueDate: Date;
  dueDate: Date;
};

export type Trip = {
  id: string;
  startAddr: string;
  endAddr: string;
  distance: number;
  duration: number;
  price: number;
  mpg: number;
  pricePerLitre: number;
  hourlyRate: number;
};

export type FormFields = {
  email: string;
  password: string;
  issuedDate: Date;
  dueDate: Date;
};
