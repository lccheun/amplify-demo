import './App.css';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect } from 'react';
import { Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'

import Amplify, {API, graphqlOperation} from 'aws-amplify'
import aws_exports from './aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react';

import { listProducts } from './graphql/queries';
import { createProduct } from './graphql/mutations';
import { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { InputLabel } from '@material-ui/core';

import { v4 as uuidv4 } from 'uuid';

Amplify.configure(aws_exports);
Amplify.Logger.LOG_LEVEL = 'INFO';

function App() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [item, setItem] = useState({});

  useEffect(() => {
    fetchProduct();
  }, [])

  const fetchProduct = async () => {
    try {
      const productData = await API.graphql(graphqlOperation(listProducts));
      const productList = productData.data.listProducts.items;
      setProducts(productList)
    } catch (error) {
      console.log('error on fetching products', error)
    }
  }

  const handleClose = () => {
    setOpen(false);
    setSend(false);
  };

  const handleChange = (event) => {
    setItem({
      ...item,
      [event.target.name]: event.target.value
    });

    console.log('item', item)
  }

  const handleSave = async (event) => {   
    try {
      var d = new Date();

      const productItem = {
        id: uuidv4(),
        name: item.name,
        price: item.price
      }

      const productRecord = await API.graphql(graphqlOperation(createProduct, {
        input: productItem
      }))
    } catch (error) {
      console.log('error saving item', error)
    }

    setOpen(false);
  };

const addItem = async () => {
  setOpen(true)
}

  return (
    <div>
      <Container style={{ padding: '5em 0em' }}>
    <Message attached>
      <Message.Header>Create Product
        <IconButton aria-label="add" onClick={() => addItem()}>
                    <AddBoxIcon />
                  </IconButton></Message.Header>
    </Message>
    <Table attached='bottom' selectable>
      <Table.Header>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Price</Table.HeaderCell>
      </Table.Header>
      <Table.Body>

          { products.map((product, idx) => {
            return (

                  <Table.Row>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>${product.price}</Table.Cell>
                  </Table.Row>
            )
          })}
      </Table.Body>
    </Table>

    <Dialog open={open} onClose={() => handleClose()}>
    <DialogTitle id="alert-dialog-title">{"Create New Product"}</DialogTitle>
        <DialogContent>
          <form>
            <TextField name="name" label="Name" onChange={handleChange}></TextField><br/>
            <TextField name="price" label="Price" onChange={handleChange}></TextField><br/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
    </Dialog>
  </Container>
    </div>
  )
}

export default withAuthenticator(App);

//export default App;
