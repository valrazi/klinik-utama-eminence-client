import Swal from 'sweetalert2'

// Basic success alert
export const showSuccess = (title = 'Success', text = '', timer = 2000) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer,
    showConfirmButton: false,
  })
}

// Basic error alert
export const showError = (title = 'Error', text = '') => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#d33',
  })
}

// Confirmation dialog
export const showConfirm = async ({
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Yes',
  cancelButtonText = 'Cancel',
  confirmButtonColor = '#3085d6',
  cancelButtonColor = '#d33',
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
  })

  return result.isConfirmed
}

// Loading modal
export const showLoading = (title = 'Loading...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

// Close currently active Swal
export const closeSwal = () => {
  Swal.close()
}
