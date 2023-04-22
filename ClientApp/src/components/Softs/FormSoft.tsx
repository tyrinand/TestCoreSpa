import React from 'react';
import { ISoft, IFormMode, IComponentStatus } from '../../Interface/MainTypes';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get, post, put } from '../../Utils/Fetch';
import { serverUrlSofts } from '../../Interface/ServerRouteConst';
import Loader from '../Common/Loader/Loader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ShowError from '../Common/ShowError/ShowError';
import NumberFormatCount from '../FieldFormat/NumberFormatCount';
import NumberFormatPrice from '../FieldFormat/NumberFormatPrice';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';

interface IProps {
  formMode: IFormMode
}

function FormSoft(props: IProps) {

  const defaultSoft: ISoft = { id: 0, name: "", description: "", price: 0, count: 0 };

  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<IComponentStatus>('idle');
  const [showMessage, setShowMessage] = useState(false);
  const [valide, setValide] = useState<boolean>(true);
  const [soft, setSoft] = useState<ISoft>(defaultSoft);

  const { id } = useParams<{ id?: string }>();

  let history = useHistory();
  const GoToBack = () => history.goBack();

  useEffect(() => {
    if (id && props.formMode === 'editMode') {
      get<ISoft>(`${serverUrlSofts}/${id}`)
        .then((response: ISoft) => {
          setSoft(response);
          setStatus('success');
        })
        .catch((error: Error) => {
          setError(error);
          setStatus('error');
        })
    }
  }, []);


  const handelCreateSoft = (e: React.MouseEvent<HTMLButtonElement>) => {

    if (!CheckValide())
      return;

    props.formMode === 'editMode' ? UpdateSoft(soft) : CreateSoft(soft);
  }

  const CheckValide = () => {
    let value: boolean = true;

    if (
      soft.name.length === 0 ||
      soft.description.length === 0 ||
      soft.count === 0 ||
      soft.price === 0
    )
      value = false;

    setValide(value);
    return value;
  }

  //запрос создания софта
  const CreateSoft = (newClient: ISoft) => {

    post<ISoft, boolean>(serverUrlSofts, newClient)
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

  //запрос обновления софта
  const UpdateSoft = (client: ISoft) => {

    put<ISoft, boolean>(serverUrlSofts, client)
      .then((response: boolean) => {
        setStatus('success');
        setShowMessage(true);
      })
      .catch((error: Error) => {
        setError(error);
        setStatus('error');
      })
  }

  const SaveChange = () => {
    setSoft(defaultSoft);
  }


  const handleClose = () => {
    setShowMessage(false);
  };

  const handelChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: name } } = e;
    const newSoft: ISoft = { ...soft, name: name };
    setSoft(newSoft);
  }

  const handelChangeDes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: description } } = e;
    const newSoft: ISoft = { ...soft, description: description };
    setSoft(newSoft);
  }

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: price } } = e;
    const newSoft: ISoft = { ...soft, price: Number(price) };
    setSoft(newSoft);
  }

  const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value: count } } = e;
    const newSoft: ISoft = { ...soft, count: Number(count) };
    setSoft(newSoft);
  }

  if (error) {
    return <ShowError message={error.stack ? error.stack : error.message} />
  }

  if (status === 'pending') {
    return (<Loader />);
  }

  if (status === "success" || status === "idle") {
    return (
      <>
        <Grid container spacing={0} justifyContent="center" >
          <Grid item md={8}>
            <form autoComplete="off">
              <TextField
                error={(valide || soft.name.length > 0) ? false : true}
                id="softName"
                label="Наимнование"
                placeholder="Введите имя продукта"
                fullWidth
                onChange={handelChangeName}
                value={soft.name}
              />
              <br /><br />
              <TextField
                error={(valide || soft.description.length > 0) ? false : true}
                id="softDes"
                label="Описание"
                placeholder="Введите описание"
                fullWidth
                onChange={handelChangeDes}
                value={soft.description}
              />
              <br /><br />
              <TextField
                error={(valide || soft.price > 0) ? false : true}
                id="softPrice"
                label="Стоимость"
                fullWidth
                value={soft.price === 0 ? "" : soft.price}
                onChange={handleChangePrice}
                InputProps={{
                  inputComponent: NumberFormatPrice as any,
                }}
              />
              <br /><br />
              <TextField
                error={(valide || soft.count > 0) ? false : true}
                id="softCount"
                label="Кол-во"
                fullWidth
                value={soft.count === 0 ? "" : soft.count}
                onChange={handleChangeCount}
                InputProps={{
                  inputComponent: NumberFormatCount as any,
                }}
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
                    onClick={handelCreateSoft}
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

export default FormSoft;