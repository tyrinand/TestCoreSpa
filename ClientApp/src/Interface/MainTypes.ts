import NumberFormat from 'react-number-format';

export type IFormMode = 'editMode' | 'createMode';

export interface IClient {
    id: number,
    name: string,
    mark: number
}

// интетефейс для слайдера 
export interface IMark {
    value: number,
    label: string
}

export type IComponentStatus = 'idle' | 'pending' | 'success' | 'error';


export interface PagesData<T> {
    currentPage: number,
    countPage: number,
    pageSize: number,
    items: Array<T>
}

export interface IClient {
    id: number,
    name: string,
    mark: number
}

export interface ISoft {
    id: number,
    name: string,
    description: string,
    price: number,
    count: number
}


export interface ISalesView {
    id: number,
    softName: string,
    priceOne: number,
    count: number,
    summ: number
    dateBuyStr: string,
    clientName: string,
}

export interface ISale {
    id: number,
    datebuy: string | undefined | null,
    count: number,
    summ: number,
    idClient: number | null,
    idSoft: number | null,
}

// данные для формы
export interface ISaleForm {
    sale: ISale,
    clients: Array<IClient>,
    softs: Array<ISoft>
}

export interface IAuthStatus {
    login: string | null
    isAuth: boolean,
    errorMessage: string | null
}

export interface IAuth {
    login: string,
    password: string
}

export interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat<string> | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}  