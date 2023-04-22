import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';

interface IBtnEditProprs {
	url: string,
	id: number,
	className: string
}

const EditBtn = (props: IBtnEditProprs) => {
	let history = useHistory();

	const handelClick = () => {
		const url = `${props.url}/${props.id}`;
		history.push(url);
	}

	return (
		<EditIcon
			className={props.className}
			onClick={handelClick}
		/>
	)
}

export default EditBtn;