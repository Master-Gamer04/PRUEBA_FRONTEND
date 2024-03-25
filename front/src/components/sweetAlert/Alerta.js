import Swal from 'sweetalert2';

const sweetAlert = () => {
    Swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
    })
    
    return (
        <div>
            <button onClick={sweetAlert}>Sweet Alert</button>
        </div>
    )
};

export default sweetAlert;

