import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import * as constants from '../constants';

const SelectImage = (props: any) => {
  const history = useHistory();

  const onFileUpload = (e: any) => {
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (_) => {
        let imgData = reader.result;
        await convertToString(imgData);
        history.push(constants.create_mosaic_url);
      };
    }
  };
  const convertToString = (imgData: any) => {
    props.createImg(imgData);
  };
  return (
    <>
      <Button variant="contained" color="primary" component="label">
        Select Image
        <input hidden onChange={onFileUpload} type="file" accept="image/*" />
      </Button>
    </>
  );
};
export default SelectImage;
