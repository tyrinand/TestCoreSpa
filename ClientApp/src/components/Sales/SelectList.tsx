import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { IClient, ISoft } from './../../Interface/MainTypes';

interface ISelectProps {
	labelTitle: string,
	labelId: string,
	htmlId: string,
	value: string | number | null,
	items: Array<IClient | ISoft>,
	emptyLabel: string,
	handelChange(event: React.ChangeEvent<{ value: unknown }>): void,
	error: boolean
}

const SelectList = (props: ISelectProps) => {

	if (props.items.length === 0) {
		return (
			<FormControl fullWidth error={props.error} >
				<InputLabel id={props.labelId} >{props.labelTitle}</InputLabel>
				<Select
					labelId={props.labelId}
					id={props.htmlId}
					value={props.value}
					onChange={props.handelChange}
					displayEmpty
				>
					<MenuItem value="" disabled>{props.emptyLabel}</MenuItem>
				</Select>
			</FormControl>
		);
	}

	if (props.items.length > 0) {
		return (
			<FormControl fullWidth error={props.error}  >
				<InputLabel id={props.labelId} >{props.labelTitle}</InputLabel>
				<Select
					labelId={props.labelId}
					id={props.htmlId}
					value={props.value}
					onChange={props.handelChange}
					displayEmpty
				>
					{
						props.items.map((item) => (
							<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
						))
					}
				</Select>
			</FormControl>
		);
	}

	return null;

}

export default SelectList;