import swal from 'sweetalert2';
import {SpinnerUtil} from './spinner-utilities';

export function displayBackendError(resp: any) {

  const error = resp.error;

  if (error.description !== undefined) {
    swal.fire('', error.description, 'warning');
  } else if (error.message !== undefined) {
    swal.fire('', error.message, 'warning');
  } else {
    swal.fire('', 'An unknown error occurred.', 'error');
  }
}

export function displayErrorMessage(msg: string) {
  swal.fire('', msg, 'error');
}

export function hideSpinnerAndDisplayError(err: any) {
  SpinnerUtil.hideSpinner();
  displayBackendError(err);
}
