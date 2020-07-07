import React, {useState, useEffect} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import AddCar from './AddCar';
import EditCar from './EditCar';

function CarList() {

  const car_api = "https://carstockrest.herokuapp.com/cars";
  const [cars, setCars] = useState([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCar = (link) => {
    if(window.confirm("Are you sure?")) {
      fetch(link, {method : 'DELETE'})
      .then(res => {
        fetchData();
        setOpen(true);
      })
      .catch(err => console.error(err))
    }
  };

  const saveCar = (car) => {
    fetch(car_api, 
      {
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(car)
      }      

    )
    .then(res => fetchData())
    .catch(err => console.error(err))
  }

  const updateCar = (car, link) => {
    fetch(link, 
      {
        method : 'PUT',
        headers: {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(car)
      }      

    )
    .then(res => fetchData())
    .catch(err => console.error(err))
  }

  const fetchData = () => {
    fetch(car_api)
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
  };
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const columns = [
    {
      Header : 'Brand',
      accessor : 'brand'
    },
    {
      Header : 'Model',
      accessor : 'model'
    },
    {
      Header : 'Color',
      accessor : 'color'
    },
    {
      Header : 'Fuel',
      accessor : 'fuel'
    },
    {
      Header : 'Year',
      accessor : 'year'
    },
    {
      Header : 'Price',
      accessor : 'price'
    }, 
    {
      sortable : false,
      filterable : false,
      width : 120,
      Cell: row => <EditCar updateCar={updateCar} car={row.original} />
    },
    {
      sortable : false,
      filterable : false,
      width : 100,
      accessor : '_links.self.href',
      Cell: row => <Button size="small" color="secondary" onClick={() => deleteCar(row.value)}>Delete</Button>
    }

  ]
  return (
    <div className="CarList">
      
      <AddCar saveCar={saveCar} />
      <ReactTable filterable={true} data={cars} columns={columns} />
      <Snackbar 
        open={open}         
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        autoHideDuration={6000}
        message="Car deleted"
        onClose={handleClose}
      />
    </div>
  );
}

export default CarList;
