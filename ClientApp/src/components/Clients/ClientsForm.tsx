import React from 'react';
import { IFormMode, IMark, IClient, IComponentStatus } from './../../Interface/MainTypes';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get, post, put } from './../../Utils/Fetch';
import { serverUrlClients } from './../../Interface/ServerRouteConst';
import Loader from '../Common/Loader/Loader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import ShowError from '../Common/ShowError/ShowError';
import { useHistory } from 'react-router-dom';


//работа с ползунком
let marks: Array<IMark> = [];
for (let i: number = 1; i < 6; i++) {
	marks.push({ value: i, label: i.toString() } as IMark);
}

function valueLabelFormat(value: number) {
	return marks.findIndex((mark) => mark.value === value) + 1;
}

interface IProps {
	formMode: IFormMode
}

function FormClient(props: IProps) {

	const defaultClietn: IClient = { mark: 1, name: "", id: 0 };
	let history = useHistory();
	const GoToBack = () => history.goBack();

	const [error, setError] = useState<Error | null>(null);
	const [status, setStatus] = useState<IComponentStatus>('idle');
	const [client, setClient] = useState<IClient>(defaultClietn);

	const [showMessage, setShowMessage] = useState(false); // вывод подсказки 
	const [valide, setValide] = useState<boolean>(true); // валидность формы 
	const { id } = useParams<{ id?: string }>();


	useEffect(() => {
		if (id && props.formMode === 'editMode') {
			get<IClient>(`${serverUrlClients}/${id}`)
				.then((response: any) => {
					setClient(response);
					setStatus('success');
				})
				.catch((error: any) => {
					setError(error);
					setStatus('error');
				})
		}
	}, []);


	const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: { value: name } } = e;
		const newClient = { ...client, name: name };
		setClient(newClient);
	}

	const handelOnChangeMark = (event: object, value: number | number[]) => {
		if (typeof value === "number") {
			const newClient = { ...client, mark: value };
			setClient(newClient);
		}
	}

	const CreateClient = (newClient: IClient) => {
		post<IClient, boolean>(serverUrlClients, newClient)
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

	//запрос обновления клиента 
	const UpdateClinet = (client: IClient) => {

		put<IClient, boolean>(serverUrlClients, client)
			.then((response: boolean) => {
				setStatus('success');
				setShowMessage(true);
			})
			.catch((error: Error) => {
				setError(error);
				setStatus('error');
			})
	}


	const handelCreateClient = (e: React.MouseEvent<HTMLButtonElement>) => {

		if (!CheckValide())
			return;

		props.formMode === "editMode" ? UpdateClinet(client) : CreateClient(client);
	}

	const handleClose = () => {
		setShowMessage(false);
	};

	const SaveChange = () => {
		setClient({ mark: 1, name: "", id: 0 });
	}

	const CheckValide = () => {
		const value: boolean = client.name.length !== 0;
		setValide(value);
		return value;
	}

	if (error) {
		return <ShowError message={error.stack ? error.stack : error.message} />
	}

	if (status === 'pending')
		return <Loader />;

	if (status === "success" || status === 'idle') {
		return (
			<>
				<Grid container spacing={0} justifyContent="center">
					<Grid item md={8}>
						<form autoComplete="off">
							<TextField
								error={(valide || client.name.length > 0) ? false : true}
								id="clientName"
								label="Ф.И.О."
								placeholder="Введие Ф.И.О. клиента"
								fullWidth
								onChange={handelOnChange}
								value={client.name}
							/>
							<br /><br />
							<Typography gutterBottom>
								Оценка 
							</Typography>
							<Slider
								value={client.mark}
								valueLabelFormat={valueLabelFormat}
								aria-labelledby="discrete-slider-restrict"
								step={null}
								valueLabelDisplay="auto"
								marks={marks}
								min={1}
								max={5}
								onChange={handelOnChangeMark}
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
										onClick={handelCreateClient}
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

	return (
		<div>440</div>
	)

}

export default FormClient;