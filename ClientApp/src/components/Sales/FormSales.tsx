import React from 'react';
import NumberFormatPrice from './../FieldFormat/NumberFormatPrice';
import NumberFormatCount from './../FieldFormat/NumberFormatCount';
import { IFormMode, ISale, IComponentStatus, IClient, ISoft, ISaleForm } from './../../Interface/MainTypes';
import { useState, useEffect } from 'react';
import { get, post, put } from './../../Utils/Fetch';
import Loader from '../Common/Loader/Loader';
import ShowError from '../Common/ShowError/ShowError';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { serverUrlSales, serverUrlSalesForm } from './../../Interface/ServerRouteConst';
import { useParams } from 'react-router-dom';
import SelectList from './SelectList';
import { useHistory } from 'react-router-dom';

interface IProps {
	formMode: IFormMode
}

const FormSale = (props: IProps) => {

	const defaultSale: ISale = { id: 0, datebuy: null, count: 0, summ: 0, idClient: null, idSoft: null };

	const [error, setError] = useState<Error | null>(null);
	const [status, setStatus] = useState<IComponentStatus>('idle');
	const [showMessage, setShowMessage] = useState(false);
	const [valide, setValide] = useState<boolean>(true);
	const [sale, setSale] = useState<ISale>(defaultSale);
	const [clients, setClients] = useState<Array<IClient>>([]);
	const [softs, setSoft] = useState<Array<ISoft>>([]);
	const [priceOne, setPriceOne] = useState<number | null>(null);
	const { id } = useParams<{ id?: string }>();

	let history = useHistory();
  const GoToBack = () => history.goBack();

	const saleId: string = id ? id : "";
	const getFormUrl: string = `${serverUrlSalesForm}/${saleId}`;

	useEffect(() => {
		get<ISaleForm>(getFormUrl)
			.then((response: ISaleForm) => {
				if (props.formMode === 'editMode') {
					const softSelected = response.softs.find(soft => soft.id === response.sale.idSoft);
					if (softSelected)
						setPriceOne(softSelected.price);
				}
				setClients(response.clients);
				setSoft(response.softs);
				const sale = { ...response.sale, datebuy: getDateBuy(response.sale.datebuy) };
				setSale(sale);
				setStatus('success');
			})
			.catch((error: Error) => {
				setError(error);
				setStatus('success');
			})
	}, [getFormUrl, props.formMode]);

	const getDateBuy = (datebuy: string | undefined | null): string | undefined => {
		if (datebuy)
			return datebuy.split("T")[0];

		return undefined;
	}

	const handelCreateSale = (e: React.MouseEvent<HTMLButtonElement>) => {

		if (!CheckValide())
			return;

		if (sale !== null)
			props.formMode === 'editMode' ? UpdateSoft(sale) : CreateSale(sale);
	}

	const CheckValide = () => {
		let value: boolean = true;

		if (
			sale.count === 0 ||
			sale.datebuy === null ||
			sale.idClient === null ||
			sale.idSoft === null ||
			sale.summ === 0
		)
			value = false;

		setValide(value);
		return value;
	}

	const CreateSale = (newSale: ISale) => {

		post<ISale, boolean>(serverUrlSales, newSale)
			.then((response: boolean) => {
				setStatus('success');
				SaveChange();
				setShowMessage(true);
			})
			.catch((error: Error) => {
				setError(error);
				setStatus('error');
			})
	}

	const SaveChange = () => {
		setPriceOne(null);
		setSale(defaultSale);
	}

	const UpdateSoft = (sale: ISale) => {
		put<ISale, boolean>(serverUrlSales, sale)
			.then((response: boolean) => {
				setStatus('success');
				setShowMessage(true);
			})
			.catch((error: Error) => {
				setError(error);
				setStatus('error');
			})
	}

	const handleClose = () => {
		setShowMessage(false);
	};


	const handleChangeClient = (event: React.ChangeEvent<{ value: unknown }>) => {
		const value: number = Number(event.target.value);
		const newSale: ISale = { ...sale, idClient: value };
		setSale(newSale);
	};

	const handleChangeSoft = (event: React.ChangeEvent<{ value: unknown }>) => {
		const soft_id: number = Number(event.target.value);
		const softSelected = softs.find(soft => soft.id === soft_id);
		if (softSelected)
			UpdateField(sale.count, soft_id, softSelected.price);
	};

	const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: { value: count } } = e;
		UpdateField(Number(count), sale.idSoft, priceOne);
	}

	const UpdateField = (count: number, id_soft: number | null, price: number | undefined | null) => {

		if (price) {
			const summ = price * count;
			setPriceOne(price);
			const newSale: ISale = { ...sale, count: Number(count), summ: summ, idSoft: id_soft };
			setSale(newSale);
		}
	}

	const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { target: { value: date } } = event;
		const newSale: ISale = { ...sale, datebuy: date };
		setSale(newSale);
	};



	if (error) {
		return <ShowError message={error.stack ? error.stack : error.message} />
	}


	if (status === 'pending') {
		return (<Loader />);
	}

	if (status === "success") {
		return (
			<>
				<Grid container spacing={0} justifyContent="center" >
					<Grid item md={8}>
						<form autoComplete="off">
							<SelectList
								error={(valide || sale.idClient !== null) ? false : true}
								labelTitle="Клиент"
								labelId="sale-client-label"
								htmlId="sale-client"
								value={sale.idClient === null ? null : sale.idClient.toString()}
								handelChange={handleChangeClient}
								items={clients}
								emptyLabel="Добавить клиента"
							/>
							<br /><br />
							<SelectList
								error={(valide || sale.idSoft !== null) ? false : true}
								labelTitle="Софт"
								labelId="sale-soft-label"
								htmlId="sale-soft"
								value={sale.idSoft === null ? null : sale.idSoft.toString()}
								handelChange={handleChangeSoft}
								items={softs}
								emptyLabel="Добавить Софт"
							/>
							<br /><br />
							<TextField
								error={(valide || sale.datebuy !== null) ? false : true}
								id="sale-date"
								fullWidth
								label="Дата продажи"
								type="date"
								value={sale.datebuy === null ? "" : sale.datebuy}
								InputLabelProps={{ shrink: true }}
								onChange={handleChangeDate}
							/>
							<br /><br />
							<TextField
								error={(valide || sale.count > 0) ? false : true}
								id="softCount"
								label="Кол-во"
								fullWidth
								value={sale.count === 0 ? "" : sale.count}
								onChange={handleChangeCount}
								InputProps={{
									inputComponent: NumberFormatCount as any,
								}}
							/>
							<br /><br />
							<TextField
								label="Цена единицы"
								variant="filled"
								fullWidth
								disabled
								value={priceOne == null ? "" : priceOne}
								InputLabelProps={{ shrink: priceOne !== null }}
							/>
							<br /><br />
							<TextField
								label="Полная стоимоть"
								fullWidth
								variant="filled"
								disabled
								value={sale.summ === 0 ? "" : sale.summ}
								InputProps={{
									inputComponent: NumberFormatPrice as any,
								}}
								InputLabelProps={{ shrink: sale.summ !== 0 }}
							/>
							<br /><br />
							<Grid container spacing={2} justifyContent="center">
								<Grid item >
									<Button
										variant="outlined"
										color="secondary"
										size="small"
										onClick={GoToBack}
									>
										Назад
									</Button>
								</Grid>
								<Grid item >
									<Button
										variant="contained"
										color="primary"
										size="small"
										onClick={handelCreateSale}
									>
										Сохранить
									</Button>
								</Grid>
							</Grid>
						</form>
						<Snackbar
							open={showMessage}
							autoHideDuration={6000}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
						>
							<Alert onClose={handleClose} severity="success">
								Данные успешно сохранены
							</Alert>
						</Snackbar>
					</Grid>
				</Grid>
			</>
		)
	}

	return (<div>440</div>)
}
export default FormSale;